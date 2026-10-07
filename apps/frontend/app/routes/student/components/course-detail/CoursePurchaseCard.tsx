import { Check, ShoppingCart } from "lucide-react";

import type { CourseDetail } from "../../explore-courses/$courseId/route";

type Props = {
  course: CourseDetail;
  isPurchased: boolean;
};

function formatPrice(price: number | null) {
  if (!price || price === 0) {
    return "Free";
  }

  return `₹${price.toLocaleString("en-IN")}`;
}

export function CoursePurchaseCard({ course, isPurchased }: Props) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
      <p className="text-3xl font-extrabold text-slate-950">{formatPrice(course.price)}</p>

      {isPurchased ? (
        <button type="button" className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white transition hover:bg-indigo-700">
          Continue Learning
        </button>
      ) : (
        <>
          <button type="button" className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white transition hover:bg-indigo-700">
            <ShoppingCart size={17} />
            Buy Course
          </button>

          <button type="button" className="mt-3 h-12 w-full rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Add to Cart
          </button>
        </>
      )}

      <div className="mt-6 space-y-3">
        {["Lifetime access", "Access on all devices", "Course updates", "Learning progress tracking"].map((item) => (
          <div key={item} className="flex items-center gap-2 text-xs text-slate-600">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50">
              <Check size={12} className="text-emerald-600" />
            </div>

            {item}
          </div>
        ))}
      </div>
    </aside>
  );
}
