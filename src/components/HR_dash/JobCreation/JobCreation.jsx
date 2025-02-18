import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './jobcreation.css'
const JobCreation = () => {
  const navigate = useNavigate();
  
  // Default requirements
  const defaultRequirements = {
    Degree: "",
    Certifications: "",
    Experience: "",
  };

  // State for job details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState(defaultRequirements);
  const [newRequirement, setNewRequirement] = useState({ key: "", value: "" });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/jobs/create", {
      title,
      description,
      requirements,
    });
    navigate("/hr-dashboard");
  };

  // Add a new requirement
  const handleAddRequirement = () => {
    if (newRequirement.key && newRequirement.value) {
      setRequirements({ ...requirements, [newRequirement.key]: newRequirement.value });
      setNewRequirement({ key: "", value: "" });
    }
  };

  // Remove a requirement
  const handleRemoveRequirement = (key) => {
    const updatedRequirements = { ...requirements };
    delete updatedRequirements[key];
    setRequirements(updatedRequirements);
  };

  return (
    <div className="job-creation">
      <h2 className="job-h2">Create Job</h2>
      <form onSubmit={handleSubmit} className="job-form">
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

        {/* Display existing requirements */}
        <div className="requirements-list">
          {Object.entries(requirements).map(([key, value]) => (
            <div key={key} className="requirement-item">
              <input
                type="text"
                value={key}
                disabled
                className="requirement-key"
              />
              <input
                type="text"
                placeholder={`Enter ${key}`}
                value={value}
                onChange={(e) => setRequirements({ ...requirements, [key]: e.target.value })}
              />
              <button type="button" className="remove-btn" onClick={() => handleRemoveRequirement(key)}>❌</button>
            </div>
          ))}
        </div>

        {/* Input fields to add new requirement */}
        <div className="new-requirement">
          <div className="requirement-item">
          <input
            type="text"
            placeholder="Requirement Key"
            value={newRequirement.key}
            onChange={(e) => setNewRequirement({ ...newRequirement, key: e.target.value })}
          />
          <input
            type="text"
            placeholder="Requirement Value"
            value={newRequirement.value}
            onChange={(e) => setNewRequirement({ ...newRequirement, value: e.target.value })}
          />
          </div>
          <button type="button" onClick={handleAddRequirement} className="add_btn">➕ Add Requirement</button>
        </div>

        <button type="submit" className="submitbtn">Create Job</button>
      </form>
    </div>
  );
};

export default JobCreation;
