import { BookOpen, CalendarDays, Check, Globe, Layers3, Share2, UserRound } from "lucide-react";

import type { CourseDetail } from "../../explore-courses/$courseId/route";

type Props = {
  course: CourseDetail;
  lessonCount: number;
  sectionCount: number;
};

function formatLevel(level: string | null | undefined) {
  if (!level) return "Level unavailable";

  return level.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function CourseIntro({ course, lessonCount, sectionCount }: Props) {
  return (
    <div className="flex flex-col justify-center">
      {/* Category */}
      <div className="w-fit rounded-full bg-indigo-100 px-3 py-1.5 text-[10px] font-bold text-indigo-600">{course.categoryName || "Category unavailable"}</div>

      {/* Title */}
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">{course.title || "Untitled Course"}</h1>

      {/* Description */}
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{course.description || "Course description is not available yet."}</p>

      {/* Metadata */}
      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-slate-600">
        <span className="inline-flex items-center gap-1.5">
          <BookOpen size={13} className="text-indigo-600" />
          {lessonCount > 0 ? `${lessonCount} lessons` : "0 lessons"}
        </span>

        <span className="text-slate-300">•</span>

        <span className="inline-flex items-center gap-1.5">
          <Layers3 size={13} className="text-indigo-600" />
          {sectionCount > 0 ? `${sectionCount} sections` : "0 sections"}
        </span>

        <span className="text-slate-300">•</span>

        <span>{formatLevel(course.level)}</span>

        <span className="text-slate-300">•</span>

        <span className="inline-flex items-center gap-1.5">
          <Globe size={13} />
          {course.courseLanguage || "Language unavailable"}
        </span>
      </div>

      {/* Instructor */}
      <div className="mt-5 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-extrabold text-indigo-700">{(course.creatorName?.[0] || "I").toUpperCase()}</div>

        <div>
          <p className="text-[10px] text-slate-400">Created by</p>

          <p className="text-xs font-bold text-indigo-600">{course.creatorName || "Instructor unavailable"}</p>

          <p className="text-[10px] text-slate-500">Course instructor</p>
        </div>
      </div>

      {/* Updated */}
      <div className="mt-5 flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays size={13} />
          Updated {formatDate(course.updatedAt)}
        </span>

        <span className="inline-flex items-center gap-1.5">
          <Check size={13} className="text-emerald-600" />
          Course content below
        </span>
      </div>

      {/* Actions */}
      <div className="mt-5 flex items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[11px] font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <Share2 size={14} />
          Share
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[11px] font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <UserRound size={14} />
          Course details
        </button>
      </div>
    </div>
  );
}
