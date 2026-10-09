import { ChevronRight } from "lucide-react";
import { Link } from "react-router";

type CoursePlayerHeaderProps = {
  categoryName: string;
  courseTitle: string;
  lessonTitle: string;
};

export function CoursePlayerHeader({ categoryName, courseTitle, lessonTitle }: CoursePlayerHeaderProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex min-w-0 items-center gap-2 overflow-hidden text-[11px] sm:text-xs">
      <Link to="/dashboard/my-learning" className="shrink-0 text-slate-500 transition hover:text-indigo-600">My Learning</Link>
      <ChevronRight size={14} className="shrink-0 text-slate-300" />
      <Link to="/dashboard/explore-courses" className="hidden max-w-36 shrink-0 truncate text-slate-500 transition hover:text-indigo-600 sm:block">{categoryName}</Link>
      <ChevronRight size={14} className="hidden shrink-0 text-slate-300 sm:block" />
      <span className="hidden max-w-48 shrink-0 truncate text-slate-500 md:block">{courseTitle}</span>
      <ChevronRight size={14} className="hidden shrink-0 text-slate-300 md:block" />
      <span className="min-w-0 truncate font-semibold text-slate-900">{lessonTitle}</span>
    </nav>
  );
}
