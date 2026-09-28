// app/routes/admin/components/courses/content/ContentTypeSelector.tsx

import {
  ClipboardCheck,
  Code2,
  FileDown,
  FileText,
  ListChecks,
  Video,
} from "lucide-react";

import type { LessonType } from "./types";

export const contentTypes = [
  {
    id: "video" as LessonType,
    label: "Video",
    icon: Video,
  },
  {
    id: "article" as LessonType,
    label: "Article",
    icon: FileText,
  },
  {
    id: "quiz" as LessonType,
    label: "Quiz",
    icon: ListChecks,
  },
  {
    id: "assignment" as LessonType,
    label: "Assignment",
    icon: ClipboardCheck,
  },
  {
    id: "file" as LessonType,
    label: "File / Download",
    icon: FileDown,
  },
  {
    id: "code" as LessonType,
    label: "Code Example",
    icon: Code2,
  },
];

export function ContentTypeSelector({
  value,
  onChange,
}: {
  value: LessonType;
  onChange: (value: LessonType) => void;
}) {
  return (
    <div className="border-b border-slate-100 p-3 lg:border-b-0 lg:border-r">
      <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        Content Type
      </p>

      <div className="space-y-1">
        {contentTypes.map((item) => {
          const Icon = item.icon;
          const active = value === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium transition ${
                active
                  ? "bg-violet-50 text-violet-700"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
