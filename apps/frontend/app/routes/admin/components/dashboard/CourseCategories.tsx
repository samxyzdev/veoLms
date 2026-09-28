// app/routes/admin/components/dashboard/CourseCategories.tsx

import { PieChart } from "lucide-react";

import { adminData } from "../../data/adminData";

export function CourseCategories() {
  const categories = adminData.courseCategories;

  let cumulative = 0;

  const segments = categories.map((category) => {
    const start = cumulative;
    cumulative += category.percentage;

    return {
      ...category,
      start,
      end: cumulative,
    };
  });

  const gradient = segments
    .map(
      (segment) =>
        `${getColor(segment.color)} ${segment.start}% ${segment.end}%`,
    )
    .join(", ");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-950">
            Course Categories
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Distribution of courses by category.
          </p>
        </div>

        <PieChart size={18} className="text-indigo-400" />
      </div>

      <div className="mt-6 flex items-center gap-5">
        {/* Donut */}
        <div
          className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(${gradient})`,
          }}
        >
          <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white">
            <span className="text-xl font-extrabold text-slate-950">86</span>

            <span className="text-[9px] text-slate-400">Courses</span>
          </div>
        </div>

        {/* Legend */}
        <div className="min-w-0 flex-1 space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${category.color}`}
              />

              <span className="min-w-0 flex-1 truncate text-[10px] font-medium text-slate-600">
                {category.name}
              </span>

              <span className="text-[10px] font-bold text-slate-700">
                {category.courses}
              </span>

              <span className="w-7 text-right text-[9px] text-slate-400">
                ({category.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function getColor(className: string) {
  const colors: Record<string, string> = {
    "bg-indigo-500": "#6366f1",
    "bg-blue-500": "#3b82f6",
    "bg-emerald-400": "#34d399",
    "bg-orange-400": "#fb923c",
    "bg-pink-400": "#f472b6",
    "bg-slate-300": "#cbd5e1",
  };

  return colors[className] ?? "#6366f1";
}
