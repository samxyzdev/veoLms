import { CheckCircle2, ClipboardList, FileText, PlayCircle, Presentation } from "lucide-react";

import type { PlayerLesson } from "./types";
import { formatVideoTime } from "./types";

type CourseLessonItemProps = {
  lesson: PlayerLesson;
  thumbnail: string | null;
  isCurrent: boolean;
  onSelect: () => void;
};

function getLessonKind(contentType: string) {
  switch (contentType) {
    case "article":
      return { label: "Article", Icon: FileText };
    case "assignment":
      return { label: "Assignment", Icon: ClipboardList };
    case "quiz":
      return { label: "Quiz", Icon: Presentation };
    case "resource":
      return { label: "Resource", Icon: FileText };
    default:
      return { label: "Video", Icon: PlayCircle };
  }
}

export function CourseLessonItem({ lesson, thumbnail, isCurrent, onSelect }: CourseLessonItemProps) {
  const { label, Icon } = getLessonKind(lesson.contentType);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={isCurrent ? "true" : undefined}
      className={`relative flex w-full items-center gap-3 px-2.5 py-2 text-left transition sm:gap-3 ${isCurrent ? "bg-indigo-50/80" : "bg-white hover:bg-slate-50"}`}
    >
      {isCurrent && <span className="absolute inset-y-0 left-0 w-[3px] rounded-r-full bg-indigo-600" />}

      <div className="relative h-[48px] w-[86px] shrink-0 overflow-hidden rounded-md bg-gradient-to-br from-indigo-950 via-blue-900 to-slate-950 sm:h-[52px] sm:w-[94px]">
        {thumbnail && <img src={thumbnail} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" loading="lazy" />}
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/15 text-white">
          <Icon size={18} fill={lesson.contentType === "video" ? "currentColor" : "none"} />
        </div>
        {lesson.durationSeconds != null && <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[9px] font-semibold text-white">{formatVideoTime(lesson.durationSeconds)}</span>}
      </div>

      <span className="min-w-0 flex-1">
        <span className={`block truncate text-[11px] font-semibold ${isCurrent ? "text-indigo-700" : "text-slate-800"}`}>{lesson.title}</span>
        <span className="mt-1 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-1.5 py-0.5 text-[9px] text-slate-600">
            <Icon size={10} /> {label}
          </span>
        </span>
      </span>

      {lesson.isCompleted ? <CheckCircle2 size={17} className="shrink-0 fill-emerald-500 text-white" /> : isCurrent ? <span className="flex h-5 shrink-0 items-end gap-0.5" aria-label="Now playing"><i className="h-2 w-1 rounded-sm bg-indigo-600" /><i className="h-4 w-1 rounded-sm bg-indigo-600" /><i className="h-3 w-1 rounded-sm bg-indigo-600" /></span> : lesson.durationSeconds != null ? <span className="shrink-0 text-[10px] text-slate-400">{formatVideoTime(lesson.durationSeconds)}</span> : null}
    </button>
  );
}
