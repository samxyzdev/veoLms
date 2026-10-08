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
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  }

  function toggleAllSections() {
    setExpandedSectionIds(allExpanded ? new Set() : new Set(sortedSections.map((section) => section.id)));
  }

  return (
    <section id="course-content" className="scroll-mt-16 rounded-xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-950">Course Content</h2>
          <p className="mt-1 text-[11px] text-slate-500">{totalLessons} lessons • {sortedSections.length} sections</p>
        </div>
        {sortedSections.length > 1 && <button type="button" onClick={toggleAllSections} className="mt-1 shrink-0 text-[11px] font-bold text-indigo-600 hover:text-indigo-700">{allExpanded ? "Collapse all" : "Expand all"}</button>}
      </div>
      {sortedSections.length > 0 ? (
        <div className="space-y-2 p-3 sm:p-4">
          {sortedSections.map((section) => (
            <CourseSection
              key={section.id}
              section={section}
              courseId={courseId}
              isPurchased={isPurchased}
              isOpen={expandedSectionIds.has(section.id)}
              onToggle={() => toggleSection(section.id)}
            />
          ))}
        </div>
      ) : (
        <p className="px-5 py-8 text-center text-xs text-slate-500">Course lessons will appear here.</p>
      )}
    </section>
  );
}
