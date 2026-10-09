import { ArrowRight, BookOpen, ChevronRight, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

import { useCart, formatCartPrice, formatCartTotal } from "../components/cart/CartContext";

export default function CartPage() {
  const { items, count, subtotal, isLoading, error, refreshCart, clearCart, removeFromCart } = useCart();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    setSelectedIds(items.map((item) => item.courseId));
  }, [items]);

  const selectedItems = useMemo(() => items.filter((item) => selectedIds.includes(item.courseId)), [items, selectedIds]);
  const selectedSubtotal = selectedItems.reduce((total, item) => total + (item.price ?? 0), 0);
  const allSelected = items.length > 0 && selectedIds.length === items.length;
  const checkoutUrl = `/dashboard/checkout?courses=${selectedIds.join(",")}`;

  function toggleCourse(courseId: string) {
    setSelectedIds((current) => current.includes(courseId) ? current.filter((id) => id !== courseId) : [...current, courseId]);
  }

  function toggleAll() {
    setSelectedIds(allSelected ? [] : items.map((item) => item.courseId));
  }

  return (
    <div className="min-w-0 space-y-5">
      <nav className="flex items-center gap-2 text-xs text-slate-500" aria-label="Breadcrumb">
        <Link to="/dashboard" className="hover:text-indigo-600">Dashboard</Link>
        <ChevronRight size={14} />
        <span className="font-semibold text-slate-700">Cart</span>
      </nav>

      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">Shopping Cart</h1>
        <p className="mt-1 text-sm text-slate-500">Review your selected courses and proceed to checkout.</p>
      </header>

      {error && <div role="alert" className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700"><span>{error}</span><button type="button" onClick={() => void refreshCart()} className="font-bold underline">Retry</button></div>}

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Loading your cart…</div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600"><BookOpen size={24} /></div>
          <h2 className="mt-4 text-lg font-extrabold text-slate-900">Your cart is empty</h2>
          <p className="mt-1 text-sm text-slate-500">Explore courses and add the ones you want to learn.</p>
          <Link to="/dashboard/explore-courses" className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white hover:bg-indigo-700">Explore courses <ArrowRight size={15} /></Link>
        </div>
      ) : (
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-3">
                <input type="checkbox" aria-label="Select all courses" checked={allSelected} onChange={toggleAll} className="h-5 w-5 rounded accent-indigo-600" />
                <h2 className="text-sm font-extrabold text-slate-900">{count} {count === 1 ? "Course" : "Courses"}</h2>
              </div>
              <button type="button" onClick={() => void clearCart().catch(() => undefined)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700"><Trash2 size={14} /> Clear Cart</button>
            </div>

            <div className="divide-y divide-slate-100">
              {items.map((item) => (
                <article key={item.courseId} className="grid gap-3 px-4 py-4 sm:grid-cols-[24px_160px_minmax(0,1fr)_auto] sm:items-center sm:gap-4 sm:px-5">
                  <input type="checkbox" aria-label={`Select ${item.title}`} checked={selectedIds.includes(item.courseId)} onChange={() => toggleCourse(item.courseId)} className="h-5 w-5 rounded accent-indigo-600" />
                  <Link to={`/dashboard/explore-courses/${item.courseId}`} className="h-24 overflow-hidden rounded-xl bg-slate-100 sm:h-[100px]">
                    {item.thumbnailUrl ? <img src={item.thumbnailUrl} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-100 to-violet-100 text-2xl font-extrabold text-indigo-600">{item.title.slice(0, 2).toUpperCase()}</div>}
                  </Link>
                  <div className="min-w-0">
                    <Link to={`/dashboard/explore-courses/${item.courseId}`} className="text-sm font-extrabold text-slate-950 hover:text-indigo-600">{item.title}</Link>
                    {item.description && <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{item.description}</p>}
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-500">
                      {item.creatorName && <span>{item.creatorName}</span>}
                      {item.level && <span>{item.level.replaceAll("_", " ")}</span>}
                      {item.lessonCount > 0 && <span>{item.lessonCount} lessons</span>}
                    </div>
                    <button type="button" onClick={() => void removeFromCart(item.courseId).catch(() => undefined)} className="mt-2 text-xs font-semibold text-rose-600 hover:text-rose-700 sm:hidden">Remove</button>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <span className="text-lg font-extrabold text-slate-950">{formatCartPrice(item.price)}</span>
                    <button type="button" aria-label={`Remove ${item.title}`} onClick={() => void removeFromCart(item.courseId).catch(() => undefined)} className="hidden h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 sm:flex"><Trash2 size={16} /></button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-5">
            <h2 className="text-lg font-extrabold text-slate-950">Order Summary</h2>
            <div className="mt-5 flex justify-between text-sm text-slate-600"><span>Subtotal ({selectedItems.length} {selectedItems.length === 1 ? "course" : "courses"})</span><span className="font-bold text-slate-900">{formatCartTotal(selectedSubtotal)}</span></div>
            <div className="mt-3 flex justify-between text-sm text-slate-600"><span>Discount</span><span className="font-semibold text-slate-500">—</span></div>
            <div className="my-4 border-t border-slate-200" />
            <div className="flex justify-between text-base font-extrabold text-slate-950"><span>Total</span><span>{formatCartTotal(selectedSubtotal)}</span></div>
            <p className="mt-1 text-right text-xs text-slate-500">{selectedItems.length} {selectedItems.length === 1 ? "course selected" : "courses selected"}</p>
            <Link aria-disabled={selectedItems.length === 0} to={selectedItems.length ? checkoutUrl : "#"} onClick={(event) => selectedItems.length === 0 && event.preventDefault()} className={`mt-5 flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition ${selectedItems.length ? "bg-indigo-600 hover:bg-indigo-700" : "cursor-not-allowed bg-slate-300"}`}>Proceed to Checkout <ArrowRight size={16} /></Link>
            <div className="mt-4 rounded-xl bg-indigo-50 p-4 text-xs leading-5 text-indigo-700"><p className="font-bold">Secure checkout</p><p className="mt-1 text-indigo-600">Your course access will be available in My Learning after purchase.</p></div>
          </aside>
        </div>
      )}
    </div>
  );
}
