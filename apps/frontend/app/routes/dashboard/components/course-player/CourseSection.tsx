import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

import { CourseLessonItem } from "./CourseLessonItem";

type CourseSectionProps = {
  section: {
    id: string;
    number: number;
    title: string;
    completedLessons: number;
    totalLessons: number;
    isExpanded: boolean;
    lessons: Array<{
      id: string;
      number: string;
      title: string;
      duration: string;
      isCompleted: boolean;
      isCurrent?: boolean;
      isLocked?: boolean;
    }>;
  };
};

export function CourseSection({ section }: CourseSectionProps) {
  const [isExpanded, setIsExpanded] = useState(section.isExpanded);

  return (
    <div className="border-t border-slate-100 first:border-t-0">
      <button
        type="button"
        onClick={() => setIsExpanded((value) => !value)}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-slate-50"
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
        )}

        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800">
          {section.number}. {section.title}
        </span>

        <span className="shrink-0 text-xs font-medium text-slate-400">
          {section.completedLessons}/{section.totalLessons}
        </span>
      </button>

      {isExpanded && (
        <div className="pb-2">
          {section.lessons.map((lesson) => (
            <CourseLessonItem key={lesson.id} lesson={lesson} />
          ))}
        </div>
      )}
    </div>
  );
}
