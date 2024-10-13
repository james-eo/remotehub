import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

const DarkModeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className="p-2 bg-gray-200 dark:bg-gray-800 rounded-md hover:ring-2 ring-gray-300 transition-all"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <SunIcon className="h-5 w-5 text-yellow-500" />
      ) : (
        <MoonIcon className="h-5 w-5 text-gray-800" />
      )}
    </button>
  );
};

export default DarkModeToggle;
