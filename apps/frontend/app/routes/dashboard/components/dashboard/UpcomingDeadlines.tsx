import { ArrowRight, CalendarDays } from "lucide-react";
import { Link } from "react-router";

import { dashboardData } from "../../data/dashboardData";

export function UpcomingDeadlines() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-red-500">
            Stay on track
          </p>

          <h2 className="mt-1 text-lg font-extrabold text-slate-950">
            Upcoming Deadlines
          </h2>
        </div>

        <CalendarDays size={20} className="text-slate-300" />
      </div>

      <div className="space-y-1">
        {dashboardData.deadlines.map((deadline) => (
          <div
            key={deadline.id}
            className="group flex items-center gap-3 rounded-xl p-3 transition hover:bg-slate-50"
          >
            {/* Date */}
            <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-indigo-50">
              <span className="text-[9px] font-extrabold text-indigo-600">
                {deadline.month}
              </span>

              <span className="text-lg font-extrabold leading-4 text-slate-900">
                {deadline.day}
              </span>
            </div>

            {/* Detail */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-900">
                {deadline.title}
              </p>

              <p className="mt-1 truncate text-[11px] text-slate-400">
                {deadline.course}
              </p>
            </div>

            {/* Days */}
            <span className="hidden whitespace-nowrap rounded-lg bg-red-50 px-2 py-1 text-[10px] font-bold text-red-500 sm:block">
              {deadline.daysLeft}
            </span>
          </div>
        ))}
      </div>

      <Link
        to="/dashboard/notifications"
        className="mt-4 flex items-center justify-center gap-1 border-t border-slate-100 pt-4 text-xs font-bold text-indigo-600"
      >
        View calendar
        <ArrowRight size={13} />
      </Link>
    </section>
  );
}
