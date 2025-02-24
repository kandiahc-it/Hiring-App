import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './shortlist.css';

import { toast } from "react-toastify";
import Require from "../../Require/Require";
const ShortlistedCandidates = () => {
  const { jobId } = useParams(); // Get Job ID from URL
  console.log("Job ID:", jobId);

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [screening,setScreening] = useState(false);

  // Fetch shortlisted candidates
  useEffect(() => {
    fetchShortlistedCandidates();
  }, [jobId]);

  const fetchShortlistedCandidates = () => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/resumes/${jobId}`)
      .then((res) => {
        setCandidates(res.data); // Ensure candidates is an array
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching shortlisted candidates", err);
        setLoading(false);
      });
  };

  // Process resumes API call
  const processResumes = () => {
    setProcessing(true);
    axios
      .post(`http://localhost:8000/process-resumes/${jobId}`)
      .then((res) => {
        console.log("Processing Response:", res.data);
        toast.success("Resumes processed successfully!"); // Notify 
        setScreening(true);
        fetchShortlistedCandidates(); // Refresh the shortlisted candidates list
      })
      .catch((err) => {
        console.error("Error processing resumes", err);
        toast.error("Failed to process resumes.");
      })
      .finally(() => {
        setProcessing(false);
      });
  };
  const handleNotify = async () => {
    axios
      .post(`http://localhost:5000/api/notifications/notify/${jobId}`)
      .then((res) => {
        console.log("Notification Response:", res.data);
        toast.success("Notifications sent successfully!");
      })
      .catch((err) => {
        console.error("Error sending notifications", err);
        toast.error("Failed to send notifications.");
  });
}
  return (
    <div className="shortlisted">
      <Require jobid={jobId}/>
      <div className="shortlist-right">
      <h2>{screening ? "📋 Shortlisted Candidates":"Uploaded Candidates"}</h2>
      <div className="two-btns">
      <button onClick={processResumes} disabled={processing} className="process_btn">
        {processing ? "Processing..." : "🔄 Process Resumes"}
      </button>
      <button className="process_btn" onClick={handleNotify}>📩 Notify Candidates</button>
      </div>
      {loading ? (
        <div className="shortlisted_list" style={{"height":"100vh"}}>
        <p style={{"color":"white", "fontSize":"20px","fontWeight":"500"}}>Loading ...</p>
        </div>
      ) : candidates.length > 0 ? (
        <>
        <div className="shortlisted_list">
          {candidates.map((candidate,index) => (
            <div key={candidate._id} className="shortlisted_item" style={{backgroundColor: index<3 && screening?"#b0970c":"#fff"}}>
              {candidate.name}  
              <a
                href={`http://localhost:5000/api/resumes/download/${candidate._id}`}
                download
               className="download_btn_shortlist">
                📥
              </a>
            </div>
          ))}
        </div>
        
        </>

      ) : (
        <p>No shortlisted candidates available</p>
      )}
    </div>
    </div>
  );
};

export default ShortlistedCandidates;
