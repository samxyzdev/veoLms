import { BadgeIndianRupee, Info } from "lucide-react";

type PricingAccessProps = {
  price: string;
  onPriceChange: (value: string) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onSaveDraft?: () => void;
  disabled?: boolean;
};

export default function PricingAccess({ price, onPriceChange, onPrevious, onNext, onSaveDraft, disabled = false }: PricingAccessProps) {
  const numericPrice = Number(price);
  const isPriceValid = price.trim() !== "" && Number.isFinite(numericPrice) && numericPrice >= 0 && numericPrice <= 100_000;
  const isFree = numericPrice === 0 && isPriceValid;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-[#101537]">Pricing</h2>
        <p className="mt-1 text-sm text-slate-500">Set the price students will pay. Enter 0 to make the course free.</p>
      </div>

      <div className="max-w-xl rounded-2xl border border-slate-200 bg-white p-5">
        <label htmlFor="course-price" className="mb-2 block text-sm font-semibold text-slate-900">Course price (INR)</label>
        <div className="relative">
          <BadgeIndianRupee className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            id="course-price"
            type="number"
            min="0"
            step="0.01"
            max="100000"
            inputMode="decimal"
            value={price}
            onChange={(event) => onPriceChange(event.target.value)}
            disabled={disabled}
            className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:bg-slate-50"
            placeholder="0"
          />
        </div>
        {isPriceValid ? <p className="mt-2 text-sm font-medium text-violet-700">{isFree ? "Free course" : `Paid course · ₹${numericPrice.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`}</p> : <p className="mt-2 text-sm text-red-600">Enter a price from ₹0 to ₹100,000.</p>}

        <div className="mt-5 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <p>Pricing is saved with your course. Additional access, coupon, and certificate settings can be added when those options are supported by the course service.</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
        <button type="button" onClick={onPrevious} disabled={disabled} className="h-10 rounded-xl border border-slate-200 px-5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50">Back</button>
        <div className="flex gap-2">
          <button type="button" onClick={onSaveDraft} disabled={disabled} className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">Save Draft</button>
          <button type="button" onClick={onNext} disabled={disabled || !isPriceValid} className="h-10 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50">Review Course</button>
        </div>
      </div>
    </div>
  );
}
