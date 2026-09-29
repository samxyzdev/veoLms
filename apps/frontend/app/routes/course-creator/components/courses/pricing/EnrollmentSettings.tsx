// app/routes/admin/components/courses/pricing/EnrollmentSettings.tsx

import { SectionCard, Toggle } from "./PricingUI";

export default function EnrollmentSettings({
  limitEnrollments,
  maxEnrollments,
  waitlist,
  onLimitChange,
  onMaxEnrollmentsChange,
  onWaitlistChange,
}: {
  limitEnrollments: boolean;
  maxEnrollments: string;
  waitlist: boolean;
  onLimitChange: (value: boolean) => void;
  onMaxEnrollmentsChange: (value: string) => void;
  onWaitlistChange: (value: boolean) => void;
}) {
  return (
    <SectionCard
      title="Enrollment Settings"
      description="Set limits and rules for student enrollment."
    >
      <div className="space-y-5">
        {/* Limit */}
        <div>
          <div className="flex items-center gap-3">
            <Toggle checked={limitEnrollments} onChange={onLimitChange} />

            <span className="text-sm font-semibold text-slate-800">
              Limit Enrollments
            </span>
          </div>

          {limitEnrollments && (
            <div className="mt-3 pl-14">
              <input
                type="number"
                min="1"
                value={maxEnrollments}
                onChange={(event) => onMaxEnrollmentsChange(event.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-violet-400"
                placeholder="500"
              />

              <p className="mt-1.5 text-xs text-slate-400">
                Maximum number of students allowed to enroll in this course.
              </p>
            </div>
          )}
        </div>

        {/* Waitlist */}
        <div className="flex items-center gap-3">
          <Toggle checked={waitlist} onChange={onWaitlistChange} />

          <div>
            <p className="text-sm font-semibold text-slate-800">Waitlist</p>

            <p className="mt-1 text-xs text-slate-400">
              Enable waitlist when the course is full.
            </p>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
