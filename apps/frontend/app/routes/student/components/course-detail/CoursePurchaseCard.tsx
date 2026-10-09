import { CheckCircle2, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

import type { CourseDetail } from "../../explore-courses/$courseId/route";
import { useCart } from "../cart/CartContext";

type Props = {
  course: CourseDetail;
  isPurchased: boolean;
};

function formatPrice(price: number | null) {
  if (price == null || price === 0) {
    return "Free";
  }

  return `₹${(price / 100).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

export function CoursePurchaseCard({ course, isPurchased }: Props) {
  const price = formatPrice(course.price);
  const { addToCart, hasCourse } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);

  async function handleAddToCart() {
    setIsAdding(true);
    setCartError(null);
    try {
      await addToCart(course.id);
    } catch {
      setCartError("Could not add this course. Please try again.");
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <aside className="self-start rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
      {/* Price */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">{price}</h2>

        <span className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[9px] font-bold text-emerald-600">Course access</span>
      </div>

      {/* Primary */}
      {isPurchased ? (
        <Link
          to={`/dashboard/my-learning/${course.id}`}
          className="mt-4 flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white transition hover:bg-indigo-700"
        >
          Continue Learning
        </Link>
      ) : (
        <button type="button" className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white transition hover:bg-indigo-700">
          {course.price == null || course.price === 0 ? "Enroll for Free" : "Buy Course"}
        </button>
      )}

      {/* Cart */}
      {!isPurchased && !hasCourse(course.id) && (
        <button
          type="button"
          onClick={() => void handleAddToCart()}
          disabled={isAdding}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-500 bg-white px-4 py-3 text-xs font-bold text-slate-800 transition hover:bg-indigo-50 disabled:cursor-wait disabled:opacity-60"
        >
          <ShoppingCart size={14} />
          {isAdding ? "Adding to Cart…" : "Add to Cart"}
        </button>
      )}

      {!isPurchased && hasCourse(course.id) && (
        <Link to="/dashboard/cart" className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-500 bg-white px-4 py-3 text-xs font-bold text-indigo-700 transition hover:bg-indigo-50">
          <ShoppingCart size={14} />
          View in Cart
        </Link>
      )}

      {cartError && <p role="alert" className="mt-2 text-[11px] text-rose-600">{cartError}</p>}

      {/* Features */}
      <div className="mt-5 space-y-3">
        {["Lifetime access", "Access on all devices", "Course updates", "Learning progress tracking"].map((item) => (
          <div key={item} className="flex items-center gap-2 text-[11px] text-slate-700">
            <CheckCircle2 size={15} className="shrink-0 text-emerald-500" fill="currentColor" strokeWidth={1.5} />

            {item}
          </div>
        ))}
      </div>

      {!isPurchased && <div className="mt-5 rounded-xl bg-pink-50 px-3 py-3 text-[10px] leading-4 text-pink-700">Course access and enrollment details will be available after enrollment.</div>}
    </aside>
  );
}
