import { Star } from "lucide-react";

export function CourseReviewsCard() {
  return (
    <section id="reviews" className="scroll-mt-16 rounded-xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
      <h2 className="text-sm font-extrabold text-slate-950">Student Reviews</h2>
      <div className="mt-4 flex items-center gap-2 text-amber-500">
        <Star size={19} fill="currentColor" />
        <span className="text-sm font-extrabold text-slate-900">Ratings unavailable</span>
      </div>
      <p className="mt-2 text-[11px] leading-5 text-slate-500">Student rating details will appear here when they’re available.</p>
    </section>
  );
}
