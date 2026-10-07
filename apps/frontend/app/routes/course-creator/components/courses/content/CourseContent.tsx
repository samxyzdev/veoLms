// app/routes/admin/components/courses/content/CourseContent.tsx

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { SectionItem } from "./SectionItem";
import type { Lesson, Section } from "./types";

type BackendCourseSection = {
  id: string;
  courseId: string;
  title: string;
  sequenceOrder: number;
  createdAt: string;
  updatedAt: string;
  contents: BackendCourseContent[];
};

type BackendCourseContent = {
  id: string;
  sectionId: string;
  title: string;
  contentType: string;
  contentUrl: string | null;
  sequenceOrder: number;
  createdAt: string;
  updatedAt: string;
};

type CourseContentProps = {
  sections: BackendCourseSection[];
};

export default function CourseContent({ sections: backendSections }: CourseContentProps) {
  // ========================================================
  // BACKEND DATA -> UI DATA
  // ========================================================

  const initialSections: Section[] = backendSections.map((section) => ({
    id: section.id,
    title: section.title,
    lessons: section.contents.map((content) => ({
      id: content.id,
      title: content.title,
      description: "",
      type: content.contentType as Lesson["type"],
      duration: "10 min",
      freePreview: false,
      downloadable: false,
    })),
  }));

  // ========================================================
  // STATE
  // ========================================================

  const [sections, setSections] = useState<Section[]>(initialSections);

  const [openSections, setOpenSections] = useState<string[]>(initialSections.map((section) => String(section.id)));

  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  // ========================================================
  // SYNC BACKEND DATA
  // ========================================================

  useEffect(() => {
    const mappedSections: Section[] = backendSections.map((section) => ({
      id: section.id,
      title: section.title,
      lessons: section.contents.map((content) => ({
        id: content.id,
        title: content.title,
        description: "",
        type: content.contentType as Lesson["type"],
        duration: "10 min",
        freePreview: false,
        downloadable: false,
      })),
    }));

    setSections(mappedSections);

    setOpenSections(mappedSections.map((section) => String(section.id)));
  }, [backendSections]);

  // ========================================================
  // SECTION
  // ========================================================

  function toggleSection(sectionId: string) {
    setOpenSections((current) => (current.includes(sectionId) ? current.filter((id) => id !== sectionId) : [...current, sectionId]));
  }

  function addSection() {
    const newSection: Section = {
      id: crypto.randomUUID(),
      title: `New Section ${sections.length + 1}`,
      lessons: [],
    };
    setSections((current) => [...current, newSection]);
    setOpenSections((current) => [...current, String(newSection.id)]);
  }

  function renameSection(sectionId: string) {
    const section = sections.find((item) => String(item.id) === sectionId);

    if (!section) return;

    const title = window.prompt("Section title", section.title);

    if (!title?.trim()) return;

    setSections((current) =>
      current.map((item) =>
        String(item.id) === sectionId
          ? {
              ...item,
              title: title.trim(),
            }
          : item,
      ),
    );
  }

  function deleteSection(sectionId: string) {
    const confirmed = window.confirm("Delete this section and all its lessons?");

    if (!confirmed) return;

    setSections((current) => current.filter((section) => String(section.id) !== sectionId));

    setOpenSections((current) => current.filter((id) => id !== sectionId));

    setActiveLessonId(null);
  }

  function duplicateSection(sectionId: string) {
    const section = sections.find((item) => String(item.id) === sectionId);

    if (!section) return;

    const duplicated: Section = {
      ...section,
      id: crypto.randomUUID(),
      title: `${section.title} Copy`,
      lessons: section.lessons.map((lesson) => ({
        ...lesson,
        id: crypto.randomUUID(),
      })),
    };

    setSections((current) => [...current, duplicated]);

    setOpenSections((current) => [...current, String(duplicated.id)]);
  }

  // ========================================================
  // LESSON
  // ========================================================

  function addLesson(sectionId: string) {
    const lesson: Lesson = {
      id: crypto.randomUUID(),
      title: "New Lesson",
      description: "",
      type: "video",
      duration: "10 min",
      freePreview: false,
      downloadable: false,
    };

    setSections((current) =>
      current.map((section) =>
        String(section.id) === sectionId
          ? {
              ...section,
              lessons: [...section.lessons, lesson],
            }
          : section,
      ),
    );

    setOpenSections((current) => (current.includes(sectionId) ? current : [...current, sectionId]));

    setActiveLessonId(String(lesson.id));
  }

  function openLesson(lessonId: string) {
    setActiveLessonId((current) => (current === lessonId ? null : lessonId));
  }

  function saveLesson(updatedLesson: Lesson) {
    setSections((current) =>
      current.map((section) => ({
        ...section,
        lessons: section.lessons.map((lesson) => (String(lesson.id) === String(updatedLesson.id) ? updatedLesson : lesson)),
      })),
    );

    setActiveLessonId(null);
  }

  function deleteLesson(lessonId: string) {
    setSections((current) =>
      current.map((section) => ({
        ...section,
        lessons: section.lessons.filter((lesson) => String(lesson.id) !== lessonId),
      })),
    );

    setActiveLessonId(null);
  }

  function duplicateLesson(lessonId: string) {
    setSections((current) =>
      current.map((section) => {
        const lessonIndex = section.lessons.findIndex((lesson) => String(lesson.id) === lessonId);

        if (lessonIndex === -1) {
          return section;
        }

        const original = section.lessons[lessonIndex];

        const duplicated: Lesson = {
          ...original,
          id: crypto.randomUUID(),
          title: `${original.title} Copy`,
        };

        const lessons = [...section.lessons];

        lessons.splice(lessonIndex + 1, 0, duplicated);

        return {
          ...section,
          lessons,
        };
      }),
    );
  }

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <div>
      {/* HEADER */}

      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#101537]">Course Content</h2>

          <p className="mt-1 text-sm text-slate-500">Organize your course into sections and lessons. Add videos, articles, quizzes, assignments and more.</p>
        </div>

        <button
          type="button"
          onClick={addSection}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          <Plus className="h-4 w-4" />
          Add Section
        </button>
      </div>

      {/* SECTIONS */}

      <div className="space-y-4">
        {sections.map((section) => (
          <SectionItem
            key={String(section.id)}
            section={section}
            isOpen={openSections.includes(String(section.id))}
            activeLessonId={activeLessonId}
            onToggle={() => toggleSection(String(section.id))}
            onRename={() => renameSection(String(section.id))}
            onDelete={() => deleteSection(String(section.id))}
            onDuplicate={() => duplicateSection(String(section.id))}
            onAddLesson={() => addLesson(String(section.id))}
            onOpenLesson={openLesson}
            onDeleteLesson={deleteLesson}
            onDuplicateLesson={duplicateLesson}
            onSaveLesson={saveLesson}
          />
        ))}
      </div>

      {/* EMPTY STATE */}

      {sections.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-10 text-center">
          <p className="text-sm font-medium text-slate-700">No sections yet.</p>

          <p className="mt-1 text-sm text-slate-400">Start building your course by adding a section.</p>
        </div>
      )}

      {/* BOTTOM ADD SECTION */}

      <button
        type="button"
        onClick={addSection}
        className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-violet-200 bg-white text-sm font-semibold text-violet-600 transition hover:border-violet-400 hover:bg-violet-50"
      >
        <Plus className="h-4 w-4" />
        Add Section
      </button>
    </div>
  );
}
