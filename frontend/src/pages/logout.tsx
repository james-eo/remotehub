import { useEffect } from "react";
import { useRouter } from "next/router";
import { logout } from "../utils/auth";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      await logout();
      router.push("/");
    };

    performLogout();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Logging out...</h1>
        <p>You will be redirected to the home page shortly.</p>
      </div>
    </div>
  );
}
