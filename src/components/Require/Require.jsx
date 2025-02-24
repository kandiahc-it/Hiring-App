import axios from 'axios';
import React, { useEffect, useState } from 'react'
import './Require.css'
const Require = ({jobid}) => {
    const [requirementdict,setRequirementdict] = useState({});
    const [alljobs,setAlljobs] = useState([]);
    const [loading,setLoading] = useState(true);
    const [title,setTitle] = useState("");
    useEffect(() => {
        axios.get(`http://localhost:5000/api/jobs`)
            .then((res) => {
                // Find the job that matches the given jobId
                const selectedJob = res.data.find(job => job.jobId === jobid);
                setTitle(selectedJob.title);
                console.log(selectedJob.title);
                if (selectedJob) {
                    setRequirementdict(selectedJob.requirements || {}); // Ensure it's an object
                } else {
                    setRequirementdict({});
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching requirements", err);
                setLoading(false);
            });
    }, [jobid]);
  return (
    <div className='require-bar'>
        <p className='tit-req'>Job Title: {title}</p>
        <h1>Requirements</h1>
        {loading ? (
            <p>Loading...</p>
        ) : (
            <div className='require-list'>
                {Object.entries(requirementdict).map(([key, value], index) => (
                    <div key={index} className='require-item-info'>
                        <div className='require-key-item'>{key.replace(/_/g, " ")}</div>{value}
                    </div>
                ))}
            </div>
        )}

    </div>
  )
}

export default Require