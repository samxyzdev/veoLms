// app/routes/admin/components/courses/review/PricingAccessReview.tsx

import { Check, Globe, IndianRupee, Users } from "lucide-react";

import ReviewCard from "./ReviewCard";
import type { CourseReviewData } from "./types";

export default function PricingAccessReview({
  course,
  onEdit,
}: {
  course: CourseReviewData;
  onEdit?: () => void;
}) {
  return (
    <ReviewCard
      title="Pricing & Access"
      icon={<IndianRupee className="h-4 w-4" />}
      onEdit={onEdit}
    >
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
        <div>
          <p className="text-xs text-slate-400">Price</p>

          <p className="mt-1 text-sm font-bold text-slate-900">
            ₹{course.price}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">Compare Price</p>

          <p className="mt-1 text-sm font-semibold text-slate-700">
            ₹{course.comparePrice}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">Access Type</p>

          <div className="mt-1 flex items-center gap-1.5">
            <Globe className="h-4 w-4 text-violet-600" />

            <p className="text-sm font-semibold text-slate-700">
              {course.accessType}
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs text-slate-400">Max Enrollments</p>

          <div className="mt-1 flex items-center gap-1.5">
            <Users className="h-4 w-4 text-violet-600" />

            <p className="text-sm font-semibold text-slate-700">
              {course.maxEnrollments}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-400">Enrollment Period</p>

        <p className="mt-1 text-sm font-medium text-slate-700">
          {course.enrollmentPeriod}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {course.certificate && <StatusPill label="Certificate Enabled" />}

        {course.discussions && <StatusPill label="Discussions Enabled" />}

        {course.marketplace && <StatusPill label="Visible in Marketplace" />}

        {!course.featured && (
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">
            Not Featured
          </span>
        )}
      </div>
    </ReviewCard>
  );
}

function StatusPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
      <Check className="h-3 w-3" />
      {label}
    </span>
  );
}
