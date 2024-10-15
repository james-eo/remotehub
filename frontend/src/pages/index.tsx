import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { getJobs } from "../services/api";
import { useRouter } from "next/router";

interface Job {
  _id: string;
  title: string;
  company: {
    name: string;
  };
  location: string;
}

export default function Home() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await getJobs({ limit: 4 });
      setJobs(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching jobs");
      setLoading(false);
    }
  };
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    router.push({
      pathname: "/jobs",
      query: { ...router.query, search: searchTerm, page: 1 },
    });
  };

  return (
    <Layout>
      <div className="bg-white">
        <div className="relative bg-indigo-800">
          <div className="absolute inset-0">
            <img
              className="w-full h-full object-cover"
              src="/hero-background.jpg"
              alt="Remote work"
            />
            <div
              className="absolute inset-0 bg-indigo-800 mix-blend-multiply"
              aria-hidden="true"
            />
          </div>
          <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Find Your Dream Remote Job
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-xl text-indigo-100 max-w-3xl"
            >
              Discover thousands of remote opportunities from top companies
              around the world.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center"
            >
              <form onSubmit={handleSearch} className="sm:flex">
                <div className="min-w-0 flex-1">
                  <label htmlFor="search" className="sr-only">
                    Search jobs
                  </label>
                  <input
                    id="search"
                    type="text"
                    placeholder="Search jobs..."
                    className="block w-full px-4 py-3 rounded-md border-0 text-base text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300 focus:ring-offset-indigo-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <button
                    type="submit"
                    className="block w-full py-3 px-4 rounded-md shadow bg-indigo-500 text-white font-medium hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300 focus:ring-offset-indigo-700 sm:text-sm"
                  >
                    Search
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
            Featured Jobs
          </h2>
          <div className="grid gap-8 lg:grid-cols-2">
            {loading ? (
              <p>Loading jobs...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              jobs.map((job) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{job.company.name}</p>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <svg
                        className="h-5 w-5 mr-1 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657  16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
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
                    <Link
                      href={`/jobs/${job._id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      View Job
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/jobs"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View All Jobs
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
