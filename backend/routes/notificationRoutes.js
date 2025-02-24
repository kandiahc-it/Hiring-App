const express = require("express");
const sendEmail = require("../services/emailService");
const sendLinkedInMessage = require("../services/LinkedinService");
const Resume = require("../models/Resume"); // Resume Model
const Job=require("../models/Job");
const router = express.Router();

// ✅ Route: Notify Shortlisted Candidates
router.post("/notify/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;
    console.log("Route hit");
    // 🔍 Get Shortlisted Candidates from MongoDB
    const shortlistedCandidates = await Resume.find({ jobId });
    const jobRole = await Job.findOne({ jobId: jobId });
   
   
    if (!shortlistedCandidates.length) {
      return res.status(404).json({ error: "No shortlisted candidates found" });
    }

    let emailResults = [];
    let linkedinResults = [];

    // 🔄 Loop through each candidate and send notifications
    for (const candidate of shortlistedCandidates) {
      const { email, name, linkedInProfile } = candidate;
      // console.log(jobRole);
      // ✅ Send Email
      const emailResponse = await sendEmail(email, name, jobRole.title); // Change job role dynamically
      emailResults.push(emailResponse);

      // ✅ Send LinkedIn Message (if profile exists)
    //   if (linkedInProfile) {
    //     const linkedinResponse = await sendLinkedInMessage(linkedInProfile, name, "Software Engineer");
    //     linkedinResults.push(linkedinResponse);
    //   }
    }

    return res.json({ message: "Notifications sent", emailResults, linkedinResults });
  } catch (error) {
    console.error("❌ Notification Error:", error);
    res.status(500).json({ error: "Error sending notifications" });
  }
});

module.exports = router;
