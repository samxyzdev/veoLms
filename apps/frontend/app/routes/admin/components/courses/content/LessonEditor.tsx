// app/routes/admin/components/courses/content/LessonEditor.tsx

import { Save, Video } from "lucide-react";
import { useState } from "react";

import { ArticleEditor } from "./ArticleEditor";
import { AssignmentEditor } from "./AssignmentEditor";
import { CodeEditor } from "./CodeEditor";
import { ContentTypeSelector } from "./ContentTypeSelector";
import { FileEditor } from "./FileEditor";
import { QuizEditor } from "./QuizEditor";
import { VideoLessonEditor } from "./VideoLessonEditor";

import type { Lesson } from "./types";

export function LessonEditor({
  lesson,
  onSave,
  onClose,
}: {
  lesson: Lesson;
  onSave: (lesson: Lesson) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<Lesson>(lesson);

  function updateDraft<K extends keyof Lesson>(key: K, value: Lesson[K]) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  }

  return (
    <div className="border-t border-violet-200 bg-white">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
            <Video className="h-4 w-4" />
          </div>

          <input
            type="text"
            value={draft.title}
            onChange={(e) => updateDraft("title", e.target.value)}
            className="h-9 min-w-0 flex-1 rounded-lg border border-slate-200 px-3 text-sm font-medium outline-none focus:border-violet-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-lg px-4 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onSave(draft)}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-violet-600 px-4 text-sm font-semibold text-white hover:bg-violet-700"
          >
            <Save className="h-4 w-4" />
            Save Lesson
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[150px_minmax(0,1fr)]">
        <ContentTypeSelector
          value={draft.type}
          onChange={(type) => updateDraft("type", type)}
        />

        <div className="p-4 lg:p-5">
          {draft.type === "video" && (
            <VideoLessonEditor lesson={draft} onChange={updateDraft} />
          )}

          {draft.type === "article" && (
            <ArticleEditor lesson={draft} onChange={updateDraft} />
          )}

          {draft.type === "quiz" && <QuizEditor />}

          {draft.type === "assignment" && (
            <AssignmentEditor lesson={draft} onChange={updateDraft} />
          )}

          {draft.type === "file" && <FileEditor />}

          {draft.type === "code" && <CodeEditor />}
        </div>
      </div>
    </div>
  );
}
