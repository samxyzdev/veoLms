import { getInitials } from "~/lib/format";

type Props = {
  creatorName?: string | null;
};

export function InstructorCard({ creatorName }: Props) {
  const name = creatorName?.trim() || "Instructor unavailable";

  const initials = creatorName?.trim() ? getInitials(creatorName) : "NA";

  return (
    <section id="instructor" className="min-h-[190px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-extrabold text-slate-950">About the Instructor</h2>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-extrabold text-indigo-700">{initials}</div>

        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-900">{name}</p>

          <p className="text-[11px] text-slate-500">Course Creator</p>
        </div>
      </div>

      <p className="mt-4 text-[11px] leading-5 text-slate-600">{creatorName ? `Meet ${creatorName}, the creator of this course.` : "Instructor information is not available yet."}</p>

      <button type="button" className="mt-3 text-[11px] font-bold text-indigo-600 hover:text-indigo-700">
        View Full Profile →
      </button>
    </section>
  );
}
