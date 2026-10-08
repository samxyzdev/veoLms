import { ChevronRight } from "lucide-react";
import { Link } from "react-router";

import type { CourseDetail, CourseSection } from "../../explore-courses/$courseId/route";
import { CourseIntro } from "./CourseIntro";
import { CourseMediaPreview } from "./CourseMediaPreview";
import { CoursePurchaseCard } from "./CoursePurchaseCard";

type CourseHeroProps = {
  course: CourseDetail;
  sections: CourseSection[];
  isPurchased: boolean;
};

export function CourseHero({ course, sections, isPurchased }: CourseHeroProps) {
  const lessonCount = sections.reduce((total, section) => total + section.contents.length, 0);
  return (
    <section className="border-b border-slate-200 bg-gradient-to-br from-[#f1f2ff] via-[#f8f9ff] to-[#f4f6fb]">
      <div className="mx-auto max-w-[1600px] px-4 pb-6 pt-5 sm:px-7 sm:pb-8 lg:px-10">
        <nav aria-label="Breadcrumb" className="mb-4 flex min-w-0 items-center gap-2 text-xs text-slate-500">
          <Link to="/dashboard/explore-courses" className="shrink-0 transition hover:text-indigo-600">Explore</Link>
          <ChevronRight size={14} className="shrink-0 text-slate-400" />
          <span className="shrink-0 truncate">{course.categoryName || "Courses"}</span>
          <ChevronRight size={14} className="shrink-0 text-slate-400" />
          <span className="truncate font-medium text-slate-700">{course.title}</span>
        </nav>

        <div className="grid items-center gap-6 xl:grid-cols-[minmax(0,1.32fr)_minmax(300px,0.92fr)_312px] xl:gap-8">
          <CourseMediaPreview course={course} />
          <CourseIntro course={course} sectionCount={sections.length} lessonCount={lessonCount} />
          <CoursePurchaseCard course={course} isPurchased={isPurchased} />
        </div>
      </div>
    </section>
  );
}
