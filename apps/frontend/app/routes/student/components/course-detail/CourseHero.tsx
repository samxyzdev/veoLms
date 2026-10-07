import { BookOpen, Languages, Layers3 } from "lucide-react";

import type { CourseDetail } from "../../explore-courses/$courseId/route";

type CourseHeroProps = {
  course: CourseDetail;
};

function formatLevel(level: CourseDetail["level"]) {
  switch (level) {
    case "beginner":
      return "Beginner";

    case "intermediate":
      return "Intermediate";

    case "advanced":
      return "Advanced";

    case "all_levels":
      return "All Levels";

    default:
      return "All Levels";
  }
}

export function CourseHero({ course }: CourseHeroProps) {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_460px] lg:items-center">
          {/* CONTENT */}

          <div>
            <div className="mb-4 inline-flex rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600">{course.categoryName || "Uncategorized"}</div>

            <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">{course.title}</h1>

            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">{course.description || "No description available."}</p>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Layers3 size={16} className="text-slate-400" />

                {formatLevel(course.level)}
              </div>

              <div className="flex items-center gap-2">
                <Languages size={16} className="text-slate-400" />

                {course.courseLanguage || "Not specified"}
              </div>

              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-slate-400" />
                Web Course
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                {course.creatorName
                  .split(" ")
                  .filter(Boolean)
                  .map((name) => name[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <div>
                <p className="text-xs text-slate-400">Created by</p>

                <p className="text-sm font-semibold text-slate-800">{course.creatorName}</p>
              </div>
            </div>
          </div>

          {/* THUMBNAIL */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-sm">
            {course.thumbnailUrl ? (
              <img src={course.thumbnailUrl} alt={course.title} className="aspect-video w-full object-cover" />
            ) : (
              <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-indigo-600 to-violet-700">
                <span className="text-4xl font-black text-white">COURSE</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
