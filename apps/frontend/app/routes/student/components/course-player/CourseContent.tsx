import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { CourseSection } from "./CourseSection";
import { LessonSearch } from "./LessonSearch";
import type { PlayerSection } from "./types";
import { formatLessonDuration } from "./types";

type CourseContentProps = {
  courseTitle: string;
  sections: PlayerSection[];
  activeLessonId: string | null;
  progress: { completedLessons: number; totalLessons: number; percentage: number };
  thumbnail: string | null;
  onLessonSelect: (lessonId: string) => void;
};

export function CourseContent({ courseTitle, sections, activeLessonId, progress, thumbnail, onLessonSelect }: CourseContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [openSectionIds, setOpenSectionIds] = useState<Set<string>>(() => {
    const activeSection = sections.find((section) => section.lessons.some((lesson) => lesson.id === activeLessonId));
    const initialSectionId = activeSection?.id ?? sections[0]?.id;
    return new Set(initialSectionId ? [initialSectionId] : []);
  });
  const totalDuration = sections.flatMap((section) => section.lessons).reduce((sum, lesson) => sum + (lesson.durationSeconds ?? 0), 0);
  const allOpen = sections.length > 0 && sections.every((section) => openSectionIds.has(section.id));

  useEffect(() => {
    const activeSection = sections.find((section) => section.lessons.some((lesson) => lesson.id === activeLessonId));
    if (!activeSection) return;
    setOpenSectionIds((current) => current.has(activeSection.id) ? current : new Set(current).add(activeSection.id));
  }, [activeLessonId, sections]);

  const filteredSections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return sections;

    return sections
      .map((section) => {
        const sectionMatches = section.title.toLowerCase().includes(query);
        const lessons = section.lessons.filter((lesson) => lesson.title.toLowerCase().includes(query));
        if (!sectionMatches && lessons.length === 0) return null;
        return { ...section, lessons: sectionMatches ? section.lessons : lessons };
      })
      .filter((section): section is PlayerSection => section !== null);
  }, [sections, searchQuery]);

  const summary = `${sections.length} ${sections.length === 1 ? "section" : "sections"} • ${progress.totalLessons} lessons • ${formatLessonDuration(totalDuration)}`;

  function toggleAllSections() {
    setOpenSectionIds(allOpen ? new Set() : new Set(sections.map((section) => section.id)));
  }

  function toggleSection(sectionId: string) {
    setOpenSectionIds((current) => {
      const next = new Set(current);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  }

  return (
    <aside aria-label={`${courseTitle} curriculum`} className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:sticky xl:top-24">
      <div className="border-b border-slate-200 px-4 py-4 sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-extrabold tracking-tight text-slate-950">Course content</h2>
            <p className="mt-1 text-xs text-slate-500">{summary}</p>
          </div>
          <button
            type="button"
            onClick={toggleAllSections}
            aria-label={allOpen ? "Collapse all sections" : "Expand all sections"}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          >
            {allOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${progress.percentage}%` }} />
          </div>
          <span className="shrink-0 text-[11px] font-semibold text-slate-500">{progress.percentage}% complete</span>
        </div>

        <LessonSearch value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="max-h-[calc(100vh-285px)] overflow-y-auto p-2 sm:p-2.5">
        {filteredSections.length > 0 ? (
          filteredSections.map((section) => (
            <CourseSection
              key={section.id}
              section={section}
              activeLessonId={activeLessonId}
              thumbnail={thumbnail}
              isOpen={Boolean(searchQuery.trim()) || openSectionIds.has(section.id)}
              onToggle={() => toggleSection(section.id)}
              onLessonSelect={onLessonSelect}
            />
          ))
        ) : (
          <div className="px-5 py-10 text-center">
            <p className="text-sm font-semibold text-slate-700">No lessons found</p>
            <p className="mt-1 text-xs text-slate-400">Try another lesson or section name.</p>
          </div>
        )}
      </div>
    </aside>
  );
}
