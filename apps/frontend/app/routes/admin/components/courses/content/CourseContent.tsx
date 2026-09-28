// app/routes/admin/components/courses/content/CourseContent.tsx

import { Plus } from "lucide-react";
import { useState } from "react";

import { initialCourseSections } from "../../../data/courseContentData";
import { SectionItem } from "./SectionItem";
import type { Lesson, Section } from "./types";

export default function CourseContent() {
  const [sections, setSections] = useState<Section[]>(initialCourseSections);

  const [openSections, setOpenSections] = useState<number[]>(
    initialCourseSections.map((section) => section.id),
  );

  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);

  function toggleSection(sectionId: number) {
    setOpenSections((current) =>
      current.includes(sectionId)
        ? current.filter((id) => id !== sectionId)
        : [...current, sectionId],
    );
  }

  function addSection() {
    const newSection: Section = {
      id: Date.now(),
      title: `New Section ${sections.length + 1}`,
      lessons: [],
    };

    setSections((current) => [...current, newSection]);

    setOpenSections((current) => [...current, newSection.id]);
  }

  function renameSection(sectionId: number) {
    const section = sections.find((item) => item.id === sectionId);

    if (!section) return;

    const title = window.prompt("Section title", section.title);

    if (!title?.trim()) return;

    setSections((current) =>
      current.map((item) =>
        item.id === sectionId
          ? {
              ...item,
              title: title.trim(),
            }
          : item,
      ),
    );
  }

  function deleteSection(sectionId: number) {
    const confirmed = window.confirm(
      "Delete this section and all its lessons?",
    );

    if (!confirmed) return;

    setSections((current) =>
      current.filter((section) => section.id !== sectionId),
    );

    setOpenSections((current) => current.filter((id) => id !== sectionId));

    setActiveLessonId(null);
  }

  function duplicateSection(sectionId: number) {
    const section = sections.find((item) => item.id === sectionId);

    if (!section) return;

    const duplicated: Section = {
      ...section,
      id: Date.now(),
      title: `${section.title} Copy`,
      lessons: section.lessons.map((lesson, index) => ({
        ...lesson,
        id: Date.now() + index + 1,
      })),
    };

    setSections((current) => [...current, duplicated]);

    setOpenSections((current) => [...current, duplicated.id]);
  }

  function addLesson(sectionId: number) {
    const lesson: Lesson = {
      id: Date.now(),
      title: "New Lesson",
      description: "",
      type: "video",
      duration: "10 min",
      freePreview: false,
      downloadable: false,
    };

    setSections((current) =>
      current.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              lessons: [...section.lessons, lesson],
            }
          : section,
      ),
    );

    setOpenSections((current) =>
      current.includes(sectionId) ? current : [...current, sectionId],
    );

    setActiveLessonId(lesson.id);
  }

  function openLesson(lessonId: number) {
    setActiveLessonId((current) => (current === lessonId ? null : lessonId));
  }

  function saveLesson(updatedLesson: Lesson) {
    setSections((current) =>
      current.map((section) => ({
        ...section,
        lessons: section.lessons.map((lesson) =>
          lesson.id === updatedLesson.id ? updatedLesson : lesson,
        ),
      })),
    );

    setActiveLessonId(null);
  }

  function deleteLesson(lessonId: number) {
    setSections((current) =>
      current.map((section) => ({
        ...section,
        lessons: section.lessons.filter((lesson) => lesson.id !== lessonId),
      })),
    );

    setActiveLessonId(null);
  }

  function duplicateLesson(lessonId: number) {
    setSections((current) =>
      current.map((section) => {
        const lessonIndex = section.lessons.findIndex(
          (lesson) => lesson.id === lessonId,
        );

        if (lessonIndex === -1) {
          return section;
        }

        const original = section.lessons[lessonIndex];

        const duplicated: Lesson = {
          ...original,
          id: Date.now(),
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

  return (
    <div>
      {/* // Header */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#101537]">
            Course Content
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Organize your course into sections and lessons. Add videos,
            articles, quizzes, assignments and more.
          </p>
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
      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section) => (
          <SectionItem
            key={section.id}
            section={section}
            isOpen={openSections.includes(section.id)}
            activeLessonId={activeLessonId}
            onToggle={() => toggleSection(section.id)}
            onRename={() => renameSection(section.id)}
            onDelete={() => deleteSection(section.id)}
            onDuplicate={() => duplicateSection(section.id)}
            onAddLesson={() => addLesson(section.id)}
            onOpenLesson={openLesson}
            onDeleteLesson={deleteLesson}
            onDuplicateLesson={duplicateLesson}
            onSaveLesson={saveLesson}
          />
        ))}
      </div>
      {/* Bottom Add Section */}
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
