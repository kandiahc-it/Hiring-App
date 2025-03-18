import io
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import fitz  # PyMuPDF for PDFs
import docx
import spacy
from fuzzywuzzy import fuzz

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# MongoDB Connection
MONGO_URI = "mongodb+srv://seenivasanvaids2023:HeLt2HpnhGoQjGND@hiring-app.8m2sp.mongodb.net/?retryWrites=true&w=majority&appName=hiring-app"
client = MongoClient(MONGO_URI)
db = client["jobs"]
jobs_collection = db["jobs"]
resumes_collection = db["resumes"]

# Load NLP model
nlp = spacy.load("en_core_web_sm")


# Extract text from PDF
def extract_text_from_pdf(pdf_bytes):
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        return "\n".join(page.get_text() for page in doc)
    except Exception as e:
        print(f"❌ Error extracting text from PDF: {e}")
        return ""


# Extract text from DOCX
def extract_text_from_docx(docx_bytes):
    try:
        doc = docx.Document(io.BytesIO(docx_bytes))
        return "\n".join([para.text for para in doc.paragraphs])
    except Exception as e:
        print(f"❌ Error extracting text from DOCX: {e}")
        return ""


# Fetch job requirements
def fetch_job_requirements(job_id):
    job = jobs_collection.find_one({"jobId": job_id})
    if not job:
        print(f"❌ No job found for jobId: {job_id}")
        return {}
    print(f"✅ Job Requirements for {job_id}: {job.get('requirements', {})}")
    return job.get("requirements", {})


# Extract key details from resume using NLP
def extract_information(text, job_requirements):
    doc = nlp(text)
    extracted_info = {key: [] for key in job_requirements.keys()}

    for ent in doc.ents:
        for key in job_requirements.keys():
            if fuzz.partial_ratio(ent.text.lower(), key.lower()) > 80:  # Improved fuzzy matching
                extracted_info[key].append(ent.text)

    return extracted_info


# Score resumes based on job requirements
def score_resume(extracted_info, job_requirements):
    score = 0
    details = []  # ✅ Store match details

    for key, values in job_requirements.items():
        if key in extracted_info:
            extracted_text = " ".join(extracted_info[key]) if isinstance(extracted_info[key], list) else extracted_info[key]
            match_scores = [fuzz.partial_ratio(value.lower(), extracted_text.lower()) for value in values if value]

            if match_scores:  # ✅ Avoid division by zero
                avg_score = sum(match_scores) / len(match_scores)
                score += avg_score
                details.append(f"{key}: {avg_score:.2f}")  # ✅ Store individual match reasons

    reason = " | ".join(details)  # ✅ Combine reasons into a single string
    return score, reason


# Process resumes and keep top 10
def process_resumes(job_id):
    job_requirements = fetch_job_requirements(job_id)
    if not job_requirements:
        return {"message": f"No job requirements found for job ID: {job_id}", "resumes": []}

    resumes = resumes_collection.find({"jobId": job_id})
    results = []

    for resume in resumes:
        try:
            file_bytes = resume.get("fileData")  # ✅ Handle missing file data
            content_type = resume.get("contentType", "")

            if not file_bytes:
                print(f"⚠️ Skipping empty resume: {resume.get('filename', 'Unknown')}")
                continue

            print(f"Processing resume: {resume.get('filename', 'Unknown')} (Type: {content_type})")

            # Extract text from binary file
            if content_type == "application/pdf":
                resume_text = extract_text_from_pdf(file_bytes)
            elif content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                resume_text = extract_text_from_docx(file_bytes)
            else:
                print(f"⚠️ Skipping unsupported file format: {content_type}")
                continue  

            if not resume_text.strip():
                print(f"❌ Empty resume text for {resume.get('filename', 'Unknown')}. Skipping...")
                continue  

            extracted_info = extract_information(resume_text, job_requirements)
            score, reason = score_resume(extracted_info, job_requirements)  # ✅ Get score and reason

            results.append({
                "resumeId": str(resume["_id"]),
                "score": score,
                "reason": reason,  # ✅ Add reason for selection
                "filename": resume.get("filename", "Unknown"),
                "name": resume.get("name", "Unknown"),
                "email": resume.get("email", "Unknown"),
                "linkedInProfile": resume.get("linkedInProfile", "Unknown"),
                "fileData": file_bytes  # ✅ Store fileData for top resumes later
            })
        except Exception as e:
            print(f"❌ Error processing resume {resume.get('filename', 'Unknown')}: {e}")

    # Sort and keep top 10
    results.sort(key=lambda x: x["score"], reverse=True)
    top_resumes = results[:10]

    # Delete all existing resumes for this job
    resumes_collection.delete_many({"jobId": job_id})

    # Insert the top resumes with additional fields
    for res in top_resumes:
        resumes_collection.insert_one({
            "jobId": job_id,
            "name": res["name"],
            "email": res["email"],
            "linkedInProfile": res["linkedInProfile"],
            "filename": res["filename"],
            "contentType": "application/pdf" if res["filename"].endswith(".pdf") else "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "fileData": res["fileData"],  # ✅ Corrected fileData handling
            "details": res["reason"]  # ✅ Store reason for selection in MongoDB
        })

    return {
        "message": "Top 10 resumes stored",
        "resumes": [{"resumeId": res["resumeId"], "score": res["score"], "reason": res["reason"]} for res in top_resumes]
    }


# API Endpoint to Process Resumes
@app.post("/process-resumes/{jobId}")
async def process_resumes_endpoint(jobId: str):
    try:
        ranked_resumes = process_resumes(jobId)
        return {"message": "Resumes processed successfully", "ranked_resumes": ranked_resumes}
    except Exception as e:
        print(f"❌ Server Error: {e}")
        return {"error": "Internal Server Error"}


# API Root Route
@app.get("/")
async def root():
    return {"message": "FastAPI Resume Processing System Running!"}