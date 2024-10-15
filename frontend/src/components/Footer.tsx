import Link from "next/link";

const footerSections = [
  {
    title: "RemoteHub",
    links: [
      { text: "About", href: "/about" },
      { text: "Careers", href: "/careers" },
      { text: "Press", href: "/press" },
      { text: "Contact", href: "/contact" },
    ],
  },
  {
    title: "For Job Seekers",
    links: [
      { text: "Browse Jobs", href: "/jobs" },
      { text: "Companies", href: "/companies" },
      { text: "Resources", href: "/resources" },
      { text: "Salary Calculator", href: "/salary-calculator" },
    ],
  },
  {
    title: "For Employers",
    links: [
      { text: "Post a Job", href: "/post-job" },
      { text: "Pricing", href: "/pricing" },
      { text: "Employer Resources", href: "/employer-resources" },
      { text: "Partnerships", href: "/partnerships" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <img className="h-10" src="/logo-white.svg" alt="RemoteHub" />
            <p className="text-gray-400 text-base">
              Connecting top talent with remote opportunities worldwide.
            </p>
            <div className="flex space-x-6">
              {["facebook", "twitter", "github", "linkedin"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-gray-400 hover:text-gray-300"
                >
                  <span className="sr-only">{social}</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {footerSections.slice(0, 2).map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                    {section.title}
                  </h3>
                  <ul className="mt-4 space-y-4">
                    {section.links.map((link) => (
                      <li key={link.text}>
                        <Link
                          href={link.href}
                          className="text-base text-gray-300 hover:text-white"
                        >
                          {link.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {footerSections.slice(2).map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                    {section.title}
                  </h3>
                  <ul className="mt-4 space-y-4">
                    {section.links.map((link) => (
                      <li key={link.text}>
                        <Link
                          href={link.href}
                          className="text-base text-gray-300 hover:text-white"
                        >
                          {link.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; 2023 RemoteHub, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
