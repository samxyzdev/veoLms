import { Lock, Play } from "lucide-react";
import { useNavigate } from "react-router";

import type { CourseLesson } from "../../explore-courses/$courseId/route";

type Props = {
  lesson: CourseLesson;
  sectionOrder: number;
  courseId: string;
  isPurchased: boolean;
};

export function CourseLessonItem({ lesson, sectionOrder, courseId, isPurchased }: Props) {
  const navigate = useNavigate();

  const hasAccess = isPurchased || lesson.isPreview;

  function handleClick() {
    if (!hasAccess) {
      return;
    }

    if (lesson.isPreview) {
      navigate(`/dashboard/explore-courses/${courseId}/preview/${lesson.id}`);

      return;
    }

    navigate(`/dashboard/my-learning/${courseId}`);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!hasAccess}
      className={`flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-2.5 text-left transition ${hasAccess ? "cursor-pointer hover:bg-indigo-50/70" : "cursor-not-allowed"}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${hasAccess ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"}`}
        >
          {hasAccess ? <Play size={11} fill="currentColor" /> : <Lock size={12} />}
        </div>

        <div className="min-w-0">
          <p className={`truncate text-[11px] font-medium ${hasAccess ? "text-slate-800" : "text-slate-500"}`}>
            <span className="mr-2 text-[10px] text-slate-500">{sectionOrder}.{lesson.sequenceOrder}</span>{lesson.title}
          </p>
          <p className="mt-0.5 text-[9px] capitalize text-slate-400">{lesson.contentType}</p>
        </div>
      </div>

      {lesson.isPreview ? (
        <span className="shrink-0 rounded-md border border-emerald-500 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">FREE</span>
      ) : lesson.duration ? (
        <span className="shrink-0 text-[10px] text-slate-500">{lesson.duration}</span>
      ) : isPurchased ? (
        <span className="text-[10px] font-semibold text-indigo-600">Play</span>
      ) : (
        <Lock size={14} className="shrink-0 text-slate-400" />
      )}
    </button>
  );
}
