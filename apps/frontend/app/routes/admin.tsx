import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/admin";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { BookOpenIcon, UsersIcon, WalletIcon, ShoppingBagIcon } from "../components/landing/icons";
import { getAdminStats, getAdminUsers, type AdminStats, type AdminUser } from "../lib/api";
import { formatPrice, getInitials } from "../lib/format";
import { useAdmin } from "../lib/useAdmin";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin — Learnova" },
    {
      name: "description",
      content: "Learnova admin dashboard.",
    },
  ];
}

const adminNav = [
  { label: "Overview", icon: <UsersIcon className="size-4.5" />, to: "/admin" },
  { label: "Users", icon: <UsersIcon className="size-4.5" />, to: "/admin/users" },
  { label: "Courses", icon: <BookOpenIcon className="size-4.5" />, to: "/admin/courses" },
  { label: "Back to app", icon: <ShoppingBagIcon className="size-4.5" />, to: "/dashboard" },
];

export default function AdminOverview() {
  const { user, isLoading } = useAdmin();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getAdminStats(), getAdminUsers()])
      .then(([statsData, usersData]) => {
        if (cancelled) return;
        setStats(statsData);
        setRecentUsers(usersData.slice(0, 5));
      })
      .catch(() => {
        if (cancelled) return;
        setStats(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Wait for the session check — useAdmin redirects to /login when there's no
  // valid session, so don't render the page before that.
  if (isLoading) return null;

  return (
    <DashboardLayout user={user} nav={adminNav}>
      {/* Heading row */}
      <div>
        <h1 className="text-2xl font-bold text-white lg:text-3xl">Admin Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Platform health at a glance.
        </p>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Users"
          value={stats === null ? "…" : String(stats.totalUsers)}
          icon={<UsersIcon className="size-5 text-brand-light" />}
        />
        <StatCard
          label="Total Courses"
          value={stats === null ? "…" : String(stats.totalCourses)}
          icon={<BookOpenIcon className="size-5 text-brand-light" />}
        />
        <StatCard
          label="Total Purchases"
          value={stats === null ? "…" : String(stats.totalPurchases)}
          icon={<ShoppingBagIcon className="size-5 text-brand-light" />}
        />
        <StatCard
          label="Revenue"
          value={stats === null ? "…" : formatPrice(stats.totalRevenue)}
          icon={<WalletIcon className="size-5 text-brand-light" />}
        />
      </div>

      {/* Recent users */}
      <div className="mt-6 rounded-xl border border-line bg-surface">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Recent Users</h3>
            <p className="mt-0.5 text-xs text-gray-500">Newest sign-ups</p>
          </div>
          <Link
            to="/admin/users"
            className="text-xs font-semibold text-brand-light transition hover:text-brand"
          >
            View all
          </Link>
        </div>

        <ul className="divide-y divide-line">
          {recentUsers.length === 0 ? (
            <li className="px-5 py-6 text-sm text-gray-500">No users yet.</li>
          ) : (
            recentUsers.map((recentUser) => (
              <li key={recentUser.id} className="flex items-center gap-3 px-5 py-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
                  {getInitials(recentUser.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{recentUser.name}</p>
                  <p className="truncate text-xs text-gray-500">{recentUser.email}</p>
                </div>
                <span className="rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold text-brand-light">
                  {recentUser.role}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </DashboardLayout>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-400">{label}</p>
        <span className="flex size-9 items-center justify-center rounded-lg bg-brand-ink">
          {icon}
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}