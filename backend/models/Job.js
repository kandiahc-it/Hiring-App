const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  jobId: { type: String, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  
  // Storing requirements as a flexible dictionary (key-value pairs)
  requirements: { type: Map, of: String },  

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Job", JobSchema);
