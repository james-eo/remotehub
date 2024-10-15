import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { motion } from "framer-motion";
import Link from "next/link";
import { getCompanies } from "../../services/api";

interface Company {
  _id: string;
  name: string;
  logo: string;
  description: string;
}

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await getCompanies();
      setCompanies(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching companies");
      setLoading(false);
    }
  };

  return (
    <Layout title="RemoteHub - Companies">
      <div className="bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
            Companies
          </h1>
          {loading ? (
            <p>Loading companies...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {companies.map((company) => (
                <motion.div
                  key={company._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="w-16 h-16 object-contain mb-4"
                  />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {company.name}
                  </h2>
                  <p className="text-gray-600 mb-4">{company.description}</p>
                  <Link
                    href={`/companies/${company._id}`}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    View Company
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
