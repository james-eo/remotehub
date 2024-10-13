import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { motion } from "framer-motion";
import Link from "next/link";
import { getCurrentUser, getUserJobHistory } from "../services/api";

interface JobHistoryItem {
  _id: string;
  title: string;
  description?: string;
  salary?: string;
  location?: string;
  interviewDate?: Date;
  applicationStatus: "pending" | "accepted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: number;
  avatar: string;
  bio: string;
  contact: {
    phone: string;
    github: string;
    twitter: string;
    linkedin: string;
    personalUrl: string;
    resumeUrl: string;
  };
  jobHistory: JobHistoryItem[];
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [jobHistory, setJobHistory] = useState<JobHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userResponse = await getCurrentUser();
      setUser(userResponse.data.user as User);

      const jobHistoryResponse = await getUserJobHistory();
      setJobHistory(jobHistoryResponse.data as JobHistoryItem[]);

      setLoading(false);
    } catch (err) {
      setError("Error fetching user data");
      setLoading(false);
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
  if (!user)
    return (
      <Layout title="Not Authorized">
        <div>Please log in to view your dashboard</div>
      </Layout>
    );

  return (
    <Layout title="RemoteHub - Dashboard">
      <div className="bg-gray-100 min-h-screen py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white overflow-hidden shadow-xl sm:rounded-lg"
          >
            <div className="p-6 sm:px-20 bg-white border-b border-gray-200">
              <div className="mt-8 text-2xl font-bold text-gray-900">
                Welcome to your dashboard, {user.firstName} {user.lastName}!
              </div>
              <div className="mt-6 text-gray-500">
                Here you can manage your job applications and saved jobs.
              </div>
            </div>

            <div className="bg-gray-200 bg-opacity-25 grid grid-cols-1 md:grid-cols-2">
              <div className="p-6">
                <div className="flex items-center">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    className="w-8 h-8 text-gray-400"
                  >
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                  <div className="ml-4 text-lg text-gray-600 leading-7 font-semibold">
                    Job Applications
                  </div>
                </div>

                <div className="ml-12">
                  <div className="mt-2 text-sm text-gray-500">
                    You have applied to {jobHistory.length} jobs.
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 md:border-t-0 md:border-l">
                <div className="flex items-center">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    className="w-8 h-8 text-gray-400"
                  >
                    <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <div className="ml-4 text-lg text-gray-600 leading-7 font-semibold">
                    Profile
                  </div>
                </div>

                <div className="ml-12">
                  <div className="mt-2 text-sm text-gray-500">
                    Update your profile information and resume.
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Your Job Applications
              </h2>
              <div className="space-y-4">
                {jobHistory.map((job) => (
                  <div
                    key={job._id}
                    className="bg-white shadow overflow-hidden sm:rounded-lg"
                  >
                    <div className="px-4 py-5 sm:px-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {job.title}
                      </h3>
                      {job.location && (
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          {job.location}
                        </p>
                      )}
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            Application Status
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {job.applicationStatus}
                          </dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            Applied Date
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {new Date(job.createdAt).toLocaleDateString()}
                          </dd>
                        </div>
                        {job.salary && (
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                              Salary
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {job.salary}
                            </dd>
                          </div>
                        )}
                        {job.interviewDate && (
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                              Interview Date
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {new Date(job.interviewDate).toLocaleDateString()}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
