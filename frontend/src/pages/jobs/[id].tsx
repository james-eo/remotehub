import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { getJob, Job } from "../../services/jobService";
import { motion } from "framer-motion";

export default function JobDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      const jobData = await getJob(id as string);
      setJob(jobData);
      setLoading(false);
    } catch (err) {
      setError("Error fetching job details");
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Layout title="Loading...">
        <div className="container mx-auto p-4">Loading...</div>
      </Layout>
    );
  if (error)
    return (
      <Layout title="Error">
        <div className="container mx-auto p-4">{error}</div>
      </Layout>
    );
  if (!job)
    return (
      <Layout title="Job Not Found">
        <div className="container mx-auto p-4">Job not found</div>
      </Layout>
    );

  return (
    <Layout title={`RemoteHub - ${job.title}`}>
      <div className="container mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-lg overflow-hidden"
        >
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {job.title}
            </h1>
            <p className="text-xl text-gray-600 mb-4">{job.company.name}</p>
            <div className="flex items-center text-gray-500 mb-4">
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {job.location}
            </div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Job Description
              </h2>
              <div className="prose max-w-none text-gray-700 mb-4 line-clamp-3">
                <p>{job.description}</p>
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Salary
              </h2>
              <p className="text-gray-700">
                {job.salary.min && job.salary.max
                  ? `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()}`
                  : "Salary not specified"}
              </p>
            </div>
            <div className="flex justify-center">
              <a
                href={job.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Apply for this job
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
