const express = require("express");
const multer = require("multer");
const Resume = require("../models/Resume");

const router = express.Router();

// ✅ Configure Multer to store file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Upload Resume and Store in MongoDB
router.post("/upload/:jobId", upload.single("resume"), async (req, res) => {
  try {
    console.log("➡️ File Upload Route Hit");

    if (!req.file || !req.body.name || !req.body.email) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ error: "Name, Email, and Resume are required" });
    }

    // ✅ Save the resume to MongoDB
    const newResume = new Resume({
      jobId: req.params.jobId,
      name: req.body.name,      // ✅ Store candidate's name
      email: req.body.email,    // ✅ Store candidate's email
      linkedInProfile: req.body.linkedInProfile,
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      fileData: req.file.buffer, // ✅ Store resume as binary in MongoDB
    });

    await newResume.save();
    console.log("✅ Resume successfully stored in MongoDB");

    res.status(201).json({ message: "Resume uploaded successfully", resumeId: newResume._id });
  } catch (error) {
    console.error("❌ Upload Error:", error);
    res.status(500).json({ error: "Error uploading resume" });
  }
});
router.get("/:jobId", async (req, res) => {
  try {
    const resumes = await Resume.find({ jobId: req.params.jobId });

    if (resumes.length === 0) {
      return res.status(404).json({ error: "No resumes found for this job ID" });
    }

    res.json(resumes); // ✅ Now includes `name` and `email`
  } catch (error) {
    console.error("❌ Error Fetching Resumes:", error);
    res.status(500).json({ error: "Error fetching resumes" });
  }
});
// ✅ Download a specific resume
router.get("/download/:resumeId", async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.resumeId);

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    res.set("Content-Type", resume.contentType);
    res.set("Content-Disposition", `attachment; filename=${resume.filename}`);
    res.send(resume.fileData);
  } catch (error) {
    console.error("Error Downloading Resume:", error);
    res.status(500).json({ error: "Error downloading resume" });
  }
});
module.exports = router;
