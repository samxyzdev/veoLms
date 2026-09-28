// app/routes/admin/components/courses/content/QuizEditor.tsx

import { ListChecks, Plus } from "lucide-react";

export function QuizEditor() {
  return (
    <div>
      <h3 className="text-base font-semibold text-slate-900">Quiz Builder</h3>

      <p className="mt-1 text-xs text-slate-500">
        Create questions and test your students.
      </p>

      <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <ListChecks className="mx-auto h-8 w-8 text-violet-500" />

        <p className="mt-3 text-sm font-semibold text-slate-700">
          No questions yet
        </p>

        <button
          type="button"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
        >
          <Plus className="h-4 w-4" />
          Add Question
        </button>
      </div>
    </div>
  );
}
