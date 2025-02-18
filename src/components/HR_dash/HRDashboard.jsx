import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import'./hr.css';

const HRDashboard = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => console.error("Error fetching jobs", err));
  }, []);

  return (
    <div className="hr">
      <div className="hr_dash">
      <h1>Welcome HR 👋</h1>
      <Link to="/hr-dashboard/create-job" className="add_btn_hr">➕ Add Job</Link>
      </div>
      <div className="jobs">

        {jobs.map((job) => (
          <Link key={job.jobId} nav to={`/hr-dashboard/job/${job.jobId}`} className="job">
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
