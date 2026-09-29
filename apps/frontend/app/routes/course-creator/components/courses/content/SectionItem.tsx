// app/routes/admin/components/courses/content/SectionItem.tsx

import {
  ChevronDown,
  ChevronUp,
  Copy,
  GripVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { LessonEditor } from "./LessonEditor";
import type { Section, Lesson } from "./types";

export function SectionItem({
  section,
  isOpen,
  activeLessonId,
  onToggle,
  onRename,
  onDelete,
  onDuplicate,
  onAddLesson,
  onOpenLesson,
  onDeleteLesson,
  onDuplicateLesson,
  onSaveLesson,
}: {
  section: Section;
  isOpen: boolean;
  activeLessonId: number | null;

  onToggle: () => void;
  onRename: () => void;
  onDelete: () => void;
  onDuplicate: () => void;

  onAddLesson: () => void;
  onOpenLesson: (lessonId: number) => void;
  onDeleteLesson: (lessonId: number) => void;
  onDuplicateLesson: (lessonId: number) => void;
  onSaveLesson: (lesson: Lesson) => void;
}) {
  const totalMinutes = section.lessons.reduce((total, lesson) => {
    const minutes = Number.parseInt(lesson.duration, 10);

    return total + (Number.isNaN(minutes) ? 0 : minutes);
  }, 0);

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Section Header */}
      <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/50 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <GripVertical className="h-5 w-5 shrink-0 cursor-grab text-slate-400" />

          <div className="flex min-w-0 items-center gap-2">
            <h3 className="truncate text-sm font-bold text-slate-900">
              Section: {section.title}
            </h3>

            <button
              type="button"
              onClick={onRename}
              className="rounded p-1 text-slate-400 hover:bg-white hover:text-violet-600"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </div>

          <span className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 sm:inline-flex">
            {section.lessons.length} lessons
            {" • "}
            {totalMinutes} min
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToggle}
            className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-slate-700"
          >
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            onClick={onDuplicate}
            className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-violet-600"
          >
            <Copy className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Lessons */}
      {isOpen && (
        <div>
          <div className="divide-y divide-slate-100">
            {section.lessons.map((lesson, index) => {
              const isActive = activeLessonId === lesson.id;

              return (
                <div key={lesson.id}>
                  <button
                    type="button"
                    onClick={() => onOpenLesson(lesson.id)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                      isActive ? "bg-violet-50/50" : "hover:bg-slate-50"
                    }`}
                  >
                    <GripVertical className="h-4 w-4 shrink-0 text-slate-300" />

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {lesson.title}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-slate-400">
                        {lesson.description || "No lesson description"}
                      </p>
                    </div>

                    <span className="hidden rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-600 md:inline-flex">
                      {lesson.type}
                    </span>

                    <span className="hidden text-xs text-slate-400 sm:block">
                      {lesson.duration}
                    </span>
                  </button>

                  {/* Editor */}
                  {isActive && (
                    <LessonEditor
                      lesson={lesson}
                      onSave={onSaveLesson}
                      onClose={() => onOpenLesson(lesson.id)}
                    />
                  )}

                  {/* Actions */}
                  {!isActive && (
                    <div className="flex justify-end gap-1 px-4 pb-2">
                      <button
                        type="button"
                        onClick={() => onOpenLesson(lesson.id)}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-violet-600"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDuplicateLesson(lesson.id)}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-violet-600"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteLesson(lesson.id)}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onAddLesson}
            className="mx-4 my-3 flex h-10 w-[calc(100%-2rem)] items-center justify-center gap-2 rounded-lg border border-dashed border-violet-200 bg-violet-50/30 text-sm font-medium text-violet-600 hover:border-violet-400 hover:bg-violet-50"
          >
            <Plus className="h-4 w-4" />
            Add Lesson
          </button>
        </div>
      )}
    </section>
  );
}
