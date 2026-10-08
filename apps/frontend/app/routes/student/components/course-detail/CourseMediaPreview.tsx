import { Play } from "lucide-react";

import type { CourseDetail } from "../../explore-courses/$courseId/route";

type Props = {
  course: CourseDetail;
};

export function CourseMediaPreview({ course }: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-xl">
      <div className="relative aspect-video">
        {course.thumbnailUrl ? (
          <img src={course.thumbnailUrl} alt={course.title || "Course thumbnail"} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-800">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white">
                <Play size={24} />
              </div>

              <p className="mt-3 text-xs text-white/70">Preview unavailable</p>
            </div>
          </div>
        )}

        {/* Dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

        {/* Preview badge */}
        <div className="absolute left-3 top-3 rounded-lg bg-emerald-500 px-3 py-1.5 text-[10px] font-bold text-white shadow-sm">FREE PREVIEW</div>

        {/* Play */}
        <button
          type="button"
          className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white bg-white/10 text-white backdrop-blur-sm transition hover:scale-105 hover:bg-white/20"
          aria-label="Play course preview"
        >
          <Play size={27} fill="currentColor" className="ml-1" />
        </button>

        {/* Bottom title */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">Learn at your own pace</p>

          <h1 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">{course.title || "Untitled Course"}</h1>
        </div>
      </div>

      {/* Fake media footer / helpful hint */}
      <div className="flex items-center justify-between bg-slate-950 px-4 py-2.5 text-[10px] font-semibold text-white/80">
        <span>↓ Browse course content</span>
        <span className="hidden sm:block">Browse lessons and sections below</span>
      </div>
    </div>
  );
}
