// app/routes/admin/components/courses/pricing/CouponCodes.tsx

import { Copy, Edit3, Plus, ShoppingBag, Trash2 } from "lucide-react";

import type { Coupon } from "./types";

export default function CouponCodes({
  coupons,
  onGenerate,
  onDelete,
  onDuplicate,
}: {
  coupons: Coupon[];
  onGenerate: () => void;
  onDelete: (id: number) => void;
  onDuplicate: (coupon: Coupon) => void;
}) {
  return (
    <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-base font-bold text-[#101537]">
            Coupon Codes{" "}
            <span className="font-normal text-slate-400">(Optional)</span>
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Create and manage discount coupons for this course.
          </p>
        </div>

        <button
          type="button"
          onClick={onGenerate}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white hover:bg-violet-700"
        >
          <Plus className="h-4 w-4" />
          Generate Coupon
        </button>
      </div>

      {/* Desktop */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-[950px] w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Code
              </th>

              <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Discount
              </th>

              <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Value
              </th>

              <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Usage Limit
              </th>

              <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Valid From
              </th>

              <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Valid Until
              </th>

              <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>

              <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-slate-50/60">
                <td className="px-3 py-4 font-semibold text-slate-900">
                  {coupon.code}
                </td>

                <td className="px-3 py-4 text-sm text-slate-600">
                  {coupon.discountType === "percentage"
                    ? "Percentage"
                    : "Fixed Amount"}
                </td>

                <td className="px-3 py-4 text-sm font-medium text-slate-700">
                  {coupon.discountType === "percentage"
                    ? `${coupon.value}%`
                    : `₹ ${coupon.value}`}
                </td>

                <td className="px-3 py-4 text-sm text-slate-600">
                  {coupon.usageLimit}
                </td>

                <td className="px-3 py-4 text-sm text-slate-500">
                  {coupon.validFrom}
                </td>

                <td className="px-3 py-4 text-sm text-slate-500">
                  {coupon.validUntil}
                </td>

                <td className="px-3 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      coupon.status === "active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {coupon.status === "active" ? "Active" : "Expired"}
                  </span>
                </td>

                <td className="px-3 py-4">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-violet-600"
                      title="Edit"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDuplicate(coupon)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-violet-600"
                      title="Duplicate"
                    >
                      <Copy className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(coupon.id)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="space-y-3 lg:hidden">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className="rounded-xl border border-slate-200 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">{coupon.code}</p>

                <p className="mt-1 text-xs text-slate-500">
                  {coupon.discountType === "percentage"
                    ? `${coupon.value}% discount`
                    : `₹${coupon.value} discount`}
                </p>
              </div>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  coupon.status === "active"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {coupon.status === "active" ? "Active" : "Expired"}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-slate-400">Usage</p>

                <p className="mt-1 font-medium text-slate-700">
                  {coupon.used} / {coupon.usageLimit}
                </p>
              </div>

              <div>
                <p className="text-slate-400">Valid Until</p>

                <p className="mt-1 font-medium text-slate-700">
                  {coupon.validUntil}
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-600"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => onDuplicate(coupon)}
                className="flex-1 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-600"
              >
                Duplicate
              </button>

              <button
                type="button"
                onClick={() => onDelete(coupon.id)}
                className="rounded-lg border border-red-100 px-3 py-2 text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty */}
      {coupons.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center">
          <ShoppingBag className="mx-auto h-7 w-7 text-slate-300" />

          <p className="mt-2 text-sm font-semibold text-slate-700">
            No coupons created
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Create a coupon to offer discounts to your students.
          </p>
        </div>
      )}
    </section>
  );
}
