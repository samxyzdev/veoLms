// app/routes/admin/components/courses/pricing/PricingAccess.tsx

import { useState } from "react";

import { initialCoupons } from "../../../data/coursePricingData";

import PricingInformation from "./PricingInformation";
import AccessType from "./AccessType";
import EnrollmentSettings from "./EnrollmentSettings";
import CourseAvailability from "./CourseAvailability";
import AdditionalSettings from "./AdditionalSettings";
import CouponCodes from "./CouponCodes";
import CouponModal from "./CouponModal";
import PricingSummary from "./PricingSummary";

import type { AccessType as AccessTypeValue, Coupon } from "./types";

type PricingAccessProps = {
  onPrevious?: () => void;
  onNext?: () => void;
  onSaveDraft?: () => void;
};

export default function PricingAccess({
  onPrevious,
  onNext,
  onSaveDraft,
}: PricingAccessProps) {
  const [price, setPrice] = useState("999");

  const [comparePrice, setComparePrice] = useState("1499");

  const [accessType, setAccessType] = useState<AccessTypeValue>("public");

  const [limitEnrollments, setLimitEnrollments] = useState(true);

  const [maxEnrollments, setMaxEnrollments] = useState("500");

  const [waitlist, setWaitlist] = useState(false);

  const [setEnrollmentPeriod, setSetEnrollmentPeriod] = useState(true);

  const [enrollmentStartDate, setEnrollmentStartDate] = useState("2026-04-15");

  const [enrollmentEndDate, setEnrollmentEndDate] = useState("");

  const [allowCertificate, setAllowCertificate] = useState(true);

  const [allowDiscussions, setAllowDiscussions] = useState(true);

  const [showInMarketplace, setShowInMarketplace] = useState(true);

  const [featuredCourse, setFeaturedCourse] = useState(false);

  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  const [showCouponModal, setShowCouponModal] = useState(false);

  function addCoupon(coupon: Coupon) {
    setCoupons((current) => [coupon, ...current]);

    setShowCouponModal(false);
  }

  function deleteCoupon(id: number) {
    const confirmed = window.confirm("Delete this coupon?");

    if (!confirmed) return;

    setCoupons((current) => current.filter((coupon) => coupon.id !== id));
  }

  function duplicateCoupon(coupon: Coupon) {
    const duplicated: Coupon = {
      ...coupon,
      id: Date.now(),
      code: `${coupon.code}_COPY`,
      used: 0,
      status: "active",
    };

    setCoupons((current) => [duplicated, ...current]);
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-2xl font-bold tracking-tight text-[#101537]">
          Pricing & Access
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Configure your course price, access type, enrollment limits,
          availability and discount coupons.
        </p>
      </div>

      {/* Pricing + Access */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(340px,1fr)]">
        <PricingInformation
          price={price}
          comparePrice={comparePrice}
          onPriceChange={setPrice}
          onComparePriceChange={setComparePrice}
        />

        <AccessType value={accessType} onChange={setAccessType} />
      </div>

      {/* Enrollment + Availability + Additional */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        <EnrollmentSettings
          limitEnrollments={limitEnrollments}
          maxEnrollments={maxEnrollments}
          waitlist={waitlist}
          onLimitChange={setLimitEnrollments}
          onMaxEnrollmentsChange={setMaxEnrollments}
          onWaitlistChange={setWaitlist}
        />

        <CourseAvailability
          enabled={setEnrollmentPeriod}
          startDate={enrollmentStartDate}
          endDate={enrollmentEndDate}
          onEnabledChange={setSetEnrollmentPeriod}
          onStartDateChange={setEnrollmentStartDate}
          onEndDateChange={setEnrollmentEndDate}
        />

        <AdditionalSettings
          allowCertificate={allowCertificate}
          allowDiscussions={allowDiscussions}
          showInMarketplace={showInMarketplace}
          featuredCourse={featuredCourse}
          onCertificateChange={setAllowCertificate}
          onDiscussionsChange={setAllowDiscussions}
          onMarketplaceChange={setShowInMarketplace}
          onFeaturedChange={setFeaturedCourse}
        />
      </div>

      {/* Coupons */}
      <CouponCodes
        coupons={coupons}
        onGenerate={() => setShowCouponModal(true)}
        onDelete={deleteCoupon}
        onDuplicate={duplicateCoupon}
      />

      {/* Summary */}
      <PricingSummary
        price={price}
        comparePrice={comparePrice}
        accessType={accessType}
        limitEnrollments={limitEnrollments}
        maxEnrollments={maxEnrollments}
        allowCertificate={allowCertificate}
        allowDiscussions={allowDiscussions}
      />

      {/* Navigation */}
      {/* <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-5">
        <button
          type="button"
          onClick={onPrevious}
          className="h-10 rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          Previous
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSaveDraft}
            className="h-10 rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={onNext}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-6 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            Next
            <span>→</span>
          </button>
        </div>
      </div> */}

      {/* Coupon Modal */}
      {showCouponModal && (
        <CouponModal
          onClose={() => setShowCouponModal(false)}
          onCreate={addCoupon}
        />
      )}
    </div>
  );
}
