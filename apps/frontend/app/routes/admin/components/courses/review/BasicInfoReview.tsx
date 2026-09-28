// app/routes/admin/components/courses/review/BasicInfoReview.tsx

import { FileText } from "lucide-react";

import ReviewCard from "./ReviewCard";
import type { CourseReviewData } from "./types";

export default function BasicInfoReview({
  course,
  onEdit,
}: {
  course: CourseReviewData;
  onEdit?: () => void;
}) {
  return (
    <ReviewCard
      title="Basic Information"
      icon={<FileText className="h-4 w-4" />}
      onEdit={onEdit}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-[160px_minmax(0,1fr)]">
        {/* Thumbnail */}
        <img
          src={course.thumbnail}
          alt={course.title}
          className="h-28 w-full rounded-xl object-cover md:h-24"
        />

        {/* Information */}
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-slate-400">Course Title</p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {course.title}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium text-slate-400">Category</p>

              <p className="mt-1 text-sm text-slate-700">{course.category}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">Level</p>

              <p className="mt-1 text-sm text-slate-700">{course.level}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">Language</p>

              <p className="mt-1 text-sm text-slate-700">{course.language}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-400">
              Short Description
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              {course.description}
            </p>
          </div>
        </div>
      </div>
    </ReviewCard>
  );
}
