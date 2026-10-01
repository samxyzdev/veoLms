import { PieChart } from "lucide-react";
import { useOutletContext } from "react-router";

type CourseCategory = {
  name: string;
  courses: number;
  percentage: number;
};

type CourseCreatorStats = {
  totalCourses: number;
  totalStudents: number;
  totalPurchases: number;
  totalRevenue: number;

  enrollmentOverview: {
    month: string;
    value: number;
  }[];

  popularCourses: {
    id: string;
    title: string;
    enrollments: number;
    rank: number;
  }[];

  recentEnrollments: {
    id: string;
    student: string;
    email: string;
    course: string;
    date: string;
    status: string;
  }[];

  studentGrowth: {
    month: string;
    value: number;
  }[];

  courseCategories: CourseCategory[];
};

type CourseCreatorContext = {
  user: unknown;
  stats: CourseCreatorStats;
};

const categoryColors = [
  {
    className: "bg-indigo-500",
    hex: "#6366f1",
  },
  {
    className: "bg-blue-500",
    hex: "#3b82f6",
  },
  {
    className: "bg-emerald-400",
    hex: "#34d399",
  },
  {
    className: "bg-orange-400",
    hex: "#fb923c",
  },
  {
    className: "bg-pink-400",
    hex: "#f472b6",
  },
  {
    className: "bg-slate-300",
    hex: "#cbd5e1",
  },
];

export function CourseCategories() {
  const { stats } = useOutletContext<CourseCreatorContext>();

  const categories = stats.courseCategories.map((category, index) => {
    const color = categoryColors[index % categoryColors.length];

    return {
      ...category,
      colorClass: color.className,
      hex: color.hex,
    };
  });

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
    .map((segment) => `${segment.hex} ${segment.start}% ${segment.end}%`)
    .join(", ");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-950">
            Course Categories
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Distribution of your courses by category.
          </p>
        </div>

        <PieChart size={18} className="text-indigo-400" />
      </div>

      <div className="mt-6 flex items-center gap-5">
        {/* Donut */}
        <div
          className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full"
          style={{
            background:
              categories.length > 0 ? `conic-gradient(${gradient})` : "#e2e8f0",
          }}
        >
          <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white">
            <span className="text-xl font-extrabold text-slate-950">
              {stats.totalCourses}
            </span>

            <span className="text-[9px] text-slate-400">Courses</span>
          </div>
        </div>

        {/* Legend */}
        <div className="min-w-0 flex-1 space-y-3">
          {categories.length === 0 ? (
            <p className="text-xs text-slate-400">No courses found.</p>
          ) : (
            categories.map((category) => (
              <div key={category.name} className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${category.colorClass}`}
                />

                <span className="min-w-0 flex-1 truncate text-[10px] font-medium text-slate-600">
                  {category.name}
                </span>

                <span className="text-[10px] font-bold text-slate-700">
                  {category.courses}
                </span>

                <span className="w-9 text-right text-[9px] text-slate-400">
                  ({category.percentage}%)
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
