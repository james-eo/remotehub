import { useEffect } from "react";
import { useRouter } from "next/router";
import { getCurrentUser } from "../services/api";

export function useAuth(redirectTo = "/login") {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        await getCurrentUser();
      } catch (error) {
        router.push(redirectTo);
      }
    }
    checkAuth();
  }, [redirectTo, router]);
}
