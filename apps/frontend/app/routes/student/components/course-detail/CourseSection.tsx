import { ChevronDown, ChevronRight, Lock, PlayCircle } from "lucide-react";

import type { CourseSection as CourseSectionType } from "../../explore-courses/$courseId/route";

type Props = {
  section: CourseSectionType;
  courseId: string;
  isPurchased: boolean;
  isOpen: boolean;
  onToggle: () => void;
};

export function CourseSection({ section, isPurchased, isOpen, onToggle }: Props) {
  const lessons = section.contents ?? [];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      {/* Section header */}
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-3 bg-slate-50 px-4 py-3 text-left transition hover:bg-slate-100">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white">{section.sequenceOrder}</div>

          <div className="min-w-0">
            <p className="truncate text-xs font-extrabold text-slate-900">{section.title || "Section title unavailable"}</p>

            <p className="mt-0.5 text-[10px] text-slate-500">
              {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}
            </p>
          </div>
        </div>

        {isOpen ? <ChevronDown size={16} className="shrink-0 text-slate-500" /> : <ChevronRight size={16} className="shrink-0 text-slate-500" />}
      </button>

      {/* Lessons */}
      {isOpen && (
        <div className="divide-y divide-slate-100">
          {lessons.length > 0 ? (
            lessons.map((lesson, index) => {
              const isPreview = lesson.isPreview === true;

              const canAccess = isPurchased || isPreview;

              return (
                <div key={lesson.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="shrink-0">{canAccess ? <PlayCircle size={15} className="text-indigo-600" /> : <Lock size={14} className="text-slate-400" />}</div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-semibold text-slate-700">
                      {index + 1}. {lesson.title || "Lesson unavailable"}
                    </p>
                  </div>

                  {isPreview && <span className="rounded-md bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600">FREE</span>}

                  {lesson.duration != null && <span className="shrink-0 text-[10px] text-slate-400">{formatDuration(lesson.duration)}</span>}
                </div>
              );
            })
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-[11px] font-semibold text-slate-500">No lessons in this section.</p>

              <p className="mt-1 text-[10px] text-slate-400">Lessons will appear here when they are added.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds)) {
    return "";
  }

  const minutes = Math.floor(seconds / 60);

  const hours = Math.floor(minutes / 60);

  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }

  return `${remainingMinutes}m`;
}
