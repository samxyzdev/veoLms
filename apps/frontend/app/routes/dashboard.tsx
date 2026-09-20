import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import type { Route } from "./+types/dashboard";
import { ActivityCharts } from "../components/dashboard/ActivityCharts";
import { CoursesCard } from "../components/dashboard/CoursesCard";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { StatCards } from "../components/dashboard/StatCards";
import {
  BellIcon,
  ChevronDownIcon,
  LogOutIcon,
  SettingsIcon,
} from "../components/landing/icons";
import { getInitials } from "../lib/format";
import { useMe } from "../lib/useMe";
import { useDashboardStats } from "../lib/useDashboardStats";
import { logOut } from "../lib/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard — Learnova" },
    {
      name: "description",
      content: "Your Learnova dashboard: track courses, study time and weekly goals.",
    },
  ];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isLoading } = useMe();
  // Weekly goal, enrolled courses, study hours, streak + chart data.
  const { stats, error: statsError } = useDashboardStats();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Close the profile menu with Escape.
  useEffect(() => {
    if (!profileMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProfileMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [profileMenuOpen]);

  // Wait for the session check — useMe redirects to /login when there's no
  // valid session, so don't render the dashboard before that.
  if (isLoading) return null;

  /** Clear the session on the backend, then leave the dashboard. */
  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logOut();
    } catch {
      // Best effort: still leave the dashboard even if the request failed.
    } finally {
      setIsLoggingOut(false);
      setProfileMenuOpen(false);
      navigate("/");
    }
  }

  const firstName = user?.name.trim().split(/\s+/)[0];
  const initials = user ? getInitials(user.name) : "";

  return (
    <DashboardLayout user={user}>
      {/* Heading row */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white lg:text-3xl">
            Welcome back, {firstName ?? "there"} 👋
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here&apos;s what&apos;s happening with your learning today.
          </p>
        </div>

        {/* Bell + profile menu */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="relative rounded-lg border border-line bg-surface p-2.5 text-gray-400 transition hover:text-white"
          >
            <BellIcon className="size-4.5" />
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-brand" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileMenuOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={profileMenuOpen}
              className="flex items-center gap-1.5 rounded-full border border-line bg-surface p-1 pl-1.5 transition hover:border-brand/40"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
                {initials || "…"}
              </span>
              <ChevronDownIcon
                className={`size-4 text-gray-400 transition-transform ${profileMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {profileMenuOpen && (
              <>
                {/* Click-away backdrop */}
                <button
                  type="button"
                  aria-label="Close profile menu"
                  onClick={() => setProfileMenuOpen(false)}
                  className="fixed inset-0 z-40 cursor-default"
                />

                <div
                  role="menu"
                  className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-xl border border-line bg-surface shadow-xl shadow-black/40"
                >
                  {/* User info */}
                  <div className="border-b border-line px-4 py-3">
                    <p className="truncate text-sm font-semibold text-white">
                      {user?.name ?? "Loading…"}
                    </p>
                    <p className="truncate text-xs text-gray-500">{user?.email ?? ""}</p>
                  </div>

                  <div className="p-1.5">
                    <Link
                      to="/dashboard/settings"
                      role="menuitem"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition hover:bg-base hover:text-white"
                    >
                      <SettingsIcon className="size-4" />
                      Settings
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
                    >
                      <LogOutIcon className="size-4" />
                      {isLoggingOut ? "Logging out…" : "Log out"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="mt-6 space-y-4">
        {statsError ? (
          <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-300">
            Could not load your live stats: {statsError}
          </p>
        ) : null}

        <StatCards stats={stats} />
        <ActivityCharts stats={stats} />
        <CoursesCard stats={stats} />
      </div>
    </DashboardLayout>
  );
}