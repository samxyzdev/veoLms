import { ArrowRight, Clock3, PlayCircle } from "lucide-react";
import { Link } from "react-router";

import { dashboardData } from "../../data/dashboardData";

export function ContinueLearning() {
  const course = dashboardData.continueLearning;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Continue where you left off
          </p>

          <h2 className="mt-1 text-lg font-extrabold text-slate-950">
            Continue Learning
          </h2>
        </div>

        <Link
          to="/dashboard/my-learning"
          className="hidden items-center gap-1 text-xs font-bold text-indigo-600 sm:flex"
        >
          View all
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl bg-slate-50">
        {/* Course visual */}
        <div className="relative h-36 overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-cyan-500 p-5">
          <div className="absolute right-[-20px] top-[-30px] h-32 w-32 rounded-full border border-white/10" />

          <div className="absolute bottom-[-40px] left-[35%] h-40 w-40 rounded-full border border-cyan-300/20" />

          <div className="relative flex h-full items-center justify-between">
            <div>
              <span className="rounded-lg bg-white/10 px-2.5 py-1 text-[10px] font-bold text-cyan-100 backdrop-blur">
                DEVELOPMENT
              </span>

              <h3 className="mt-3 text-xl font-extrabold text-white">
                React for Beginners
              </h3>

              <p className="mt-1 text-xs text-cyan-100">
                Build modern interfaces with React
              </p>
            </div>

            <div className="hidden h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-3xl text-cyan-200 backdrop-blur sm:flex">
              ⚛
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-400">Next lesson</p>

              <h3 className="mt-1 text-sm font-bold text-slate-900">
                {course.section}
              </h3>

              <div className="mt-4 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-indigo-600"
                    style={{
                      width: `${course.progress}%`,
                    }}
                  />
                </div>

                <span className="text-xs font-bold text-slate-600">
                  {course.progress}%
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <PlayCircle size={13} />
                  {course.completedLessons}/{course.totalLessons} lessons
                </span>

                <span className="flex items-center gap-1">
                  <Clock3 size={13} />
                  42 min remaining
                </span>
              </div>
            </div>

            <Link
              to="/dashboard/my-learning"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white transition hover:bg-indigo-700"
            >
              Continue
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
