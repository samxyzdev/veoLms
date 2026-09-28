import { ArrowLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router";

type CoursePlayerHeaderProps = {
  courseTitle: string;
  lessonTitle: string;
};

export function CoursePlayerHeader({
  courseTitle,
  lessonTitle,
}: CoursePlayerHeaderProps) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <Link
        to="/dashboard/my-learning"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
        aria-label="Back to My Learning"
      >
        <ArrowLeft className="h-4 w-4" />
      </Link>

      <div className="flex min-w-0 items-center gap-2 text-sm">
        <Link
          to="/dashboard/my-learning"
          className="shrink-0 text-slate-500 transition hover:text-slate-900"
        >
          My Learning
        </Link>

        <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />

        <span className="max-w-50 truncate text-slate-500 sm:max-w-75">
          {courseTitle}
        </span>

        <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />

        <span className="max-w-50 truncate font-medium text-slate-900 sm:max-w-75">
          {lessonTitle}
        </span>
      </div>
    </div>
  );
}
