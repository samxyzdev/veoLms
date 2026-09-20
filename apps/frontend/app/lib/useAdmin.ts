import { useEffect } from "react";
import { useNavigate } from "react-router";
import type { MeResponse } from "./api";
import { useMe } from "./useMe";

/**
 * Guard for admin pages: loads the user via `useMe` and redirects to the user
 * dashboard when the logged-in account isn't an admin, or to `/admin/login`
 * when there's no valid session at all. Returns the user (or null while
 * loading). `isLoading` is true until the session check finishes.
 */
export function useAdmin(): {
  user: MeResponse | null;
  isLoading: boolean;
} {
  const { user, isLoading } = useMe("/admin/login");
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  return { user, isLoading };
}