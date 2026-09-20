import { useCallback, useEffect, useState } from "react";
import {
  emptyDashboardStats,
  getDashboardStats,
  type DashboardStats,
} from "./api";

/**
 * Loads `/course/dashboard/stats` for the logged-in user.
 *
 * `stats` starts as safe zeros (see `emptyDashboardStats`) so the dashboard can
 * render immediately, then fills in with real numbers. `reload()` re-fetches —
 * useful after logging study time or changing the weekly goal.
 */
export function useDashboardStats(): {
  stats: DashboardStats;
  isLoading: boolean;
  error: string | null;
  reload: () => void;
} {
  const [stats, setStats] = useState<DashboardStats>(emptyDashboardStats);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const reload = useCallback(() => setVersion((value) => value + 1), []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    getDashboardStats()
      .then((data) => {
        if (cancelled) return;
        setStats(data);
        setError(null);
      })
      .catch((requestError: unknown) => {
        if (cancelled) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Could not load your stats.",
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [version]);

  return { stats, isLoading, error, reload };
}
