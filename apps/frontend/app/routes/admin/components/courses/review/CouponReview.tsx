// app/routes/admin/components/courses/review/CouponReview.tsx

import { Tag } from "lucide-react";

import ReviewCard from "./ReviewCard";
import type { CourseReviewData } from "./types";

export default function CouponReview({
  course,
  onEdit,
}: {
  course: CourseReviewData;
  onEdit?: () => void;
}) {
  return (
    <ReviewCard
      title="Coupon Codes"
      icon={<Tag className="h-4 w-4" />}
      onEdit={onEdit}
    >
      <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {course.coupons} Coupon Codes
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Discount coupons created for this course.
          </p>
        </div>

        <div className="rounded-lg bg-violet-100 px-3 py-2 text-xs font-semibold text-violet-700">
          {course.coupons} Active
        </div>
      </div>
    </ReviewCard>
  );
}
