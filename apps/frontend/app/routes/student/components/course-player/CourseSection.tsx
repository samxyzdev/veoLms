import { ChevronDown, ChevronRight } from "lucide-react";

import { CourseLessonItem } from "./CourseLessonItem";
import type { PlayerSection } from "./types";
import { formatLessonDuration } from "./types";

type CourseSectionProps = {
  section: PlayerSection;
  activeLessonId: string | null;
  thumbnail: string | null;
  isOpen: boolean;
  onToggle: () => void;
  onLessonSelect: (lessonId: string) => void;
};

export function CourseSection({ section, activeLessonId, thumbnail, isOpen, onToggle, onLessonSelect }: CourseSectionProps) {
  const completedLessons = section.lessons.filter((lesson) => lesson.isCompleted).length;
  const duration = section.lessons.reduce((sum, lesson) => sum + (lesson.durationSeconds ?? 0), 0);

  return (
    <section className="mb-2 overflow-hidden rounded-xl border border-slate-200 last:mb-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-3 px-3 py-3 text-left transition hover:bg-slate-50 sm:px-3.5"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-xs font-extrabold text-indigo-700">{String(section.number).padStart(2, "0")}</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-xs font-extrabold text-slate-900">{section.title}</span>
          <span className="mt-0.5 block text-[10px] text-slate-500">{section.lessons.length} lessons • {formatLessonDuration(duration)}{completedLessons > 0 ? ` • ${completedLessons} done` : ""}</span>
        </span>
        {isOpen ? <ChevronDown size={15} className="shrink-0 text-slate-500" /> : <ChevronRight size={15} className="shrink-0 text-slate-500" />}
      </button>

      {isOpen && (
        <div className="divide-y divide-slate-100 border-t border-slate-100">
          {section.lessons.length > 0 ? (
            section.lessons.map((lesson) => (
              <CourseLessonItem
                key={lesson.id}
                lesson={lesson}
                thumbnail={thumbnail}
                isCurrent={lesson.id === activeLessonId}
                onSelect={() => onLessonSelect(lesson.id)}
              />
            ))
          ) : (
            <p className="px-4 py-5 text-center text-xs text-slate-400">No lessons in this section yet.</p>
          )}
        </div>
      )}
    </section>
  );
}
