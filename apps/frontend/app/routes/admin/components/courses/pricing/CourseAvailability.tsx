// app/routes/admin/components/courses/pricing/CourseAvailability.tsx

import { CalendarDays } from "lucide-react";

import { SectionCard, Toggle } from "./PricingUI";

export default function CourseAvailability({
  enabled,
  startDate,
  endDate,
  onEnabledChange,
  onStartDateChange,
  onEndDateChange,
}: {
  enabled: boolean;
  startDate: string;
  endDate: string;
  onEnabledChange: (value: boolean) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}) {
  return (
    <SectionCard
      title="Course Availability"
      description="Set when the course will be available for enrollment."
    >
      <div className="space-y-4">
        {/* Toggle */}
        <div className="flex items-center gap-3">
          <Toggle checked={enabled} onChange={onEnabledChange} />

          <span className="text-sm font-semibold text-slate-800">
            Set Enrollment Period
          </span>
        </div>

        {enabled && (
          <>
            {/* Start */}
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-700">
                Enrollment Start Date
              </label>

              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => onStartDateChange(event.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-violet-400"
                />
              </div>
            </div>

            {/* End */}
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-700">
                Enrollment End Date{" "}
                <span className="font-normal text-slate-400">(Optional)</span>
              </label>

              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="date"
                  value={endDate}
                  onChange={(event) => onEndDateChange(event.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-violet-400"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </SectionCard>
  );
}
