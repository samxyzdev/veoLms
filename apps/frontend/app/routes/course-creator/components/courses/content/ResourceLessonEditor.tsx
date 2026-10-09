import type { Lesson } from "./types";

export function ResourceLessonEditor({ lesson, onChange, disabled = false }: { lesson: Lesson; onChange: <K extends keyof Lesson>(key: K, value: Lesson[K]) => void; disabled?: boolean }) {
  return (
    <div>
      <h3 className="text-base font-semibold text-slate-900">Downloadable resource</h3>
      <p className="mt-1 text-xs text-slate-500">Add the file URL students can open or download.</p>
      <label className="mb-2 mt-5 block text-sm font-medium text-slate-900">File URL</label>
      <input type="url" value={lesson.resourceUrl ?? ""} onChange={(event) => onChange("resourceUrl", event.target.value)} disabled={disabled} placeholder="https://…" className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-violet-400 disabled:bg-slate-50" />
    </div>
  );
}
