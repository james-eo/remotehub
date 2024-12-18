import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { getCurrentUser, getUserJobHistory } from "../services/api";
import { motion } from "framer-motion";
import Image from "next/image";
import { useAuth } from "../utils/auth";
import { useRouter } from "next/router";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl: string;
}

interface JobApplication {
  _id: string;
  jobTitle: string;
  company: string;
  status: string;
  appliedDate: string;
}

interface DashboardState {
  user: User | null;
  jobHistory: JobApplication[];
  loading: {
    user: boolean;
    jobHistory: boolean;
  };
  error: {
    user: string | null;
    jobHistory: string | null;
  };
}

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [state, setState] = useState<DashboardState>({
    user: null,
    jobHistory: [],
    loading: {
      user: true,
      jobHistory: true,
    },
    error: {
      user: null,
      jobHistory: null,
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    // Fetch user data
    try {
      const userResponse = await getCurrentUser();
      setState((prev) => ({
        ...prev,
        user: userResponse.data,
        loading: { ...prev.loading, user: false },
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, user: false },
        error: {
          ...prev.error,
          user: "Failed to load user profile. Please try again.",
        },
      }));
    }

    // Fetch job history
    try {
      const jobHistoryResponse = await getUserJobHistory();
      setState((prev) => ({
        ...prev,
        jobHistory: jobHistoryResponse.data,
        loading: { ...prev.loading, jobHistory: false },
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, jobHistory: false },
        error: {
          ...prev.error,
          jobHistory: "Failed to load job history. Please try again.",
        },
      }));
    }
  };

  const renderError = (message: string) => (
    <div className="bg-red-50 border-l-4 border-red-400 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{message}</p>
        </div>
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  );

  if (state.loading.user || state.loading.jobHistory) {
    return <Layout title="Loading...">{renderLoading()}</Layout>;
  }

  return (
    <Layout title="RemoteHub - Dashboard">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {state.error.user && renderError(state.error.user)}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-4 py-6 sm:px-0"
        >
          {state.user && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex items-center">
                <div className="flex-shrink-0 h-20 w-20">
                  <Image
                    className="h-20 w-20 rounded-full"
                    src={
                      state.user.profilePictureUrl || "/placeholder-user.jpg"
                    }
                    alt="Profile picture"
                    width={80}
                    height={80}
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {state.user.firstName} {state.user.lastName}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {state.user.email}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Job Application History
                </h3>
                {state.error.jobHistory && renderError(state.error.jobHistory)}

                <div className="mt-4">
                  {state.jobHistory.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {state.jobHistory.map((application) => (
                        <li key={application._id} className="py-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">
                                {application.jobTitle}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {application.company}
                              </p>
                            </div>
                            <div>
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  application.status === "Applied"
                                    ? "bg-blue-100 text-blue-800"
                                    : application.status === "Interviewing"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {application.status}
                              </span>
                              <p className="text-sm text-gray-500 mt-1">
                                {new Date(
                                  application.appliedDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No job applications yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}
