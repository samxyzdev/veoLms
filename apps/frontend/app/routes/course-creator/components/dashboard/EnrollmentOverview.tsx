import { BarChart3, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useOutletContext } from "react-router";

type EnrollmentItem = {
  month: string;
  value: number;
};

type CourseCreatorStats = {
  totalCourses: number;
  totalStudents: number;
  totalPurchases: number;
  totalRevenue: number;
  enrollmentOverview: EnrollmentItem[];
};

type CourseCreatorContext = {
  user: unknown;
  stats: CourseCreatorStats;
};

const RANGE_OPTIONS = [
  {
    label: "Last 1 Month",
    months: 1,
  },
  {
    label: "Last 3 Months",
    months: 3,
  },
  {
    label: "Last 6 Months",
    months: 6,
  },
  {
    label: "Last 12 Months",
    months: 12,
  },
] as const;

export function EnrollmentOverview() {
  const { stats } = useOutletContext<CourseCreatorContext>();

  const [selectedMonths, setSelectedMonths] = useState(6);
  const [open, setOpen] = useState(false);

  const selectedOption =
    RANGE_OPTIONS.find((option) => option.months === selectedMonths) ??
    RANGE_OPTIONS[2];

  const data = useMemo(() => {
    return stats.enrollmentOverview.slice(-selectedMonths);
  }, [stats.enrollmentOverview, selectedMonths]);

  const maxValue = Math.max(...data.map((item) => item.value), 1);

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

        {/* Range Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            {selectedOption.label}

            <ChevronDown
              size={13}
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <div className="absolute right-0 top-full z-20 mt-2 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
              {RANGE_OPTIONS.map((option) => {
                const isSelected = option.months === selectedMonths;

                return (
                  <button
                    key={option.months}
                    type="button"
                    onClick={() => {
                      setSelectedMonths(option.months);
                      setOpen(false);
                    }}
                    className={[
                      "flex w-full items-center rounded-lg px-3 py-2 text-left text-xs font-medium transition",
                      isSelected
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-slate-600 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="mt-8">
        <div className="relative h-[240px]">
          {/* Grid lines */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
            {[
              maxValue,
              Math.round(maxValue * 0.75),
              Math.round(maxValue * 0.5),
              Math.round(maxValue * 0.25),
              0,
            ].map((value, index) => (
              <div
                key={`${value}-${index}`}
                className="flex items-center gap-3"
              >
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

                    {/* Bar */}
                    <div
                      className="w-full max-w-[42px] rounded-t-lg bg-gradient-to-t from-indigo-600 to-violet-400 transition-all duration-300 group-hover:from-violet-700 group-hover:to-indigo-400"
                      style={{
                        height: `${height}%`,
                      }}
                    />
                  </div>

                  {/* Month */}
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
        <span>Monthly enrollment data</span>
      </div>
    </section>
  );
}
