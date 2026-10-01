import { CheckCircle2, Circle, PlayCircle } from "lucide-react";

type CourseLessonItemProps = {
  lesson: {
    id: string;
    number: string;
    title: string;
    duration: string;
    isCompleted: boolean;
    isCurrent?: boolean;
    isLocked?: boolean;
  };
};

export function CourseLessonItem({ lesson }: CourseLessonItemProps) {
  const isCurrent = lesson.isCurrent;

  return (
    <button
      type="button"
      disabled={lesson.isLocked}
      className={`group flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${
        isCurrent ? "bg-indigo-50/80" : "hover:bg-slate-50"
      } disabled:cursor-not-allowed disabled:opacity-50`}
    >
      <div className="shrink-0">
        {lesson.isCompleted ? (
          <CheckCircle2 className="h-5 w-5 text-indigo-600" />
        ) : isCurrent ? (
          <PlayCircle className="h-5 w-5 text-indigo-600" />
        ) : (
          <Circle className="h-5 w-5 text-slate-300" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-xs font-medium text-slate-400">
            {lesson.number}
          </span>

          <span
            className={`truncate text-sm ${
              isCurrent ? "font-semibold text-indigo-600" : "text-slate-600"
            }`}
          >
            {lesson.title}
          </span>
        </div>
      </div>

      <span className="shrink-0 text-xs text-slate-400">{lesson.duration}</span>
    </button>
  );
}
