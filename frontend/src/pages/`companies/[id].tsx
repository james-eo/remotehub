import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { motion } from "framer-motion";

export default function CompanyProfile() {
  const router = useRouter();
  const { id } = router.query;

  // Fetch company details using the id
  const company = {
    name: "TechCorp Inc.",
    logo: "/placeholder.svg?height=100&width=100",
    description:
      "TechCorp Inc. is a leading technology company specializing in innovative software solutions.",
    website: "https://techcorp.com",
    industry: "Technology",
    size: "1000-5000 employees",
    headquarters: "San Francisco, CA",
    founded: 2005,
    openPositions: [
      { id: 1, title: "Senior Software Engineer", department: "Engineering" },
      { id: 2, title: "Product Manager", department: "Product" },
      { id: 3, title: "UX Designer", department: "Design" },
    ],
  };

  return (
    <Layout title={`RemoteHub - ${company.name}`}>
      <div className="bg-gray-100 min-h-screen py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white overflow-hidden shadow-xl sm:rounded-lg"
          >
            <div className="px-4 py-5 sm:px-6 flex items-center">
              <img
                className="h-16 w-16 rounded-full mr-4"
                src={company.logo}
                alt={`${company.name} logo`}
              />
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {company.name}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {company.industry}
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Description
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {company.description}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Website</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <a
                      href={company.website}
                      className="text-indigo-600 hover:text-indigo-900"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {company.website}
                    </a>
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Company size
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {company.size}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Headquarters
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {company.headquarters}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Founded</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {company.founded}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Open Positions
              </h3>
              <div className="mt-4 space-y-4">
                {company.openPositions.map((position) => (
                  <div
                    key={position.id}
                    className="border-t border-gray-200 pt-4"
                  >
                    <h4 className="text-md font-medium text-gray-900">
                      {position.title}
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      {position.department}
                    </p>
                    <a
                      href="#"
                      className="mt-2 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View job
                      <svg
                        className="ml-1 h-5 w-5 text-indigo-500"
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
