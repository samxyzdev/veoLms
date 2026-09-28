// app/routes/admin/components/courses/pricing/PricingSummary.tsx

import { Check, Globe, Info, Users } from "lucide-react";

import type { AccessType } from "./types";

export default function PricingSummary({
  price,
  comparePrice,
  accessType,
  limitEnrollments,
  maxEnrollments,
  allowCertificate,
  allowDiscussions,
}: {
  price: string;
  comparePrice: string;
  accessType: AccessType;
  limitEnrollments: boolean;
  maxEnrollments: string;
  allowCertificate: boolean;
  allowDiscussions: boolean;
}) {
  const numericPrice = Number(price) || 0;
  const numericComparePrice = Number(comparePrice) || 0;

  const discount =
    numericComparePrice > numericPrice
      ? Math.round(
          ((numericComparePrice - numericPrice) / numericComparePrice) * 100,
        )
      : 0;

  return (
    <section className="mt-5 overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 to-indigo-50">
      <div className="border-b border-violet-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white">
            <Info className="h-4 w-4" />
          </div>

          <div>
            <h3 className="text-base font-bold text-[#101537]">
              Course Pricing Summary
            </h3>

            <p className="text-sm text-slate-500">
              Review your pricing and access settings.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 divide-x divide-y divide-violet-100 md:grid-cols-4 md:divide-y-0">
        {/* Price */}
        <div className="p-4">
          <p className="text-xs text-slate-500">Price</p>

          <p className="mt-1 text-xl font-bold text-slate-900">
            ₹{numericPrice}
          </p>

          {discount > 0 && (
            <p className="mt-1 text-xs text-emerald-600">
              {discount}% discount
            </p>
          )}
        </div>

        {/* Access */}
        <div className="p-4">
          <p className="text-xs text-slate-500">Access Type</p>

          <div className="mt-1 flex items-center gap-2">
            <Globe className="h-4 w-4 text-violet-600" />

            <p className="text-sm font-semibold capitalize text-slate-900">
              {accessType}
            </p>
          </div>
        </div>

        {/* Enrollments */}
        <div className="p-4">
          <p className="text-xs text-slate-500">Max Enrollments</p>

          <div className="mt-1 flex items-center gap-2">
            <Users className="h-4 w-4 text-violet-600" />

            <p className="text-sm font-semibold text-slate-900">
              {limitEnrollments ? maxEnrollments : "Unlimited"}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="p-4">
          <p className="text-xs text-slate-500">Features</p>

          <div className="mt-1 flex flex-wrap gap-1.5">
            {allowCertificate && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[11px] font-medium text-emerald-700">
                <Check className="h-3 w-3" />
                Certificate
              </span>
            )}

            {allowDiscussions && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[11px] font-medium text-violet-700">
                <Check className="h-3 w-3" />
                Discussions
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
