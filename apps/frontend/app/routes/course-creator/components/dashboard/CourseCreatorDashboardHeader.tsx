// app/routes/admin/components/dashboard/AdminDashboardHeader.tsx

import { ArrowRight, BarChart3, TrendingUp } from "lucide-react";
import { Link, useOutletContext } from "react-router";

import { adminData } from "../../data/adminData";
type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "course_creator" | "admin";
  createdAt: string;
  updatedAt: string;
};

type DashboardContext = {
  user: User;
};

export function CourseCreatorDashboardHeader() {
  const { user } = useOutletContext<DashboardContext>();
  return (
    <section className="mb-5">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Platform overview
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-[34px]">
            Welcome back, {user.name}! 👋
          </h1>

          <p className="mt-1.5 text-sm text-slate-500">
            Here's what's happening with your platform today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/analytics"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <BarChart3 size={15} />
            View analytics
          </Link>

          <Link
            to="/course-creator/courses/new"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Create course
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400">
        <TrendingUp size={13} className="text-emerald-500" />

        <span>Your platform continues to grow this month.</span>
      </div>
    </section>
  );
}
