import { ArrowRight, Clock3, MoreVertical, PlayCircle } from "lucide-react";
import { CourseThumbnail, getCourseArtKey } from "../CourseThumbnail";
import { getInitials } from "~/lib/format";

export interface LearningCourse {
  id: number;
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

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm transition duration-200 hover:border-indigo-100 hover:shadow-md sm:p-3">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        {/* Thumbnail */}
        <CourseThumbnail
          artKey={thumbnailKey}
          title={course.title}
          className="h-[120px] w-full shrink-0 rounded-xl sm:h-[86px] sm:w-[195px]"
        >
          {/* Status */}
          <span
            className={`
              absolute right-2 top-2 rounded-lg px-2 py-1
              text-[9px] font-bold shadow-sm backdrop-blur-sm
              ${
                isCompleted
                  ? "bg-emerald-50 text-emerald-600"
                  : isNotStarted
                    ? "bg-white text-slate-700"
                    : "bg-white text-indigo-600"
              }
            `}
          >
            {isCompleted
              ? "Completed"
              : isNotStarted
                ? "Not Started"
                : "In Progress"}
          </span>
        </CourseThumbnail>

        {/* Course information */}
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-extrabold tracking-tight text-slate-950">
            {course.title}
          </h3>

          <p className="mt-1 line-clamp-1 text-xs text-slate-500">
            {course.description}
          </p>

          {/* Meta */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            {/* Instructor */}
            <div className="flex items-center gap-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[7px] font-bold text-slate-600">
                {initials}
              </div>

              <span className="text-[10px] font-medium text-slate-600">
                {course.instructor}
              </span>
            </div>

            {/* Lessons */}
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <PlayCircle size={12} />
              {course.lessons} lessons
            </div>

            {/* Duration */}
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <Clock3 size={12} />

              {course.duration}
            </div>

            {/* Level */}
            <span
              className={`
                rounded-lg px-2 py-1 text-[9px] font-semibold
                ${
                  course.level === "Intermediate"
                    ? "bg-indigo-50 text-indigo-600"
                    : "bg-emerald-50 text-emerald-600"
                }
              `}
            >
              {course.level}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="w-full shrink-0 lg:w-[275px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-700">
              {course.completedLessons} of {course.lessons} lessons
            </span>

            <span className="text-xs font-bold text-slate-700">
              {course.progress}%
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all ${
                isCompleted ? "bg-emerald-500" : "bg-indigo-500"
              }`}
              style={{
                width: `${course.progress}%`,
              }}
            />
          </div>

          <p className="mt-2 truncate text-[10px] text-slate-400">
            {isCompleted
              ? `Last lesson: ${course.nextLesson}`
              : isNotStarted
                ? `Ready to start: ${course.nextLesson}`
                : `Continue: ${course.nextLesson}`}
          </p>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center justify-between gap-2 lg:ml-1">
          <button
            type="button"
            className={`
              flex h-10 items-center gap-1.5 rounded-xl
              px-4 text-xs font-bold transition
              ${
                isCompleted
                  ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                  : isNotStarted
                    ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
              }
            `}
          >
            {isCompleted ? "Review" : isNotStarted ? "Start" : "Continue"}

            <ArrowRight size={14} />
          </button>

          <button
            type="button"
            aria-label="More options"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
          >
            <MoreVertical size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}
