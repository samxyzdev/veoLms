// app/routes/admin/components/courses/pricing/CouponModal.tsx

import { useState } from "react";
import { Plus, X } from "lucide-react";

import type { Coupon, DiscountType } from "./types";

export default function CouponModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (coupon: Coupon) => void;
}) {
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<DiscountType>("percentage");

  const [value, setValue] = useState("10");
  const [usageLimit, setUsageLimit] = useState("100");

  const [validFrom, setValidFrom] = useState("");

  const [validUntil, setValidUntil] = useState("");

  function generateRandomCode() {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();

    setCode(`LEARNLY${random}`);
  }

  function handleCreate() {
    if (!code.trim()) {
      alert("Please enter a coupon code.");
      return;
    }

    const numericValue = Number(value);
    const numericLimit = Number(usageLimit);

    if (!numericValue || numericValue <= 0) {
      alert("Please enter a valid discount.");
      return;
    }

    if (!numericLimit || numericLimit <= 0) {
      alert("Please enter a valid usage limit.");
      return;
    }

    const coupon: Coupon = {
      id: Date.now(),
      code: code.trim().toUpperCase(),
      discountType,
      value: numericValue,
      usageLimit: numericLimit,
      used: 0,
      validFrom: validFrom || "2026-09-27",
      validUntil: validUntil || "2026-10-27",
      status: "active",
    };

    onCreate(coupon);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="text-lg font-bold text-[#101537]">
              Generate Coupon
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Create a discount coupon for this course.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 p-5">
          {/* Code */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-900">
              Coupon Code
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={(event) => setCode(event.target.value.toUpperCase())}
                placeholder="WELCOME50"
                className="h-11 flex-1 rounded-xl border border-slate-200 px-3.5 text-sm font-medium uppercase outline-none focus:border-violet-400"
              />

              <button
                type="button"
                onClick={generateRandomCode}
                className="h-11 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Generate
              </button>
            </div>
          </div>

          {/* Discount */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">
                Discount Type
              </label>

              <select
                value={discountType}
                onChange={(event) =>
                  setDiscountType(event.target.value as DiscountType)
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-violet-400"
              >
                <option value="percentage">Percentage</option>

                <option value="fixed">Fixed Amount</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">
                {discountType === "percentage"
                  ? "Discount (%)"
                  : "Discount Amount (₹)"}
              </label>

              <input
                type="number"
                min="1"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400"
              />
            </div>
          </div>

          {/* Usage */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-900">
              Usage Limit
            </label>

            <input
              type="number"
              min="1"
              value={usageLimit}
              onChange={(event) => setUsageLimit(event.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">
                Valid From
              </label>

              <input
                type="date"
                value={validFrom}
                onChange={(event) => setValidFrom(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">
                Valid Until
              </label>

              <input
                type="date"
                value={validUntil}
                onChange={(event) => setValidUntil(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white hover:bg-violet-700"
          >
            <Plus className="h-4 w-4" />
            Create Coupon
          </button>
        </div>
      </div>
    </div>
  );
}
