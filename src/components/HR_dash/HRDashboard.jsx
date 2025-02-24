import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import'./hr.css';

const HRDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState(""); 
  const [allJobs, setAllJobs] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/jobs")
      .then((res) => {
        setAllJobs(res.data);  // Set complete list of jobs
        setJobs(res.data);      // Initially show all jobs
      })
      .catch((err) => console.error("Error fetching jobs", err));
  }, []);

  const search_jobs = (e) => {
    const query = e.target.value.toLowerCase();  // Convert input to lowercase
    setSearch(query);  // Update the search state with the new input
    
    // Filter the original jobs list (allJobs) and set it in the jobs state
    const filteredJobs = allJobs.filter((job) => job.title.toLowerCase().includes(query));
    setJobs(filteredJobs);  // Update jobs state with filtered jobs
  };

  return (
    <div className="hr">
      <div className="hr_dash">
        <h1>Dashboard</h1>
        <div className="search-bar">
        <input 
            type="text" 
            placeholder="Search for jobs" 
            value={search} 
            className="search-input"
            onChange={search_jobs} // Trigger search on input change
          />
          <button onClick={search_jobs} className="search-btn">Search</button> {/* Trigger search on button click */}
        
      </div>
      </div>
      <div className="jobs">

        {jobs.map((job) => (
          <Link key={job.jobId}  to={`/hr-dashboard/job/${job.jobId}`} className="job">
          <div  >
            {job.title}
          </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HRDashboard;
