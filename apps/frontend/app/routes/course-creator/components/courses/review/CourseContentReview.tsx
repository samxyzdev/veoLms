// app/routes/admin/components/courses/review/CourseContentReview.tsx

import { BookOpen, Clock3, Layers3 } from "lucide-react";

import ReviewCard from "./ReviewCard";
import type { CourseReviewData } from "./types";

export default function CourseContentReview({
  course,
  onEdit,
}: {
  course: CourseReviewData;
  onEdit?: () => void;
}) {
  return (
    <ReviewCard
      title="Course Content"
      icon={<BookOpen className="h-4 w-4" />}
      onEdit={onEdit}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
            <Layers3 className="h-4 w-4" />
          </div>

          <div>
            <p className="text-lg font-bold text-slate-900">
              {course.sections}
            </p>

            <p className="text-xs text-slate-500">Sections</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
            <BookOpen className="h-4 w-4" />
          </div>

          <div>
            <p className="text-lg font-bold text-slate-900">{course.lessons}</p>

            <p className="text-xs text-slate-500">Lessons</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
            <Clock3 className="h-4 w-4" />
          </div>

          <div>
            <p className="text-lg font-bold text-slate-900">
              {course.duration}
            </p>

            <p className="text-xs text-slate-500">Total Duration</p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
        <p className="text-xs text-slate-400">Content includes</p>

        <p className="mt-1 text-sm text-slate-700">
          Videos, articles, quizzes, assignments and downloadable resources.
        </p>
      </div>
    </ReviewCard>
  );
}
