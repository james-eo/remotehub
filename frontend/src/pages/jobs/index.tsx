import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { motion } from "framer-motion";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { getJobs, Job, JobFilters } from "../../services/jobService";

export default function Jobs() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState<JobFilters>({
    jobType: [],
    experienceLevel: [],
    salary: [0, 200000],
  });

  useEffect(() => {
    const { query } = router;
    if (query.search) setSearchTerm(query.search as string);
    if (query.page) setPage(parseInt(query.page as string));
    fetchJobs();
  }, [router.query]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await getJobs({
        search: searchTerm,
        page,
        ...filters,
      });
      setJobs(response.data);
      setTotalPages(response.totalPages);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching jobs:", err);
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

  const handleFilterChange = (
    category: keyof JobFilters,
    value: string | number
  ) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [category]: Array.isArray(prevFilters[category])
        ? (prevFilters[category] as string[]).includes(value as string)
          ? (prevFilters[category] as string[]).filter((item) => item !== value)
          : [...(prevFilters[category] as string[]), value]
        : value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      jobType: [],
      experienceLevel: [],
      salary: [0, 200000],
    });
    setSearchTerm("");
    setPage(1);
    router.push("/jobs");
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    router.push({
      pathname: "/jobs",
      query: { ...router.query, page: newPage },
    });
  };

  return (
    <Layout title="RemoteHub - Browse Jobs">
      <div className="bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
            Browse Remote Jobs
          </h1>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters section (unchanged) */}
            <div className="md:w-3/4">
              <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <MagnifyingGlassIcon className="h-5 w-5" />
                  </button>
                </form>
              </div>
              <div className="space-y-6">
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
                      className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
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
                      <div className="text-gray-700 mb-4 line-clamp-3">
                        {job.excerpt}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-indigo-600">
                          {job.salary?.min
                            ? `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()}`
                            : "Salary not specified"}
                        </span>
                        <Link
                          href={`/jobs/${job._id}`}
                          className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          View Job
                        </Link>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
              <div className="mt-8 flex justify-center">
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNumber = page - 2 + i;
                    return pageNumber > 0 && pageNumber <= totalPages ? (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === pageNumber
                            ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ) : null;
                  })}
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
