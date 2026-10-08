import { Star, Users } from "lucide-react";

type Props = {
  rating?: number | null;
  reviewCount?: number | null;
  studentsCount?: number | null;
};

export function CourseReviewsCard({ rating, reviewCount = 0, studentsCount = 0 }: Props) {
  const hasReviews = rating != null && reviewCount > 0;

  return (
    <section id="reviews" className="min-h-[190px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-extrabold text-slate-950">Student Reviews</h2>

      {hasReviews ? (
        <>
          <div className="mt-4 flex items-center gap-2">
            <Star size={20} fill="currentColor" className="text-amber-400" />

            <span className="text-xl font-extrabold text-slate-900">{rating.toFixed(1)}</span>

            <span className="text-xs text-slate-400">out of 5</span>
          </div>

          <p className="mt-1 text-[10px] text-slate-500">
            Based on {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
          </p>

          <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500">
            <Users size={14} />

            <span>
              {studentsCount} {studentsCount === 1 ? "student" : "students"}
            </span>
          </div>
        </>
      ) : (
        <div className="mt-4 flex min-h-[125px] flex-col justify-center">
          <div className="flex items-center gap-2">
            <Star size={19} fill="currentColor" className="text-amber-400" />

            <span className="text-sm font-extrabold text-slate-900">Ratings unavailable</span>
          </div>

          <p className="mt-2 text-[11px] leading-5 text-slate-500">No student reviews are available yet.</p>

          <p className="mt-1 text-[10px] text-slate-400">Reviews will appear here once learners rate this course.</p>
        </div>
      )}
    </section>
  );
}
