import { ArrowRight, Flame, Target } from "lucide-react";
import { Link, useOutletContext } from "react-router";

import { dashboardData } from "../../data/dashboardData";
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

export function DashboardHeader() {
  const { user } = useOutletContext<DashboardContext>();
  return (
    <section className="relative mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-500 p-4 text-white sm:p-5">
      {/* Decorative shapes */}
      <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

      <div className="absolute -bottom-10 right-10 h-28 w-28 rounded-full bg-cyan-300/10 blur-3xl" />

      <div className="relative flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-semibold backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            Keep your learning streak going
          </div>

          <h1 className="text-xl font-bold sm:text-2xl">
            Welcome back, {user.name}! 👋
          </h1>

          <p className="mt-1 max-w-lg text-xs leading-5 text-indigo-100">
            Continue learning and achieve your weekly goals.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to="/dashboard/my-learning"
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-white px-3 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
            >
              Continue learning
              <ArrowRight size={14} />
            </Link>

            <Link
              to="/dashboard/explore-courses"
              className="inline-flex h-9 items-center rounded-lg border border-white/20 bg-white/10 px-3 text-xs font-semibold text-white hover:bg-white/15"
            >
              Explore courses
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
