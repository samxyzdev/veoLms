import { ChevronDown } from "lucide-react";

import type { CourseSection as CourseSectionType } from "../../explore-courses/$courseId/route";

import { CourseLessonItem } from "./CourseLessonItem";

type Props = {
  section: CourseSectionType;
  courseId: string;
  isPurchased: boolean;
  isOpen: boolean;
  onToggle: () => void;
};

export function CourseSection({ section, courseId, isPurchased, isOpen, onToggle }: Props) {
  const lessons = [...section.contents].sort((a, b) => a.sequenceOrder - b.sequenceOrder);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <button type="button" aria-expanded={isOpen} onClick={onToggle} className={`flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left transition ${isOpen ? "bg-indigo-50/70" : "bg-slate-50 hover:bg-indigo-50/50"}`}>
        <div className="flex min-w-0 items-center gap-3">
          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold text-white ${isOpen ? "bg-indigo-700" : "bg-slate-700"}`}>{section.sequenceOrder}</span>
          <span className="min-w-0">
            <span className="block truncate text-xs font-extrabold text-slate-900">{section.title}</span>
            <span className="mt-0.5 block text-[10px] text-slate-500">{lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}</span>
          </span>
        </div>

        <ChevronDown size={16} className={`shrink-0 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="divide-y divide-slate-100 border-t border-slate-100 px-2.5">
          {lessons.map((lesson) => (
            <CourseLessonItem key={lesson.id} lesson={lesson} sectionOrder={section.sequenceOrder} courseId={courseId} isPurchased={isPurchased} />
          ))}
        </div>
      )}
    </div>
  );
}
