import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Footer from "./Footer";
import Image from "next/image";
import DarkModeToggle from "./DarkModeToggle";
import { logout } from "../services/api";

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
};

const Layout: React.FC<LayoutProps> = ({
  children,
  title = "RemoteHub - Find Your Dream Remote Job",
}) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <Image
                  className="h-8 w-auto"
                  src="/logo.svg"
                  alt="RemoteHub"
                  width={32}
                  height={32}
                />
                <span className="ml-2 text-xl font-bold text-indigo-600">
                  RemoteHub
                </span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <NavLink href="/jobs" current={router.pathname === "/jobs"}>
                  Jobs
                </NavLink>
                <NavLink
                  href="/companies"
                  current={router.pathname === "/companies"}
                >
                  Companies
                </NavLink>
                <NavLink
                  href="/resources"
                  current={router.pathname === "/resources"}
                >
                  Resources
                </NavLink>
                <NavLink href="/about" current={router.pathname === "/about"}>
                  About
                </NavLink>
                {isAuthenticated && (
                  <NavLink
                    href="/dashboard"
                    current={router.pathname === "/dashboard"}
                  >
                    Dashboard
                  </NavLink>
                )}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/login"
                    className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/profile"
                    className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Logout
                  </button>
                </>
              )}
              <DarkModeToggle />
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow">{children}</main>

      <Footer />
    </div>
  );
};

const NavLink: React.FC<{
  href: string;
  current: boolean;
  children: React.ReactNode;
}> = ({ href, current, children }) => {
  return (
    <Link
      href={href}
      className={`${
        current
          ? "border-indigo-500 text-gray-900"
          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
    >
      {children}
    </Link>
  );
};

export default Layout;
