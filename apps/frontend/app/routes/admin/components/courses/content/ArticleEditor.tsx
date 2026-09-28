// app/routes/admin/components/courses/content/ArticleEditor.tsx

import type { Lesson } from "./types";

export function ArticleEditor({
  lesson,
  onChange,
}: {
  lesson: Lesson;
  onChange: <K extends keyof Lesson>(key: K, value: Lesson[K]) => void;
}) {
  return (
    <div>
      <h3 className="text-base font-semibold text-slate-900">
        Article Content
      </h3>

      <p className="mt-1 text-xs text-slate-500">
        Write the content students will read.
      </p>

      <textarea
        rows={12}
        value={lesson.description}
        onChange={(e) => onChange("description", e.target.value)}
        placeholder="Start writing your lesson..."
        className="mt-5 w-full resize-none rounded-xl border border-slate-200 p-4 text-sm leading-7 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
      />
    </div>
  );
}
