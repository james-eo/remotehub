import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { motion } from "framer-motion";
import { getJob, addJobToHistory } from "../../services/api";

interface Job {
  _id: string;
  title: string;
  company: {
    name: string;
  };
  location: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
}

export default function JobDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [job, setJob] = useState<Job | null>(null);
  //   const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await getJob(id as string);
      setJob(response.data.data as Job);
      setLoading(false);
    } catch (err) {
      setError("Error fetching job details");
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (job) {
      try {
        await addJobToHistory({
          title: job.title,
          company: job.company.name,
          applicationStatus: "pending",
        });
        router.push("/dashboard");
      } catch (err) {
        setError("Error applying for job");
      }
    }
  };

  if (loading)
    return (
      <Layout title="Loading...">
        <div>Loading...</div>
      </Layout>
    );
  if (error)
    return (
      <Layout title="Error">
        <div>{error}</div>
      </Layout>
    );
  if (!job)
    return (
      <Layout title="Job Not Found">
        <div>Job not found</div>
      </Layout>
    );

  return (
    <Layout title={`RemoteHub - ${job.title}`}>
      <div className="bg-gray-100 min-h-screen py-12">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="px-6 py-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {job.title}
            </h1>
            <p className="text-xl text-gray-600 mb-4">{job.company.name}</p>
            <div className="flex items-center text-gray-500 mb-6">
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
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Salary Range
              </h2>
              <p className="text-gray-700">
                {job.salary
                  ? `$${job.salary.min} - $${job.salary.max} ${job.salary.currency}`
                  : "Not specified"}
              </p>
            </div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Job Description
              </h2>
              <p className="text-gray-700">{job.description}</p>
            </div>
            <div className="flex justify-center">
              <button
                className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleApply}
              >
                Apply Now
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
