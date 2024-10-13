import { useState } from "react";
import Layout from "../components/Layout";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
  };

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
            >
              <span className="block">Find Your Dream</span>
              <span className="block text-indigo-600">Remote Job</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
            >
              Discover thousands of remote opportunities from top companies
              around the world.
            </motion.p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onSubmit={handleSearch}
            className="mt-1 flex rounded-md shadow-sm"
          >
            <div className="relative flex items-stretch flex-grow focus-within:z-10">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <MagnifyingGlassIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <span>Search</span>
            </button>
          </motion.form>
        </div>
        <div className="max-w-7xl mx-auto mt-12 px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Featured Jobs
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Replace with actual job data */}
            {[1, 2, 3, 4].map((job) => (
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
                <Link
                  href={`/jobs/${job}`}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View Job
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/jobs"
              className="inline-flex items-center px-4 py-2 border border-transparent  text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              View All Jobs
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
