import { Check, ShoppingCart } from "lucide-react";
import { Link } from "react-router";

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
    <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] xl:sticky xl:top-24">
      <div className="flex items-end justify-between gap-2">
        <p className="text-[29px] font-extrabold leading-none tracking-tight text-slate-950">{formatPrice(course.price)}</p>
        <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700">Course access</span>
      </div>

      {isPurchased ? (
        <Link to={`/dashboard/my-learning/${course.id}`} className="mt-5 flex h-11 w-full items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white transition hover:bg-indigo-700">
          Continue Learning
        </Link>
      ) : (
        <>
          <button type="button" className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 text-xs font-bold text-white transition hover:bg-indigo-700">
            <ShoppingCart size={17} />
            {course.price ? "Buy Course" : "Enroll for Free"}
          </button>

          <button type="button" className="mt-2.5 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-indigo-500 bg-white text-xs font-bold text-slate-800 transition hover:bg-indigo-50">
            <ShoppingCart size={15} />
            Add to Cart
          </button>
        </>
      )}

      <div className="mt-5 space-y-2.5">
        {["Lifetime access", "Access on all devices", "Course updates", "Learning progress tracking"].map((item) => (
          <div key={item} className="flex items-center gap-2.5 text-[11px] text-slate-800">
            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <Check size={11} strokeWidth={3} className="text-emerald-700" />
            </div>

            {item}
          </div>
        ))}
      </div>
    </aside>
  );
}
