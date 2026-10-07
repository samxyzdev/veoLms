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

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-6">
        <h2 className="text-lg font-bold text-slate-950">Course Content</h2>

        <p className="mt-1 text-xs text-slate-500">
          {sortedSections.length} sections • {totalLessons} lessons
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {sortedSections.map((section) => (
          <CourseSection key={section.id} section={section} courseId={courseId} isPurchased={isPurchased} />
        ))}
      </div>
    </section>
  );
}
