import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getMe, type MeResponse } from "./api";

/**
 * Load the logged-in user via `/user/me` (session cookie is sent
 * automatically). Redirects to `redirectTo` (default `/login`) when there's
 * no valid session. `isLoading` is true until the session check finishes —
 * protected pages should render nothing while it's true so unauthenticated
 * visitors never see a flash of the page before the redirect. Call
 * `reload()` to re-fetch (e.g. after updating the profile).
 */
export function useMe(redirectTo = "/login"): {
  user: MeResponse | null;
  reload: () => void;
  isLoading: boolean;
} {
  const navigate = useNavigate();
  const [user, setUser] = useState<MeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [version, setVersion] = useState(0);

  const reload = useCallback(() => setVersion((value) => value + 1), []);

  useEffect(() => {
    let cancelled = false;
    getMe()
      .then((me) => {
        if (cancelled) return;
        setUser(me);
        setIsLoading(false);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setIsLoading(false);
        const status = (error as Error & { status?: number }).status;
        if (status === 400 || status === 401) {
          navigate(redirectTo);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [navigate, redirectTo, version]);

  return { user, reload, isLoading };
}