import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import './customer.css';

const CustomerPage = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => console.error("Error fetching jobs", err));
  }, []);

  return (
    <div className="customer-page">
      <h1>Latest Job Requirements ♨️</h1>
      <div className="jobs-list-cus">
        {jobs.map((job) => (
          <Link key={job.jobId} to={`/upload/${job.jobId}`} className="job-cus">
          <div key={job.jobId} className="">
            {job.title}
          </div></Link>
        ))}
      </div>
    </div>
  );
};

export default CustomerPage;
