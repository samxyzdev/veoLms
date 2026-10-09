import { ArrowRight, ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "react-router";

import { useCart, formatCartPrice, formatCartTotal } from "~/routes/student/components/cart/CartContext";

export function HeaderCart() {
  const { items, count, subtotal, isLoading, removeFromCart } = useCart();

  return (
    <div className="group relative">
      <Link
        to="/dashboard/cart"
        aria-label={`Shopping cart${count ? `, ${count} ${count === 1 ? "item" : "items"}` : ""}`}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-indigo-500"
      >
        <ShoppingCart size={20} />
        {count > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-none text-white">{count}</span>}
      </Link>

      <div className="invisible absolute right-0 top-full z-50 w-[min(440px,calc(100vw-24px))] translate-y-2 pt-2 opacity-0 transition duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-950">Your Cart</h2>
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-600">{count} {count === 1 ? "item" : "items"}</span>
            </div>
            <Link to="/dashboard/cart" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">View Cart <ArrowRight className="ml-0.5 inline" size={13} /></Link>
          </div>

          {isLoading ? (
            <div className="px-5 py-8 text-center text-xs text-slate-500">Loading cart…</div>
          ) : items.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm font-semibold text-slate-700">Your cart is empty</p>
              <p className="mt-1 text-xs text-slate-500">Explore courses and add one to get started.</p>
            </div>
          ) : (
            <>
              <div className="max-h-[300px] divide-y divide-slate-100 overflow-y-auto px-5">
                {items.slice(0, 4).map((item) => (
                  <div key={item.courseId} className="flex items-center gap-3 py-3">
                    <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {item.thumbnailUrl ? <img src={item.thumbnailUrl} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-[10px] font-bold text-indigo-600">{item.title.slice(0, 2).toUpperCase()}</div>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-xs font-bold leading-4 text-slate-900">{item.title}</p>
                      <p className="mt-0.5 truncate text-[10px] text-slate-500">{item.creatorName || "Learnly Instructor"}</p>
                    </div>
                    <span className="shrink-0 text-sm font-extrabold text-slate-950">{formatCartPrice(item.price)}</span>
                    <button type="button" aria-label={`Remove ${item.title}`} onClick={() => void removeFromCart(item.courseId).catch(() => undefined)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
              {count > 4 && <p className="px-5 pt-2 text-xs text-slate-500">and {count - 4} more {count - 4 === 1 ? "course" : "courses"}</p>}
              <div className="border-t border-slate-100 px-5 py-4">
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-500">Subtotal</span>
                  <span className="font-extrabold text-slate-950">{formatCartTotal(subtotal)}</span>
                </div>
                <Link to="/dashboard/cart" className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white transition hover:bg-indigo-700">View Cart &amp; Checkout <ArrowRight size={15} /></Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
