import { CalendarDays, Globe2, Layers3, UsersRound } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";

import type { CourseDetail } from "../../explore-courses/$courseId/route";
import { formatCourseLevel } from "~/lib/course";

type Props = {
  course: CourseDetail;
  lessonCount: number;
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(date);
}

export function AboutThisCourse({ course, lessonCount }: Props) {
  const [expanded, setExpanded] = useState(false);
  const description = course.description?.trim() || "No course description has been added yet.";
  const canExpand = description.length > 220;

  return (
    <section id="overview" className="scroll-mt-16 rounded-xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.03)] sm:p-6">
      <h2 className="text-lg font-extrabold tracking-tight text-slate-950">About This Course</h2>
      <p className={`mt-3 text-xs leading-5 text-slate-700 ${expanded ? "" : "line-clamp-4"}`}>{description}</p>
      {canExpand && (
        <button type="button" onClick={() => setExpanded((value) => !value)} className="mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-700">
          {expanded ? "Read less" : "Read more"}
        </button>
      )}

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <CourseFact icon={<Layers3 size={16} />} label="Level" value={formatCourseLevel(course.level)} />
        <CourseFact icon={<Globe2 size={16} />} label="Language" value={course.courseLanguage || "Not specified"} />
        <CourseFact icon={<UsersRound size={16} />} label="Lessons" value={String(lessonCount)} />
        <CourseFact icon={<CalendarDays size={16} />} label="Last updated" value={formatDate(course.updatedAt)} />
      </div>
    </section>
  );
}

function CourseFact({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-600">{icon}</span>
      <span className="min-w-0">
        <span className="block text-[9px] text-slate-500">{label}</span>
        <span className="block truncate text-[11px] font-bold text-slate-900">{value}</span>
      </span>
    </div>
  );
}
