import { useEffect } from "react";
import { useRouter } from "next/router";
import { getCurrentUser } from "../services/api";

export function useAuth(redirectTo = "/login") {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        await getCurrentUser();
      } catch (err: unknown) {
        // Log the error for debugging purposes
        console.warn(
          "Authentication check failed:",
          err instanceof Error ? err.message : "Unknown error"
        );
        // Redirect to login page
        router.push(redirectTo);
      }
    }
    checkAuth();
  }, [redirectTo, router]);
}

interface AuthError extends Error {
  code?: string;
  status?: number;
}

export const logout = async (): Promise<void> => {
  try {
    // Clear any stored tokens or user data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // If you're using cookies, you might want to clear them as well
    // document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

    // You might also want to make an API call to invalidate the token on the server
    // await api.post('/logout')
  } catch (err: unknown) {
    const authError = err as AuthError;
    console.error(
      "Error during logout:",
      authError.message || "Unknown error occurred"
    );
    throw new Error("Logout failed. Please try again.");
  }
};

// Optional: Add a type-safe way to check if user is authenticated
export const isAuthenticated = (): boolean => {
  try {
    const token = localStorage.getItem("token");
    return !!token;
  } catch {
    return false;
  }
};

// import { useEffect } from "react";
// import { useRouter } from "next/router";
// import { getCurrentUser } from "../services/api";

// export function useAuth(redirectTo = "/login") {
//   const router = useRouter();

//   useEffect(() => {
//     async function checkAuth() {
//       try {
//         await getCurrentUser();
//       } catch (error) {
//         router.push(redirectTo);
//       }
//     }
//     checkAuth();
//   }, [redirectTo, router]);
// }

// export const logout = async () => {
//   // Clear any stored tokens or user data
//   localStorage.removeItem("token");
//   localStorage.removeItem("user");

//   // If you're using cookies, you might want to clear them as well
//   // document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

//   // You might also want to make an API call to invalidate the token on the server
//   // await api.post('/logout')
// };

// // ... rest of the existing code ...
