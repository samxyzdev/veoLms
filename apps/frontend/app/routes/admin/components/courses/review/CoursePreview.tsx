// app/routes/admin/components/courses/review/CoursePreview.tsx

import {
  BookOpen,
  Check,
  Clock3,
  Globe,
  Play,
  Star,
  Users,
} from "lucide-react";

import type { CourseReviewData } from "./types";

export default function CoursePreview({
  course,
}: {
  course: CourseReviewData;
}) {
  const discount =
    course.comparePrice > course.price
      ? Math.round(
          ((course.comparePrice - course.price) / course.comparePrice) * 100,
        )
      : 0;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
            <Play className="h-4 w-4" />
          </div>

          <h3 className="text-base font-bold text-[#101537]">Course Preview</h3>
        </div>

        <button
          type="button"
          className="text-xs font-semibold text-violet-600 hover:text-violet-700"
        >
          View Full Preview →
        </button>
      </div>

      {/* Thumbnail */}
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="aspect-video w-full object-cover"
        />

        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg">
            <Play className="ml-1 h-5 w-5 fill-violet-600 text-violet-600" />
          </div>
        </div>
      </div>

      {/* Title */}
      <h2 className="mt-5 text-xl font-bold leading-tight text-[#101537]">
        {course.title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {course.description}
      </p>

      {/* Rating */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        <div className="flex items-center gap-1 text-amber-500">
          <Star className="h-4 w-4 fill-current" />

          <span className="font-semibold">{course.rating}</span>
        </div>

        <span className="text-slate-400">({course.reviews} reviews)</span>

        <div className="flex items-center gap-1.5 text-slate-500">
          <Users className="h-4 w-4" />
          {course.students.toLocaleString()} students
        </div>
      </div>

      {/* Price */}
      <div className="mt-5 flex items-center gap-3">
        <span className="text-2xl font-bold text-[#101537]">
          ₹{course.price}
        </span>

        {course.comparePrice > course.price && (
          <>
            <span className="text-sm text-slate-400 line-through">
              ₹{course.comparePrice}
            </span>

            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              {discount}% off
            </span>
          </>
        )}
      </div>

      {/* CTA */}
      <button
        type="button"
        className="mt-5 h-11 w-full rounded-xl bg-violet-600 text-sm font-semibold text-white transition hover:bg-violet-700"
      >
        Enroll Now
      </button>

      {/* Meta */}
      <div className="mt-5 grid grid-cols-2 divide-x divide-slate-200 border-b border-t border-slate-100 py-4">
        <PreviewMeta
          icon={<Clock3 className="h-4 w-4" />}
          label={course.duration}
          title="Duration"
        />

        <PreviewMeta
          icon={<BookOpen className="h-4 w-4" />}
          label={`${course.lessons} Lessons`}
          title="Lectures"
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <PreviewMeta
          icon={<Globe className="h-4 w-4" />}
          label={course.level}
          title="Level"
        />

        <div>
          <p className="text-[11px] text-slate-400">Language</p>

          <p className="mt-1 text-sm font-semibold text-slate-700">
            {course.language}
          </p>
        </div>
      </div>

      {/* Outcomes */}
      <div className="mt-6 border-t border-slate-100 pt-5">
        <h3 className="text-base font-bold text-[#101537]">
          What You’ll Learn
        </h3>

        <div className="mt-4 space-y-3">
          {course.learningOutcomes.map((outcome) => (
            <div key={outcome} className="flex items-start gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

              <p className="text-sm leading-5 text-slate-600">{outcome}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PreviewMeta({
  icon,
  title,
  label,
}: {
  icon: React.ReactNode;
  title: string;
  label: string;
}) {
  return (
    <div className="px-3 first:pl-0 last:pr-0">
      <div className="flex items-center gap-1.5 text-violet-600">
        {icon}

        <span className="text-[11px] text-slate-400">{title}</span>
      </div>

      <p className="mt-1 text-sm font-semibold text-slate-700">{label}</p>
    </div>
  );
}
