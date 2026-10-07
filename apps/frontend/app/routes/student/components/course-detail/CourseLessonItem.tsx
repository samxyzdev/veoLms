import { Lock, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router";

import type { CourseLesson } from "../../explore-courses/$courseId/route";

type Props = {
  lesson: CourseLesson;
  courseId: string;
  isPurchased: boolean;
};

export function CourseLessonItem({ lesson, courseId, isPurchased }: Props) {
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
      className={`
        flex w-full items-center justify-between gap-4
        px-6 py-3.5 text-left transition
        ${hasAccess ? "cursor-pointer hover:bg-indigo-50/50" : "cursor-not-allowed"}
      `}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`
            flex h-8 w-8 shrink-0 items-center justify-center rounded-full
            ${hasAccess ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-400"}
          `}
        >
          {hasAccess ? <PlayCircle size={16} /> : <Lock size={14} />}
        </div>

        <div className="min-w-0">
          <p className={`truncate text-sm font-medium ${hasAccess ? "text-slate-700" : "text-slate-400"}`}>{lesson.title}</p>

          <p className="mt-0.5 text-[10px] text-slate-400">{lesson.contentType}</p>
        </div>
      </div>

      {lesson.isPreview ? (
        <span className="shrink-0 rounded-md bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600">FREE PREVIEW</span>
      ) : isPurchased ? (
        <span className="text-[10px] font-semibold text-indigo-600">Play</span>
      ) : (
        <Lock size={14} className="shrink-0 text-slate-400" />
      )}
    </button>
  );
}
