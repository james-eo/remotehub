import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { motion } from "framer-motion";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import {
  getJobs,
  Job,
  JobFilters,
  getUniqueValues,
} from "../../services/jobService";
import { Listbox, Transition } from "@headlessui/react";

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];
const experienceLevels = ["Entry", "Mid", "Senior"];

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
    category: [],
    location: "",
    tags: [],
  });

  const [uniqueLocations, setUniqueLocations] = useState<string[]>([]);
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);

  useEffect(() => {
    const { query } = router;
    if (query.search) setSearchTerm(query.search as string);
    if (query.page) setPage(parseInt(query.page as string));
    fetchJobs();
    fetchUniqueValues();
  }, [router.query, filters]);

  const fetchUniqueValues = async () => {
    try {
      const locations = await getUniqueValues("location");
      const categories = await getUniqueValues("category");
      const tags = await getUniqueValues("tags");
      setUniqueLocations(locations);
      setUniqueCategories(categories);
      setUniqueTags(tags);
    } catch (err) {
      console.error("Error fetching unique values:", err);
    }
  };

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
    value: string | string[]
  ) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [category]: value,
    }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({
      jobType: [],
      experienceLevel: [],
      category: [],
      location: "",
      tags: [],
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
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
              <form
                onSubmit={handleSearch}
                className="flex-grow flex items-center"
              >
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
              <button
                onClick={resetFilters}
                className="text-sm text-indigo-600 hover:text-indigo-800 whitespace-nowrap"
              >
                Reset Filters
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-stone-600">
              <FilterDropdown
                label="Job Type"
                options={jobTypes}
                value={filters.jobType || []}
                onChange={(value) => handleFilterChange("jobType", value)}
                multiple
              />
              <FilterDropdown
                label="Experience"
                options={experienceLevels}
                value={filters.experienceLevel || []}
                onChange={(value) =>
                  handleFilterChange("experienceLevel", value)
                }
                multiple
              />
              <FilterDropdown
                label="Category"
                options={uniqueCategories}
                value={filters.category || ""}
                onChange={(value) =>
                  handleFilterChange("category", value as string)
                }
              />
              <FilterDropdown
                label="Location"
                options={uniqueLocations}
                value={filters.location || ""}
                onChange={(value) =>
                  handleFilterChange("location", value as string)
                }
              />
              <FilterDropdown
                label="Tags"
                options={uniqueTags}
                value={filters.tags || []}
                onChange={(value) => handleFilterChange("tags", value)}
                multiple
              />
            </div>
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
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-gray-700 mb-4 line-clamp-3">
                    {job.excerpt}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-indigo-600">
                      {job.salary?.min && job.salary?.max
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
    </Layout>
  );
}

interface FilterDropdownProps {
  label: string;
  options: string[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
}

function FilterDropdown({
  label,
  options,
  value,
  onChange,
  multiple = false,
}: FilterDropdownProps) {
  return (
    <Listbox value={value} onChange={onChange} multiple={multiple}>
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-md shadow-sm cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <span className="block truncate">
            {multiple
              ? (value as string[]).length > 0
                ? `${label} (${(value as string[]).length})`
                : label
              : (value as string) || label}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDownIcon
              className="w-5 h-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={React.Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {options.map((option) => (
              <Listbox.Option
                key={option}
                className={({ active }) =>
                  `${active ? "text-white bg-indigo-600" : "text-gray-900"}
                    cursor-default select-none relative py-2 pl-10 pr-4`
                }
                value={option}
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={`${
                        selected ? "font-medium" : "font-normal"
                      } block truncate`}
                    >
                      {option}
                    </span>
                    {selected ? (
                      <span
                        className={`${active ? "text-white" : "text-indigo-600"}
                          absolute inset-y-0 left-0 flex items-center pl-3`}
                      >
                        <CheckIcon className="w-5 h-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        d="M20 6L9 17l-5-5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        d="M15 19l-7-7 7-7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        d="M9 5l7 7-7 7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
