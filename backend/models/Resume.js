const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  name: { type: String, required: true },  // ✅ Store candidate's name
  email: { type: String, required: true }, // ✅ Store candidate's email
  jobId: { type: String, required: true },
  linkedInProfile: { type: String },
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  fileData: { type: Buffer, required: true },  // Store resume as binary data
});

module.exports = mongoose.model("Resume", ResumeSchema);
