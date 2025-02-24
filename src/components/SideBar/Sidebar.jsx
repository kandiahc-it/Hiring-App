import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";
const Sidebar = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [allJobs, setAllJobs] = useState([]);
  const [width, setWidth] = useState(false);
  const btntexton=<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z"/></svg>
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/jobs")
      .then((res) => {
        setAllJobs(res.data); // Set complete list of jobs
        setJobs(res.data); // Initially show all jobs
      })
      .catch((err) => console.error("Error fetching jobs", err));
  }, []);
  const search_jobs = (e) => {
    const query = e.target.value.toLowerCase(); // Convert input to lowercase
    setSearch(query); // Update the search state with the new input

    // Filter the original jobs list (allJobs) and set it in the jobs state
    const filteredJobs = allJobs.filter((job) =>
      job.title.toLowerCase().includes(query)
    );
    setJobs(filteredJobs); // Update jobs state with filtered jobs
  };
  const openToggle = () => {
    setWidth((prev) => !prev);
  };
  return (
    <>
    <button type="" className="sidebar-toggle" onClick={openToggle}>
        {btntexton}
      </button>
    <div className="sidebar" style={width ? { width: `250px` } : { width: "0px" }}>
      
      <div
        className="side-bar-wrap"
        style={width ? { display: "block" } : { display: "none" }}
      >
        <div className="sidebar-search">
          <input
            type="text"
            placeholder="Search for jobs"
            value={search}
            className="search-input"
            onChange={search_jobs} // Trigger search on input change
          />
          <button onClick={search_jobs} className="search-btn">
            Search
          </button>{" "}
          {/* Trigger search on button click */}
        </div>
        <div className="sidebar-item">
          <h2>Jobs</h2>
          <ul>
            {jobs.map((job) => (
              <li key={job.jobId} className="job-item">
                <Link to={`/hr-dashboard/job/${job.jobId}`}>{job.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    </>
  );
};

export default Sidebar;
