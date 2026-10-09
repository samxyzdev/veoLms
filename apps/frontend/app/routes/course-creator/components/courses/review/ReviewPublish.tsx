import { CheckCircle2, Pencil, Send } from "lucide-react";
import type { ReactNode } from "react";

type ReviewSection = {
  id: string;
  title: string;
  contents?: Array<{ id: string; title: string; contentType: string }>;
  lessons?: Array<{ id: string; title: string; type: string }>;
};

type ReviewPublishProps = {
  title: string;
  description: string;
  category: string;
  level: string;
  language: string;
  price: string;
  thumbnailUrl?: string | null;
  outcomes: string[];
  sections: ReviewSection[];
  isSaving?: boolean;
  isPublishing?: boolean;
  publishError?: string | null;
  onPrevious?: () => void;
  onPublish?: () => void;
  onSaveDraft?: () => void;
  onEditBasicInfo?: () => void;
  onEditContent?: () => void;
  onEditPricing?: () => void;
};

function ReviewCard({ title, onEdit, children }: { title: string; onEdit?: () => void; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        {onEdit && <button type="button" onClick={onEdit} className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-700"><Pencil className="h-3.5 w-3.5" /> Edit</button>}
      </div>
      {children}
    </section>
  );
}

export default function ReviewPublish({
  title,
  description,
  category,
  level,
  language,
  price,
  thumbnailUrl,
  outcomes,
  sections,
  isSaving = false,
  isPublishing = false,
  publishError,
  onPrevious,
  onPublish,
  onSaveDraft,
  onEditBasicInfo,
  onEditContent,
  onEditPricing,
}: ReviewPublishProps) {
  const totalLessons = sections.reduce((total, section) => total + (section.contents?.length ?? section.lessons?.length ?? 0), 0);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#101537]">Review & Publish</h2>
          <p className="mt-1 text-sm text-slate-500">Confirm the details saved for this course before publishing.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onSaveDraft} disabled={isSaving || isPublishing} className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">Save Draft</button>
          <button type="button" onClick={onPublish} disabled={isSaving || isPublishing} className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"><Send className="h-4 w-4" />{isPublishing ? "Publishing…" : "Publish Course"}</button>
        </div>
      </div>

      <div className="space-y-4">
        {publishError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{publishError}</div>}
        <ReviewCard title="Course details" onEdit={onEditBasicInfo}>
          <div className="flex gap-4">
            {thumbnailUrl && <img src={thumbnailUrl} alt="Course thumbnail" className="h-20 w-36 rounded-lg object-cover" />}
            <div className="min-w-0">
              <p className="font-semibold text-slate-900">{title || "Untitled course"}</p>
              <p className="mt-1 text-sm text-slate-600">{description || "No description added"}</p>
              <p className="mt-2 text-xs text-slate-500">{[category, level, language].filter(Boolean).join(" · ") || "Course category, level, and language not set"}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Students will learn</p>
            {outcomes.filter(Boolean).length ? <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">{outcomes.filter(Boolean).map((outcome, index) => <li key={`${outcome}-${index}`}>{outcome}</li>)}</ul> : <p className="text-sm text-slate-500">No learning outcomes added.</p>}
          </div>
        </ReviewCard>

        <ReviewCard title={`Course content · ${sections.length} sections · ${totalLessons} lessons`} onEdit={onEditContent}>
          {sections.length ? <ol className="space-y-3">{sections.map((section, index) => {
            const lessons = section.contents ?? section.lessons ?? [];
            return <li key={section.id} className="rounded-lg bg-slate-50 px-4 py-3"><p className="text-sm font-semibold text-slate-800">{index + 1}. {section.title} <span className="font-normal text-slate-500">· {lessons.length} lessons</span></p>{lessons.length > 0 && <ul className="mt-2 space-y-1 pl-4 text-xs text-slate-600">{lessons.map((lesson) => <li key={lesson.id}>{lesson.title} · {"contentType" in lesson ? lesson.contentType : lesson.type}</li>)}</ul>}</li>;
          })}</ol> : <p className="text-sm text-slate-500">No sections added yet.</p>}
        </ReviewCard>

        <ReviewCard title="Pricing" onEdit={onEditPricing}>
          <p className="text-lg font-semibold text-slate-900">{Number(price || 0) === 0 ? "Free" : `₹${Number(price).toLocaleString("en-IN")}`}</p>
        </ReviewCard>

        <div className="flex items-start gap-3 rounded-xl border border-violet-100 bg-violet-50 p-4 text-sm text-violet-800">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <p>Publishing makes this course available to students. The server will check that required course details and content are saved.</p>
        </div>
      </div>

      <div className="mt-6 flex justify-start border-t border-slate-100 pt-5">
        <button type="button" onClick={onPrevious} className="h-10 rounded-xl border border-slate-200 px-5 text-sm font-medium text-slate-600 hover:bg-slate-50">Back</button>
      </div>
    </div>
  );
}
