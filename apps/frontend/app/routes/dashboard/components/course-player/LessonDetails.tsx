import { BarChart3, BookOpen, CalendarDays, Check, Clock3 } from "lucide-react";

type LessonDetailsProps = {
  lesson: {
    title: string;
    description: string;
    duration: string;
    level: string;
    updatedAt: string;
  };
};

export function LessonDetails({ lesson }: LessonDetailsProps) {
  return (
    <section className="mt-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {lesson.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span>Lesson 1 of 12</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock3 className="h-4 w-4" />
              <span>{lesson.duration}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4" />
              <span>{lesson.level}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              <span>Updated {lesson.updatedAt}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
        >
          <Check className="h-4 w-4" />
          Mark as Complete
        </button>
      </div>

      <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-600">
        {lesson.description}
      </p>
    </section>
  );
}
