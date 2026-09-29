// app/routes/admin/components/courses/review/AdditionalSettingsReview.tsx

import { Check, Settings2 } from "lucide-react";

import ReviewCard from "./ReviewCard";
import type { CourseReviewData } from "./types";

export default function AdditionalSettingsReview({
  course,
  onEdit,
}: {
  course: CourseReviewData;
  onEdit?: () => void;
}) {
  return (
    <ReviewCard
      title="Additional Settings"
      icon={<Settings2 className="h-4 w-4" />}
      onEdit={onEdit}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Setting label="Certificate" enabled={course.certificate} />

        <Setting label="Discussions" enabled={course.discussions} />

        <Setting label="Marketplace Visibility" enabled={course.marketplace} />

        <Setting label="Featured Course" enabled={course.featured} />
      </div>
    </ReviewCard>
  );
}

function Setting({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
      <span className="text-sm font-medium text-slate-700">{label}</span>

      {enabled ? (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
          <Check className="h-3.5 w-3.5" />
          Enabled
        </span>
      ) : (
        <span className="text-xs font-medium text-slate-400">Disabled</span>
      )}
    </div>
  );
}
