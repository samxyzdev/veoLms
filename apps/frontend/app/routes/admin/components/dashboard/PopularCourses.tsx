// app/routes/admin/components/dashboard/PopularCourses.tsx

import { ArrowRight, Star } from "lucide-react";
import { Link } from "react-router";

import { adminData } from "../../data/adminData";

const thumbnailConfig: Record<
  string,
  {
    gradient: string;
    content: React.ReactNode;
  }
> = {
  react: {
    gradient: "from-slate-950 via-indigo-950 to-cyan-500",
    content: <span className="text-2xl text-cyan-300">⚛</span>,
  },

  node: {
    gradient: "from-slate-950 via-emerald-950 to-green-500",
    content: <span className="text-xl font-extrabold text-white">node</span>,
  },

  html: {
    gradient: "from-orange-500 via-red-500 to-blue-500",
    content: <span className="text-xl font-extrabold text-white">5 3</span>,
  },

  typescript: {
    gradient: "from-blue-700 via-blue-600 to-cyan-400",
    content: <span className="text-xl font-extrabold text-white">TS</span>,
  },
};

export function PopularCourses() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-950">
            Popular Courses
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Courses with the most enrollment activity.
          </p>
        </div>

        <Link
          to="/admin/courses"
          className="flex items-center gap-1 text-xs font-bold text-indigo-600"
        >
          View All
          <ArrowRight size={13} />
        </Link>
      </div>

      <div>
        {adminData.popularCourses.map((course) => {
          const thumbnail =
            thumbnailConfig[course.thumbnail] ?? thumbnailConfig.react;

          return (
            <div
              key={course.id}
              className="flex items-center gap-3 border-b border-slate-100 py-3.5 last:border-0"
            >
              {/* Rank */}
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-xs font-extrabold text-slate-500">
                {course.rank}
              </span>

              {/* Image */}
              <div
                className={`flex h-12 w-[68px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br ${thumbnail.gradient}`}
              >
                {thumbnail.content}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-[1.2]">
                <h3 className="truncate text-xs font-bold text-slate-900">
                  {course.title}
                </h3>

                <p className="mt-1 text-[10px] text-slate-400">
                  {course.students}
                </p>
              </div>

              {/* Rating */}
              <div className="hidden items-center gap-1 sm:flex">
                <Star size={13} className="fill-amber-400 text-amber-400" />

                <span className="text-[10px] font-bold text-slate-700">
                  {course.rating}
                </span>
              </div>

              {/* Progress */}
              <div className="hidden w-[110px] md:block">
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{
                      width: `${course.progress}%`,
                    }}
                  />
                </div>
              </div>

              {/* Enrollments */}
              <div className="w-12 text-right">
                <p className="text-sm font-extrabold text-slate-900">
                  {course.enrollments}
                </p>

                <p className="text-[9px] text-slate-400">enrollments</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
