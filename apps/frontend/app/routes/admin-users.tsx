import { useEffect, useState } from "react";
import type { Route } from "./+types/admin-users";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { BookOpenIcon, UsersIcon, ShoppingBagIcon } from "../components/landing/icons";
import { getAdminUsers, updateUserRole, type AdminUser, type UserRole } from "../lib/api";
import { formatDate } from "../lib/format";
import { useAdmin } from "../lib/useAdmin";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Users — Admin — Learnova" },
    {
      name: "description",
      content: "Manage Learnova users.",
    },
  ];
}

const adminNav = [
  { label: "Overview", icon: <UsersIcon className="size-4.5" />, to: "/admin" },
  { label: "Users", icon: <UsersIcon className="size-4.5" />, to: "/admin/users" },
  { label: "Courses", icon: <BookOpenIcon className="size-4.5" />, to: "/admin/courses" },
  { label: "Back to app", icon: <ShoppingBagIcon className="size-4.5" />, to: "/dashboard" },
];

const roles: UserRole[] = ["user", "course_creator", "admin"];

export default function AdminUsers() {
  const { user, isLoading } = useAdmin();
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAdminUsers()
      .then((list) => {
        if (!cancelled) setUsers(list);
      })
      .catch(() => {
        if (!cancelled) setUsers([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Wait for the session check — useAdmin redirects to /login when there's no
  // valid session, so don't render the page before that.
  if (isLoading) return null;

  async function handleRoleChange(userId: string, role: UserRole) {
    if (updatingId) return;
    setUpdatingId(userId);
    setNotice(null);
    try {
      await updateUserRole(userId, role);
      setUsers((prev) =>
        prev ? prev.map((entry) => (entry.id === userId ? { ...entry, role } : entry)) : prev,
      );
      setNotice({ type: "success", text: "Role updated successfully." });
    } catch (error) {
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : "Could not update the role.",
      });
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <DashboardLayout user={user} nav={adminNav}>
      {/* Heading row */}
      <div>
        <h1 className="text-2xl font-bold text-white lg:text-3xl">Users</h1>
        <p className="mt-1 text-sm text-gray-500">
          All accounts on Learnova — change roles here.
        </p>
      </div>

      {/* Notice banner */}
      {notice && (
        <p
          className={`mt-5 rounded-lg border px-4 py-3 text-sm ${
            notice.type === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
              : "border-red-500/40 bg-red-500/10 text-red-400"
          }`}
        >
          {notice.text}
        </p>
      )}

      {/* Users table */}
      <div className="mt-6 overflow-hidden rounded-xl border border-line bg-surface">
        {users === null ? (
          <p className="px-5 py-8 text-sm text-gray-500">Loading users…</p>
        ) : users.length === 0 ? (
          <p className="px-5 py-8 text-sm text-gray-500">No users yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-widest text-gray-500">
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Joined</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {users.map((entry) => (
                  <tr key={entry.id} className="hover:bg-base/40">
                    <td className="px-5 py-3 font-medium text-white">{entry.name}</td>
                    <td className="px-5 py-3 text-gray-400">{entry.email}</td>
                    <td className="px-5 py-3 text-gray-400">{formatDate(entry.createdAt)}</td>
                    <td className="px-5 py-3">
                      <select
                        value={entry.role}
                        disabled={updatingId !== null}
                        onChange={(event) =>
                          handleRoleChange(entry.id, event.target.value as UserRole)
                        }
                        className="rounded-lg border border-line bg-base px-3 py-1.5 text-xs font-semibold text-white outline-none transition focus:border-brand disabled:opacity-50"
                      >
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}