// app/routes/admin/components/courses/pricing/PricingInformation.tsx

import { Info } from "lucide-react";

import { InputWithIcon, SectionCard } from "./PricingUI";

export default function PricingInformation({
  price,
  comparePrice,
  onPriceChange,
  onComparePriceChange,
}: {
  price: string;
  comparePrice: string;
  onPriceChange: (value: string) => void;
  onComparePriceChange: (value: string) => void;
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
    <SectionCard
      title="Pricing Information"
      description="Set the price for your course."
    >
      {/* Payment Model */}
      <div className="mb-5 flex items-start gap-3 rounded-xl bg-violet-50 px-4 py-3.5">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />

        <div>
          <p className="text-sm font-medium text-slate-700">
            Currently only one-time payment is supported.
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            Students pay once to get lifetime access to the course.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Price */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-900">
            Price (INR)
          </label>

          <InputWithIcon
            prefix="₹"
            type="number"
            value={price}
            onChange={onPriceChange}
            placeholder="999"
          />
        </div>

        {/* Compare Price */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-900">
            Compare Price{" "}
            <span className="font-normal text-slate-400">(Optional)</span>
          </label>

          <InputWithIcon
            prefix="₹"
            type="number"
            value={comparePrice}
            onChange={onComparePriceChange}
            placeholder="1499"
          />

          <p className="mt-1.5 text-xs text-slate-400">
            Use a higher price to show a discount.
            {discount > 0 && (
              <span className="ml-1 font-medium text-emerald-600">
                {discount}% off
              </span>
            )}
          </p>
        </div>
      </div>
    </SectionCard>
  );
}
