// app/routes/admin/components/courses/content/AssignmentEditor.tsx

import type { Lesson } from "./types";

export function AssignmentEditor({
  lesson,
  onChange,
}: {
  lesson: Lesson;
  onChange: <K extends keyof Lesson>(key: K, value: Lesson[K]) => void;
}) {
  return (
    <div>
      <h3 className="text-base font-semibold text-slate-900">Assignment</h3>

      <p className="mt-1 text-xs text-slate-500">
        Add instructions and submission requirements.
      </p>

      <textarea
        rows={8}
        value={lesson.description}
        onChange={(e) => onChange("description", e.target.value)}
        placeholder="Write assignment instructions..."
        className="mt-5 w-full resize-none rounded-xl border border-slate-200 p-4 text-sm leading-6 outline-none focus:border-violet-400"
      />
    </div>
  );
}
