import { BookOpen, CalendarDays, Globe2, Layers3, Share2 } from "lucide-react";
import { useState } from "react";

import type { CourseDetail } from "../../explore-courses/$courseId/route";
import { formatCourseLevel } from "~/lib/course";
import { getInitials } from "~/lib/format";

type Props = {
  course: CourseDetail;
  sectionCount: number;
  lessonCount: number;
};

function formatUpdatedDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently updated";
  return `Updated ${new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(date)}`;
}

export function CourseIntro({ course, sectionCount, lessonCount }: Props) {
  const [shareLabel, setShareLabel] = useState("Share");

  async function shareCourse() {
    const shareUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: course.title, url: shareUrl });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setShareLabel("Link copied");
        window.setTimeout(() => setShareLabel("Share"), 1800);
      }
    } catch {
      // Sharing is optional and may be dismissed by the user.
    }
  }

  return (
    <div className="min-w-0 py-1">
      <span className="inline-flex rounded-full bg-indigo-100/90 px-3 py-1.5 text-[11px] font-bold text-indigo-700">{course.categoryName || "Explore this course"}</span>
      <h1 className="mt-3 text-[27px] font-extrabold leading-[1.15] tracking-tight text-slate-950 sm:text-[32px]">{course.title}</h1>
      <p className="mt-3 line-clamp-3 text-[13px] leading-5 text-slate-700">{course.description || "Explore the lessons and topics included in this course."}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-slate-700">
        <span className="inline-flex items-center gap-1.5"><BookOpen size={14} className="text-indigo-600" />{lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}</span>
        <span className="hidden h-1 w-1 rounded-full bg-slate-400 sm:block" />
        <span>{sectionCount} {sectionCount === 1 ? "section" : "sections"}</span>
        <span className="hidden h-1 w-1 rounded-full bg-slate-400 sm:block" />
        <span className="inline-flex items-center gap-1.5"><Layers3 size={14} className="text-slate-500" />{formatCourseLevel(course.level)}</span>
        <span className="hidden h-1 w-1 rounded-full bg-slate-400 sm:block" />
        <span className="inline-flex items-center gap-1.5"><Globe2 size={14} className="text-slate-500" />{course.courseLanguage || "Language not specified"}</span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white bg-indigo-100 text-[11px] font-extrabold text-indigo-700 shadow-sm">{getInitials(course.creatorName)}</div>
        <div className="min-w-0">
          <p className="text-[10px] text-slate-500">Created by</p>
          <p className="truncate text-xs font-bold text-indigo-700">{course.creatorName || "Course instructor"}</p>
          <p className="text-[10px] text-slate-500">Course instructor</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] text-slate-600">
        <span className="inline-flex items-center gap-1.5"><CalendarDays size={13} />{formatUpdatedDate(course.updatedAt)}</span>
        <span className="hidden h-1 w-1 rounded-full bg-slate-400 sm:block" />
        <span className="inline-flex items-center gap-1.5"><BookOpen size={13} />Course content below</span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button type="button" onClick={() => void shareCourse()} className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-bold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700">
          <Share2 size={14} />{shareLabel}
        </button>
      </div>
    </div>
  );
}
