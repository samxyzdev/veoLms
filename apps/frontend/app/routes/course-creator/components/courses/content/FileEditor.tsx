// app/routes/admin/components/courses/content/FileEditor.tsx

import { FileDown } from "lucide-react";

export function FileEditor() {
  return (
    <div>
      <h3 className="text-base font-semibold text-slate-900">
        Upload Resource
      </h3>

      <p className="mt-1 text-xs text-slate-500">
        Upload PDFs, documents, ZIP files or other resources.
      </p>

      <label className="mt-5 flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center hover:border-violet-400">
        <input type="file" className="hidden" />

        <FileDown className="h-9 w-9 text-violet-500" />

        <p className="mt-3 text-sm font-semibold text-slate-700">
          Click to upload file
        </p>

        <p className="mt-1 text-xs text-slate-400">PDF, DOCX, ZIP and more</p>
      </label>
    </div>
  );
}
