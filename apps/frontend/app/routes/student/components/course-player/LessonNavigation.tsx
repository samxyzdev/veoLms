import { ArrowLeft, ArrowRight } from "lucide-react";

type LessonNavigationProps = {
  previousLesson?: { title: string };
  nextLesson?: { title: string };
  onPrevious: () => void;
  onNext: () => void;
};

export function LessonNavigation({ previousLesson, nextLesson, onPrevious, onNext }: LessonNavigationProps) {
  return (
    <nav aria-label="Lesson navigation" className="mt-4 flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
      <button type="button" onClick={onPrevious} disabled={!previousLesson} className="inline-flex min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4">
        <ArrowLeft size={15} className="shrink-0" />
        <span className="min-w-0"><span className="block text-[9px] font-medium text-slate-400">Previous lesson</span><span className="hidden max-w-40 truncate sm:block">{previousLesson?.title ?? "Start of course"}</span><span className="sm:hidden">Previous</span></span>
      </button>
      <button type="button" onClick={onNext} disabled={!nextLesson} className="inline-flex min-w-0 items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-left text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4">
        <span className="min-w-0"><span className="block text-[9px] font-medium text-white/70">Next lesson</span><span className="hidden max-w-40 truncate sm:block">{nextLesson?.title ?? "Course complete"}</span><span className="sm:hidden">Next</span></span>
        <ArrowRight size={15} className="shrink-0" />
      </button>
    </nav>
  );
}
