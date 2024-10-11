import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listJobs } from "../actions/jobActions";

const JobList = () => {
  const dispatch = useDispatch();

  const jobList = useSelector((state) => state.jobList);
  const { loading, error, jobs } = jobList;

  useEffect(() => {
    dispatch(listJobs()); // Fetch the jobs when the component mounts
  }, [dispatch]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job._id}>{job.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JobList;
