import Layout from "../components/Layout";
import { motion } from "framer-motion";

const resources = [
  {
    title: "Remote Work Guide",
    description: "A comprehensive guide to working remotely effectively.",
    link: "#",
  },
  {
    title: "Interview Preparation",
    description: "Tips and tricks to ace your remote job interviews.",
    link: "#",
  },
  {
    title: "Resume Building",
    description: "Learn how to create a standout resume for remote positions.",
    link: "#",
  },
  {
    title: "Remote Work Tools",
    description: "Essential tools and software for remote workers.",
    link: "#",
  },
];

export default function ResourcesPage() {
  return (
    <Layout title="RemoteHub - Resources">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-4 py-6 sm:px-0"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Resources</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {resource.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {resource.description}
                  </p>
                  <div className="mt-4">
                    <a
                      href={resource.link}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Learn More
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
