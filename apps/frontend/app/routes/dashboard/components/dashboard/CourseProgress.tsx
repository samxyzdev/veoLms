import { ArrowRight, CheckCircle2, CirclePlay } from "lucide-react";
import { Link } from "react-router";

type CourseProgressItem = {
  id: string;
  title: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  isCompleted: boolean;
};

type CourseProgressProps = {
  courses: CourseProgressItem[];
};

export function CourseProgress({ courses }: CourseProgressProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Your courses
          </p>

          <h2 className="mt-1 text-lg font-extrabold text-slate-950">
            Course Progress
          </h2>
        </div>

        <Link
          to="/dashboard/my-learning"
          className="flex items-center gap-1 text-xs font-bold text-indigo-600"
        >
          View all
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="space-y-4">
        {courses.map((course) => {
          const progress = Number(course.progress) || 0;

          return (
            <div key={course.id} className="flex items-center gap-3">
              {/* Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                {course.isCompleted ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <CirclePlay size={18} />
                )}
              </div>

              {/* Course information */}
              <div className="min-w-0 flex-[0.8]">
                <p className="truncate text-xs font-bold text-slate-900">
                  {course.title}
                </p>

                <p className="mt-1 text-[10px] text-slate-400">
                  {course.completedLessons} / {course.totalLessons} lessons
                </p>
              </div>

              {/* Progress bar */}
              <div className="hidden flex-1 items-center gap-3 sm:flex">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${
                      course.isCompleted ? "bg-emerald-500" : "bg-indigo-500"
                    }`}
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <span className="w-8 text-right text-[11px] font-bold text-slate-600">
                  {progress}%
                </span>
              </div>

              {/* Mobile percentage */}
              <div className="sm:hidden">
                <span className="text-[11px] font-bold text-slate-600">
                  {progress}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
