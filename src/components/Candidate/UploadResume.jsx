import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./upload.css";
import { toast } from "react-toastify";

const UploadResume = () => {
  const { jobId } = useParams(); // Get Job ID from URL
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");  // New state for name
  const [email, setEmail] = useState(""); // New state for email
  const [linkedInProfile, setLinkedInProfile] = useState(""); // New state for LinkedIn Profile

  const handleUpload = async () => {
    if (!file || !name || !email) {
      toast.error("Please fill all fields and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("name", name);   // Send name
    formData.append("email", email); // Send email

    try {
      await axios.post(
        `http://localhost:5000/api/resumes/upload/${jobId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Resume uploaded successfully!");
      setFile(null); // Reset file input after upload
      setName("");   // Reset name field
      setEmail("");  // Reset email field
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      toast.error("Upload failed. Please try again.");
    }
  };

  return (
    <div className="upload-container">
      <h2>Please fill the details below..</h2>

      <div className="input-group">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="LinkedIn Profile "
          value={linkedInProfile}
          onChange={(e) => setLinkedInProfile(e.target.value)}
          className="input-field"
        />
      </div>

      <div className="upload-box">
        <input
          type="file"
          id="resumeInput"
          onChange={(e) => setFile(e.target.files[0])}
          className="upload-input"
        />
        <label htmlFor="resumeInput" className="upload-label">
          {file ? file.name : "Choose a file 📂"}
        </label>
      </div>

      <button onClick={handleUpload} className="upload-btn">
        🚀 Upload
      </button>
    </div>
  );
};

export default UploadResume;
