const express = require("express");
const Job = require("../models/Job");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

// Create a new job requirement
router.post("/create", async (req, res) => {
  try {
    const { title, description, requirements } = req.body;

    const newJob = new Job({
      jobId: uuidv4(),  // Generate a unique jobId
      title,
      description,
      requirements // Store as a dictionary
    });

    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    console.error("❌ Error creating job:", error);
    res.status(500).json({ error: "Error creating job" });
  }
});

// Get all job requirements
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Error fetching job requirements" });
  }
});

// Get the latest 5 job requirements for customer page
router.get("/latest", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }).limit(5);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Error fetching latest jobs" });
  }
});

module.exports = router;
