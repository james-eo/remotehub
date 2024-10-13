import { useState } from "react";
import Layout from "../../components/Layout";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

type Filters = {
  jobType: string[];
  experienceLevel: string[];
  salary: number[];
};

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState<Filters>({
    jobType: [],
    experienceLevel: [],
    salary: [0, 200000],
  });
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
  };

  const handleFilterChange = (category: keyof Filters, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [category]: Array.isArray(prevFilters[category])
        ? (prevFilters[category] as string[]).includes(value)
          ? (prevFilters[category] as string[]).filter((item) => item !== value)
          : [...(prevFilters[category] as string[]), value]
        : prevFilters[category],
    }));
  };

  // const handleFilterChange = (category: keyof Filters, value: string) => {
  //   setFilters((prevFilters) => ({
  //     ...prevFilters,
  //     [category]: Array.isArray(prevFilters[category])
  //       ? prevFilters[category].includes(value)
  //         ? (prevFilters[category] as string[]).filter((item) => item !== value)
  //         : [...(prevFilters[category] as string[]), value]
  //       : prevFilters[category],
  //   }));
  // };

  return (
    <Layout title="RemoteHub - Browse Jobs">
      <div className="bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
            Browse Remote Jobs
          </h1>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4">
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Filters
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      Job Type
                    </h3>
                    {["Full-time", "Part-time", "Contract", "Internship"].map(
                      (type) => (
                        <div key={type} className="flex items-center">
                          <input
                            id={`jobType-${type}`}
                            name="jobType"
                            type="checkbox"
                            checked={filters.jobType.includes(type)}
                            onChange={() => handleFilterChange("jobType", type)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`jobType-${type}`}
                            className="ml-2 text-sm text-gray-700"
                          >
                            {type}
                          </label>
                        </div>
                      )
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      Experience Level
                    </h3>
                    {["Entry", "Mid", "Senior"].map((level) => (
                      <div key={level} className="flex items-center">
                        <input
                          id={`experienceLevel-${level}`}
                          name="experienceLevel"
                          type="checkbox"
                          checked={filters.experienceLevel.includes(level)}
                          onChange={() =>
                            handleFilterChange("experienceLevel", level)
                          }
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`experienceLevel-${level}`}
                          className="ml-2 text-sm text-gray-700"
                        >
                          {level}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      Salary Range
                    </h3>
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      step="10000"
                      value={filters.salary[1]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          salary: [0, parseInt(e.target.value)],
                        })
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>$0</span>
                      <span>${filters.salary[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                {/* Replace with actual job data */}
                {[1, 2, 3, 4, 5].map((job) => (
                  <motion.div
                    key={job}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * job }}
                    className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Software Engineer
                    </h3>
                    <p className="text-gray-600 mb-4">TechCorp Inc.</p>
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
                      Remote (Worldwide)
                    </div>
                    <p className="text-gray-700 mb-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-indigo-600">
                        $80,000 - $120,000
                      </span>
                      <Link
                        href={`/jobs/${job}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        View Job
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8 flex justify-center">
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    1
                  </a>
                  <a
                    href="#"
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    2
                  </a>
                  <a
                    href="#"
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    3
                  </a>
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
