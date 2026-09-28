import { ArrowLeft, ArrowRight } from "lucide-react";

type LessonNavigationProps = {
  previousLesson?: {
    id: string;
    title: string;
  };
  nextLesson?: {
    id: string;
    title: string;
  };
};

export function LessonNavigation({
  previousLesson,
  nextLesson,
}: LessonNavigationProps) {
  return (
    <div className="mt-5 flex items-center justify-between gap-4">
      <button
        type="button"
        disabled={!previousLesson}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Previous Lesson</span>
        <span className="sm:hidden">Previous</span>
      </button>

      <button
        type="button"
        disabled={!nextLesson}
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span className="hidden sm:inline">Next Lesson</span>
        <span className="sm:hidden">Next</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
