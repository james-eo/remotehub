import Layout from "../components/Layout";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
  return (
    <Layout title="RemoteHub - About Us">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-4 py-6 sm:px-0"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-6">About Us</h1>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 mb-6 md:mb-0">
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt="About RemoteHub"
                    width={400}
                    height={300}
                    className="rounded-lg"
                  />
                </div>
                <div className="md:w-1/2 md:pl-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Our Mission
                  </h2>
                  <p className="text-gray-600 mb-4">
                    At RemoteHub, we're dedicated to connecting talented
                    professionals with exciting remote job opportunities across
                    the globe. Our mission is to empower individuals to build
                    fulfilling careers while enjoying the flexibility and
                    freedom of remote work.
                  </p>
                  <p className="text-gray-600 mb-4">
                    We believe that the future of work is remote, and we're here
                    to make that transition as smooth as possible for both job
                    seekers and employers.
                  </p>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Our Values
                  </h2>
                  <ul className="list-disc list-inside text-gray-600">
                    <li>Transparency</li>
                    <li>Innovation</li>
                    <li>Inclusivity</li>
                    <li>Work-Life Balance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
