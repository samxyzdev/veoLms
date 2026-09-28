import { ArrowRight, Pencil, Target } from "lucide-react";

import { dashboardData } from "../../data/dashboardData";

export function WeeklyGoal() {
  const { completed, target, label } = dashboardData.weeklyGoal;

  const percentage = Math.min(100, Math.round((completed / target) * 100));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Keep growing
          </p>

          <h2 className="mt-1 text-lg font-extrabold text-slate-950">
            Weekly Goal
          </h2>
        </div>

        <button className="flex items-center gap-1.5 text-xs font-bold text-indigo-600">
          <Pencil size={13} />
          Edit
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
        {/* Circle */}
        <div
          className="relative mx-auto flex h-32 w-32 shrink-0 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(#6366f1 ${percentage * 3.6}deg, #eef2ff 0deg)`,
          }}
        >
          <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">
            <span className="text-2xl font-extrabold text-slate-950">
              {completed}/{target}
            </span>

            <span className="text-[10px] font-medium text-slate-400">
              lessons
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Target size={19} />
          </div>

          <h3 className="mt-3 text-sm font-extrabold text-slate-900">
            {label}
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            You're {target - completed} lessons away from reaching this week's
            target.
          </p>

          <div className="mt-4">
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-indigo-600"
                style={{
                  width: `${percentage}%`,
                }}
              />
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                {completed} completed
              </span>

              <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600">
                {percentage}% complete
                <ArrowRight size={12} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
