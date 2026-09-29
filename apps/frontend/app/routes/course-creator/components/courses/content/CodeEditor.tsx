// app/routes/admin/components/courses/content/CodeEditor.tsx

import { Code2, Copy } from "lucide-react";

export function CodeEditor() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Code Example
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Add code that students can read and practice.
          </p>
        </div>

        <Code2 className="h-5 w-5 text-violet-500" />
      </div>

      <div className="mt-5 overflow-hidden rounded-xl bg-slate-950">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <span className="text-xs text-slate-400">javascript</span>

          <Copy className="h-4 w-4 text-slate-500" />
        </div>

        <textarea
          rows={12}
          defaultValue={`function App() {
  return (
    <div>
      <h1>Hello React</h1>
    </div>
  );
}`}
          className="w-full resize-none bg-transparent p-4 font-mono text-sm leading-6 text-emerald-300 outline-none"
        />
      </div>
    </div>
  );
}
