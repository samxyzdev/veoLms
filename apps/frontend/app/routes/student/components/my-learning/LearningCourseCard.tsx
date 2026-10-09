import { ArrowRight, Clock3, MoreVertical, PlayCircle } from "lucide-react";
import { Link } from "react-router";

import { CourseThumbnail, getCourseArtKey } from "../CourseThumbnail";

import { getInitials } from "~/lib/format";

export interface LearningCourse {
  id: string;

  title: string;
  description: string;

  instructor: string;

  lessons: number;
  completedLessons: number;

  duration: string;
  level: string;
  category: string;

  progress: number;

  status: "in-progress" | "completed" | "not-started";

  thumbnail: string;

  nextLesson: string;
}

interface LearningCourseCardProps {
  course: LearningCourse;
}

export function LearningCourseCard({ course }: LearningCourseCardProps) {
  const isCompleted = course.status === "completed";

  const isNotStarted = course.status === "not-started";

  const thumbnailKey = getCourseArtKey(`${course.thumbnail} ${course.title}`);

  const initials = getInitials(course.instructor);

  const progress = Math.min(100, Math.max(0, Number(course.progress) || 0));
  const coursePath = `/dashboard/my-learning/${course.id}`;

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm transition duration-200 hover:border-indigo-100 hover:shadow-md sm:p-3">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        {/* ================================================================ */}
        {/* Thumbnail                                                         */}
        {/* ================================================================ */}

        <Link to={coursePath} aria-label={`Open ${course.title}`} className="block w-full shrink-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:w-[195px]">
          <CourseThumbnail artKey={thumbnailKey} title={course.title} className="h-[120px] w-full rounded-xl sm:h-[86px] sm:w-[195px]">
            <span
              className={`absolute right-2 top-2 rounded-lg px-2 py-1 text-[9px] font-bold shadow-sm backdrop-blur-sm ${
                isCompleted ? "bg-emerald-50 text-emerald-600" : isNotStarted ? "bg-white text-slate-700" : "bg-white text-indigo-600"
              }`}
            >
              {isCompleted ? "Completed" : isNotStarted ? "Not Started" : "In Progress"}
            </span>
          </CourseThumbnail>
        </Link>

        {/* ================================================================ */}
        {/* Course Information                                                */}
        {/* ================================================================ */}

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-extrabold tracking-tight text-slate-950">{course.title}</h3>

          <p className="mt-1 line-clamp-1 text-xs text-slate-500">{course.description}</p>

          {/* Meta */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            {/* Instructor */}
            <div className="flex items-center gap-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[7px] font-bold text-slate-600">{initials}</div>

              <span className="text-[10px] font-medium text-slate-600">{course.instructor}</span>
            </div>

            {/* Lessons */}
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <PlayCircle size={12} />

              {course.lessons > 0 ? `${course.lessons} lessons` : "Lessons unavailable"}
            </div>

            {/* Duration */}
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <Clock3 size={12} />

              {course.duration}
            </div>

            {/* Level */}
            <span className="rounded-lg bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-600">{course.level}</span>
          </div>
        </div>

        {/* ================================================================ */}
        {/* Progress                                                          */}
        {/* ================================================================ */}

        <div className="w-full shrink-0 lg:w-[275px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-700">
              {course.completedLessons > 0 && course.lessons > 0 ? `${course.completedLessons} of ${course.lessons} lessons` : "Progress"}
            </span>

            <span className="text-xs font-bold text-slate-700">{progress}%</span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all ${isCompleted ? "bg-emerald-500" : "bg-indigo-500"}`}
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <p className="mt-2 truncate text-[10px] text-slate-400">
            {isCompleted ? `Last lesson: ${course.nextLesson}` : isNotStarted ? `Ready to start: ${course.nextLesson}` : `Continue: ${course.nextLesson}`}
          </p>
        </div>

        {/* ================================================================ */}
        {/* Actions                                                           */}
        {/* ================================================================ */}

        <div className="flex shrink-0 items-center justify-between gap-2 lg:ml-1">
          <Link
            to={coursePath}
            className={`flex h-10 items-center gap-1.5 rounded-xl px-4 text-xs font-bold transition ${
              isCompleted ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : isNotStarted ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100" : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {isCompleted ? "Review" : isNotStarted ? "Start" : "Continue"}

            <ArrowRight size={14} />
          </Link>

          <button type="button" aria-label="More options" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-50 hover:text-slate-700">
            <MoreVertical size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}
