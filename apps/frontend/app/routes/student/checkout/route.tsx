import { ArrowLeft, ArrowRight, Check, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate, useOutletContext, useSearchParams } from "react-router";

import { api } from "~/lib/axios";
import type { HeaderUser } from "~/components/header/types";
import { useCart, formatCartPrice, formatCartTotal } from "../components/cart/CartContext";

export default function CheckoutPage() {
  const { items, removeFromCart } = useCart();
  const { user } = useOutletContext<{ user: HeaderUser }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const requestedIds = (searchParams.get("courses") ?? "").split(",").filter(Boolean);
  const selectedItems = requestedIds.length ? items.filter((item) => requestedIds.includes(item.courseId)) : items;
  const total = selectedItems.reduce((sum, item) => sum + (item.price ?? 0), 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      for (const item of selectedItems) {
        await api.post("/student/courses/purchase", { courseId: item.courseId });
        await removeFromCart(item.courseId);
      }
      navigate("/dashboard/my-learning");
    } catch {
      setError("Purchase abhi complete nahi ho saka. Cart safe hai—dobara try karein.");
      setIsSubmitting(false);
    }
  }

  if (selectedItems.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
        <h1 className="text-xl font-extrabold text-slate-950">No courses selected</h1>
        <p className="mt-2 text-sm text-slate-500">Add a course to your cart before checkout.</p>
        <Link to="/dashboard/cart" className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white hover:bg-indigo-700"><ArrowLeft size={15} /> Back to Cart</Link>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-5">
      <nav className="flex items-center gap-2 text-xs text-slate-500" aria-label="Breadcrumb"><Link to="/dashboard/cart" className="hover:text-indigo-600">Cart</Link><span>›</span><span className="font-semibold text-slate-700">Checkout</span></nav>
      <header><h1 className="text-3xl font-extrabold tracking-tight text-slate-950">Checkout</h1><p className="mt-1 text-sm text-slate-500">Review your order and confirm your course enrollment.</p></header>

      {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">{error}</div>}

      <form onSubmit={(event) => void handleSubmit(event)} className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-base font-extrabold text-slate-950">Learnly Account</h2>
            <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-sm font-bold text-slate-900">{user.name}</p>
              <p className="mt-0.5 text-xs text-slate-500">{user.email}</p>
              <p className="mt-2 text-[11px] text-slate-500">Purchased courses will be added to this account.</p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-base font-extrabold text-slate-950">Payment Method</h2>
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-indigo-200 bg-indigo-50/60 p-4">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white"><Check size={12} /></span>
              <div><p className="text-sm font-bold text-slate-900">Secure course checkout</p><p className="mt-1 text-xs leading-5 text-slate-500">Confirm your enrollment and find your courses in My Learning.</p></div>
            </div>
          </section>

          <Link to="/dashboard/cart" className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700"><ArrowLeft size={14} /> Return to Cart</Link>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-5">
          <h2 className="text-lg font-extrabold text-slate-950">Order Summary</h2>
          <div className="mt-4 max-h-64 space-y-3 overflow-y-auto">
            {selectedItems.map((item) => <div key={item.courseId} className="flex items-start justify-between gap-3"><p className="min-w-0 text-xs font-semibold leading-5 text-slate-700">{item.title}</p><span className="shrink-0 text-xs font-bold text-slate-900">{formatCartPrice(item.price)}</span></div>)}
          </div>
          <div className="my-4 border-t border-slate-200" />
          <div className="flex justify-between text-sm text-slate-600"><span>Subtotal</span><span className="font-bold text-slate-900">{formatCartTotal(total)}</span></div>
          <div className="mt-3 flex justify-between text-base font-extrabold text-slate-950"><span>Total</span><span>{formatCartTotal(total)}</span></div>
          <button type="submit" disabled={isSubmitting} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60">{isSubmitting ? "Processing…" : "Confirm Purchase"}<ArrowRight size={16} /></button>
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-4"><ShieldCheck size={22} className="shrink-0 text-indigo-600" /><div><p className="text-xs font-bold text-slate-800">Secure checkout</p><p className="mt-0.5 text-[10px] leading-4 text-slate-500">Your order is linked to your Learnly account.</p></div></div>
        </aside>
      </form>
    </div>
  );
}
