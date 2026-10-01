import { Heart, PlayCircle, Star, Users } from "lucide-react";
import { Link } from "react-router";

import { dashboardData } from "../../data/dashboardData";

const thumbnailMap = {
  react: {
    gradient: "from-slate-950 via-indigo-950 to-cyan-500",
    text: "⚛",
  },
  node: {
    gradient: "from-slate-950 via-green-950 to-emerald-500",
    text: "N",
  },
  typescript: {
    gradient: "from-blue-800 via-blue-600 to-cyan-400",
    text: "TS",
  },
  design: {
    gradient: "from-pink-500 via-purple-500 to-orange-400",
    text: "✦",
  },
};

export function RecommendedCourses() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Pick your next skill
          </p>

          <h2 className="mt-1 text-lg font-extrabold text-slate-950">
            Recommended Courses
          </h2>
        </div>

        <Link
          to="/dashboard/explore-courses"
          className="text-xs font-bold text-indigo-600"
        >
          Explore all
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardData.recommendedCourses.map((course) => {
          const thumbnail =
            thumbnailMap[course.type as keyof typeof thumbnailMap];

          return (
            <article
              key={course.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Image */}
              <div
                className={`relative h-36 bg-gradient-to-br ${thumbnail.gradient}`}
              >
                <div className="flex h-full items-center justify-center">
                  <span className="text-4xl font-extrabold text-white/95">
                    {thumbnail.text}
                  </span>
                </div>

                {/* Favorite */}
                <button className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-500 backdrop-blur transition hover:text-red-500">
                  <Heart size={15} />
                </button>

                {/* Duration */}
                <span className="absolute bottom-3 left-3 rounded-md bg-black/40 px-2 py-1 text-[10px] font-bold text-white backdrop-blur">
                  {course.duration}
                </span>
              </div>

              {/* Info */}
              <div className="p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  {course.category}
                </span>

                <h3 className="mt-1 line-clamp-2 min-h-[40px] text-sm font-extrabold leading-5 text-slate-900">
                  {course.title}
                </h3>

                <div className="mt-4 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                    <Star size={13} className="fill-amber-400 text-amber-400" />

                    {course.rating}
                  </span>

                  <span className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Users size={12} />
                    {course.students}
                  </span>
                </div>

                <Link
                  to="/dashboard/explore-courses"
                  className="mt-4 flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <PlayCircle size={14} />
                  View course
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
