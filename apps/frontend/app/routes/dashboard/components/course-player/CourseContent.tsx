import { useMemo, useState } from "react";

import type coursePlayerData from "../../../data/coursePlayerData.json";

import { CourseProgress } from "./CourseProgress";
import { CourseSection } from "./CourseSection";
import { LessonSearch } from "./LessonSearch";

type CourseContentProps = {
  courseData: typeof coursePlayerData;
};

export function CourseContent({ courseData }: CourseContentProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return courseData.sections;
    }

    return courseData.sections
      .map((section) => {
        const sectionMatches = section.title.toLowerCase().includes(query);

        const lessons = section.lessons.filter((lesson) =>
          lesson.title.toLowerCase().includes(query),
        );

        if (sectionMatches || lessons.length > 0) {
          return {
            ...section,
            lessons: sectionMatches ? section.lessons : lessons,
          };
        }

        return null;
      })
      .filter(
        (section): section is (typeof courseData.sections)[number] =>
          section !== null,
      );
  }, [courseData.sections, searchQuery]);

  return (
    <aside className="h-fit overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-4">
        <CourseProgress
          completedLessons={courseData.progress.completedLessons}
          totalLessons={courseData.progress.totalLessons}
          percentage={courseData.progress.percentage}
        />

        <LessonSearch value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="max-h-[calc(100vh-190px)] overflow-y-auto">
        {filteredSections.length > 0 ? (
          filteredSections.map((section) => (
            <CourseSection key={section.id} section={section} />
          ))
        ) : (
          <div className="px-5 py-10 text-center">
            <p className="text-sm font-medium text-slate-700">
              No lessons found
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Try searching with a different keyword.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
