// app/routes/admin/components/courses/review/ReviewPublish.tsx

import { CheckCircle2, ChevronLeft, Send } from "lucide-react";

import { reviewCourseData } from "../../../data/reviewCourseData";

import BasicInfoReview from "./BasicInfoReview";
import CourseContentReview from "./CourseContentReview";
import PricingAccessReview from "./PricingAccessReview";
import CouponReview from "./CouponReview";
import AdditionalSettingsReview from "./AdditionalSettingsReview";
import CoursePreview from "./CoursePreview";

type ReviewPublishProps = {
  onPrevious?: () => void;
  onPublish?: () => void;
  onSaveDraft?: () => void;

  onEditBasicInfo?: () => void;
  onEditContent?: () => void;
  onEditPricing?: () => void;
  onEditCoupons?: () => void;
  onEditSettings?: () => void;
};

export default function ReviewPublish({
  onPrevious,
  onPublish,
  onSaveDraft,
  onEditBasicInfo,
  onEditContent,
  onEditPricing,
  onEditCoupons,
  onEditSettings,
}: ReviewPublishProps) {
  const course = reviewCourseData;

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#101537]">
            Review & Publish
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Review your course details, content, and settings before publishing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSaveDraft}
            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={onPublish}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
          >
            <Send className="h-4 w-4" />
            Publish Course
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.85fr)]">
        {/* Left */}
        <div className="space-y-4">
          <BasicInfoReview course={course} onEdit={onEditBasicInfo} />

          <CourseContentReview course={course} onEdit={onEditContent} />

          <PricingAccessReview course={course} onEdit={onEditPricing} />

          <CouponReview course={course} onEdit={onEditCoupons} />

          <AdditionalSettingsReview course={course} onEdit={onEditSettings} />

          {/* Ready */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

              <div>
                <p className="text-sm font-semibold text-emerald-800">
                  Your course is ready to publish
                </p>

                <p className="mt-1 text-xs leading-5 text-emerald-700">
                  All required course information has been completed. Review
                  everything once and publish your course.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="xl:sticky xl:top-5 xl:self-start">
          <CoursePreview course={course} />
        </div>
      </div>

      {/* Bottom Navigation */}
      {/* <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-5">
        <button
          type="button"
          onClick={onPrevious}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <button
          type="button"
          onClick={onPublish}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-6 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          <Send className="h-4 w-4" />
          Publish Course
        </button>
      </div> */}
    </div>
  );
}
