// app/routes/admin/components/courses/content/ContentTypeSelector.tsx

import { FileDown, FileText, Video } from "lucide-react";

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
    id: "resource" as LessonType,
    label: "File / Download",
    icon: FileDown,
  },
];

export function ContentTypeSelector({
  value,
  onChange,
  disabled = false,
}: {
  value: LessonType;
  onChange: (value: LessonType) => void;
  disabled?: boolean;
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
              disabled={disabled}
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
