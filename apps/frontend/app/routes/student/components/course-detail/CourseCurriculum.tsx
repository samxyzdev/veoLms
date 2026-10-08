import { useState } from "react";

import type { CourseSection as CourseSectionType } from "../../explore-courses/$courseId/route";

import { CourseSection } from "./CourseSection";

type Props = {
  sections: CourseSectionType[];
  courseId: string;
  isPurchased: boolean;
};

export function CourseCurriculum({ sections, courseId, isPurchased }: Props) {
  const sortedSections = [...sections].sort((a, b) => a.sequenceOrder - b.sequenceOrder);

  const totalLessons = sortedSections.reduce((total, section) => total + section.contents.length, 0);

  const [expandedSectionIds, setExpandedSectionIds] = useState<Set<string>>(() => new Set(sortedSections[0] ? [sortedSections[0].id] : []));

  const allExpanded = sortedSections.length > 0 && expandedSectionIds.size === sortedSections.length;

  function toggleSection(sectionId: string) {
    setExpandedSectionIds((current) => {
      const next = new Set(current);

      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }

      return next;
    });
  }

  function toggleAllSections() {
    setExpandedSectionIds(allExpanded ? new Set() : new Set(sortedSections.map((section) => section.id)));
  }

  return (
    <section id="course-content" className="min-h-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-950">Course Content</h2>

          <p className="mt-1 text-[11px] text-slate-500">
            {totalLessons} {totalLessons === 1 ? "lesson" : "lessons"} • {sortedSections.length} {sortedSections.length === 1 ? "section" : "sections"}
          </p>
        </div>

        {sortedSections.length > 1 && (
          <button type="button" onClick={toggleAllSections} className="mt-1 shrink-0 text-[11px] font-bold text-indigo-600 hover:text-indigo-700">
            {allExpanded ? "Collapse all" : "Expand all"}
          </button>
        )}
      </div>

      {/* Body */}
      {sortedSections.length > 0 ? (
        <div className="space-y-2 p-3">
          {sortedSections.map((section) => (
            <CourseSection key={section.id} section={section} courseId={courseId} isPurchased={isPurchased} isOpen={expandedSectionIds.has(section.id)} onToggle={() => toggleSection(section.id)} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[290px] flex-col items-center justify-center px-5 py-10 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 text-slate-400">
            <BookContentIcon />
          </div>

          <p className="mt-3 text-xs font-bold text-slate-700">No course content yet</p>

          <p className="mt-1 max-w-xs text-[11px] leading-5 text-slate-400">Course lessons and sections will appear here when they are added.</p>
        </div>
      )}
    </section>
  );
}

function BookContentIcon() {
  return <span className="text-lg">▤</span>;
}
