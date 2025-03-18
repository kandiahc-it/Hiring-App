from fastapi import FastAPI, UploadFile, File, Form
from pymongo import MongoClient
import fitz  # PyMuPDF for PDFs
import docx
import io
import uuid
import spacy
from fuzzywuzzy import fuzz

app = FastAPI()

# MongoDB Connection
MONGO_URI = "mongodb+srv://seenivasanvaids2023:HeLt2HpnhGoQjGND@hiring-app.8m2sp.mongodb.net/?retryWrites=true&w=majority&appName=hiring-app"
client = MongoClient(MONGO_URI)
db = client["jobs"]
jobs_collection = db["jobs"]
resumes_collection = db["resumes"]

# Load NLP model
nlp = spacy.load("en_core_web_sm")

# Function to extract text from PDF
def extract_text_from_pdf(pdf_bytes):
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    text = "\n".join(page.get_text() for page in doc)
    return text

# Function to extract text from DOCX
def extract_text_from_docx(docx_bytes):
    doc = docx.Document(io.BytesIO(docx_bytes))
    text = "\n".join([para.text for para in doc.paragraphs])
    return text

# Function to fetch job requirements
def fetch_job_requirements(job_id):
    job = jobs_collection.find_one({"jobId": job_id})
    return job.get("requirements", {}) if job else {}

# Function to extract information from resume
def extract_information(text):
    doc = nlp(text)
    extracted_info = {}
    for ent in doc.ents:
        extracted_info[ent.label_] = extracted_info.get(ent.label_, []) + [ent.text]
    return extracted_info

# Function to score resumes
def score_resume(extracted_info, job_requirements):
    score = 0
    for key, values in job_requirements.items():
        if key in extracted_info:
            match_scores = [fuzz.partial_ratio(value, extracted_info[key]) for value in values]
            score += sum(match_scores) / len(values) if values else 0
    return score

# Function to process resumes
def process_resumes(job_id):
    job_requirements = fetch_job_requirements(job_id)
    if not job_requirements:
        return {"message": f"No job requirements found for job ID: {job_id}", "resumes": []}

    resumes = resumes_collection.find({"jobId": job_id})
    results = []

    for resume in resumes:
        extracted_info = extract_information(resume["text"])
        score = score_resume(extracted_info, job_requirements)
        results.append({"resumeId": str(resume["_id"]), "score": score})

    results.sort(key=lambda x: x["score"], reverse=True)
    return {"message": "Top resumes retrieved", "resumes": results[:10]}

# API Endpoint to Upload Resume
@app.post("/upload-resume/")
async def upload_resume(file: UploadFile = File(...), jobId: str = Form(...)):
    try:
        file_bytes = await file.read()
        
        # Extract text based on file type
        if file.filename.endswith(".pdf"):
            resume_text = extract_text_from_pdf(file_bytes)
        elif file.filename.endswith(".docx"):
            resume_text = extract_text_from_docx(file_bytes)
        else:
            return {"error": "Unsupported file type. Only PDF and DOCX are allowed."}

        # Store resume in MongoDB
        resume_data = {"jobId": jobId, "text": resume_text}
        resumes_collection.insert_one(resume_data)

        # Process resumes after upload
        ranked_resumes = process_resumes(jobId)

        return {"message": "Resume uploaded successfully", "ranked_resumes": ranked_resumes}
    
    except Exception as e:
        return {"error": str(e)} 

# Run API: uvicorn api:app --reload
