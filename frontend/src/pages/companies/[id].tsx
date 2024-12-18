import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { getCompany } from "../../services/api";
import { motion } from "framer-motion";
import Image from "next/image";

interface Job {
  _id: string;
  title: string;
  location: string;
}

interface Company {
  _id: string;
  name: string;
  description: string;
  logo: string;
  website: string;
  location: string;
  jobs: Job[];
}

export default function CompanyPage() {
  const router = useRouter();
  const { id } = router.query;

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCompanyData = useCallback(async () => {
    try {
      const response = await getCompany(id as string);
      setCompany(response.data.data);
      setLoading(false);
    } catch {
      setError("Error fetching company data");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchCompanyData();
    }
  }, [id, fetchCompanyData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Layout title={`RemoteHub - ${company?.name}`}>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-4 py-6 sm:px-0"
        >
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex items-center">
              <div className="flex-shrink-0 h-20 w-20">
                <Image
                  className="h-20 w-20 rounded-full"
                  src={company?.logo || "/placeholder-company.jpg"}
                  alt={`${company?.name} logo`}
                  width={80}
                  height={80}
                />
              </div>
              <div className="ml-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {company?.name}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {company?.location}
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                About
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {company?.description}
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Open Positions
              </h3>
              <div className="mt-4">
                {company?.jobs && company.jobs.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {company.jobs.map((job) => (
                      <li key={job._id} className="py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {job.title}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {job.location}
                            </p>
                          </div>
                          <a
                            href={`/jobs/${job._id}`}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            View Job
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">
                    No open positions at the moment.
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
