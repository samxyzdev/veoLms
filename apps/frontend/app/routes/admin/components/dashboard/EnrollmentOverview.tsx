// app/routes/admin/components/dashboard/EnrollmentOverview.tsx

import { BarChart3, ChevronDown } from "lucide-react";

import { adminData } from "../../data/adminData";

export function EnrollmentOverview() {
  const data = adminData.enrollmentOverview;

  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-950">
            Enrollment Overview
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Track course enrollments and platform growth over time.
          </p>
        </div>

        <button
          type="button"
          className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600"
        >
          Last 6 Months
          <ChevronDown size={13} />
        </button>
      </div>

      {/* Chart */}
      <div className="mt-8">
        <div className="relative h-[240px]">
          {/* Grid lines */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
            {[800, 600, 400, 200, 0].map((value) => (
              <div key={value} className="flex items-center gap-3">
                <span className="w-7 text-right text-[9px] text-slate-400">
                  {value}
                </span>

                <div className="h-px flex-1 bg-slate-100" />
              </div>
            ))}
          </div>

          {/* Bars */}
          <div className="absolute bottom-0 left-10 right-2 top-0 flex items-end justify-around gap-5 pb-5">
            {data.map((item) => {
              const height = (item.value / maxValue) * 100;

              return (
                <div
                  key={item.month}
                  className="group flex h-full flex-1 flex-col items-center justify-end"
                >
                  <div className="relative flex h-full w-full items-end justify-center">
                    {/* Value */}
                    <span className="absolute -top-6 text-xs font-bold text-slate-700">
                      {item.value}
                    </span>

                    <div
                      className="w-full max-w-[42px] rounded-t-lg bg-gradient-to-t from-indigo-600 to-violet-400 transition-all duration-300 group-hover:from-violet-700 group-hover:to-indigo-400"
                      style={{
                        height: `${height}%`,
                      }}
                    />
                  </div>

                  <span className="absolute bottom-0 text-[10px] font-medium text-slate-500">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2 text-[10px] text-slate-400">
        <BarChart3 size={12} />
        Monthly enrollment data
      </div>
    </section>
  );
}
