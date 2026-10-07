import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import type { CourseSection as CourseSectionType } from "../../explore-courses/$courseId/route";

import { CourseLessonItem } from "./CourseLessonItem";

type Props = {
  section: CourseSectionType;
  courseId: string;
  isPurchased: boolean;
};

export function CourseSection({ section, courseId, isPurchased }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  const lessons = [...section.contents].sort((a, b) => a.sequenceOrder - b.sequenceOrder);

  return (
    <div>
      <button type="button" onClick={() => setIsOpen((value) => !value)} className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition hover:bg-slate-50">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            {section.sequenceOrder}. {section.title}
          </h3>

          <p className="mt-1 text-xs text-slate-400">{lessons.length} lessons</p>
        </div>

        {isOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
      </button>

      {isOpen && (
        <div className="border-t border-slate-100">
          {lessons.map((lesson) => (
            <CourseLessonItem key={lesson.id} lesson={lesson} courseId={courseId} isPurchased={isPurchased} />
          ))}
        </div>
      )}
    </div>
  );
}
