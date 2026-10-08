import { BookOpen, CalendarDays, GraduationCap, Users } from "lucide-react";

import type { CourseDetail } from "../../explore-courses/$courseId/route";

type Props = {
  course: CourseDetail;
  lessonCount: number;
};

function formatLevel(level: string | null | undefined) {
  if (!level) {
    return "Not available";
  }

  return level.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(dateValue: string | null | undefined) {
  if (!dateValue) {
    return "Not available";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function AboutThisCourse({ course, lessonCount }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-extrabold text-slate-950">About This Course</h2>

      <p className="mt-4 text-sm leading-6 text-slate-600">{course.description || "Course description is not available yet."}</p>

      <div className="mt-5 grid grid-cols-2 gap-2 xl:grid-cols-4">
        {/* Lessons */}
        <div className="rounded-xl border border-slate-200 p-3">
          <BookOpen size={17} className="text-indigo-600" />

          <p className="mt-2 text-[10px] text-slate-400">Lessons</p>

          <p className="text-xs font-bold text-slate-900">{lessonCount}</p>
        </div>

        {/* Level */}
        <div className="rounded-xl border border-slate-200 p-3">
          <GraduationCap size={17} className="text-indigo-600" />

          <p className="mt-2 text-[10px] text-slate-400">Level</p>

          <p className="text-xs font-bold text-slate-900">{formatLevel(course.level)}</p>
        </div>

        {/* Students */}
        <div className="rounded-xl border border-slate-200 p-3">
          <Users size={17} className="text-indigo-600" />

          <p className="mt-2 text-[10px] text-slate-400">Students</p>

          <p className="text-xs font-bold text-slate-900">{course.studentsCount > 0 ? course.studentsCount : "No students yet"}</p>
        </div>

        {/* Updated */}
        <div className="rounded-xl border border-slate-200 p-3">
          <CalendarDays size={17} className="text-indigo-600" />

          <p className="mt-2 text-[10px] text-slate-400">Last Updated</p>

          <p className="text-xs font-bold text-slate-900">{formatDate(course.updatedAt)}</p>
        </div>
      </div>
    </section>
  );
}
