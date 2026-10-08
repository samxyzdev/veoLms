import { getInitials } from "~/lib/format";

type Props = {
  creatorName: string;
};

export function InstructorCard({ creatorName }: Props) {
  const initials = getInitials(creatorName);

  return (
    <section id="instructor" className="scroll-mt-16 rounded-xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
      <h2 className="text-sm font-extrabold text-slate-950">About the Instructor</h2>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 text-xs font-extrabold text-indigo-700">{initials}</div>

        <div>
          <p className="text-sm font-semibold text-slate-800">{creatorName}</p>

          <p className="text-[11px] text-slate-500">Course Creator</p>
        </div>
      </div>
      <p className="mt-4 text-[11px] leading-5 text-slate-600">Meet {creatorName || "your course instructor"}, the creator of this course.</p>
    </section>
  );
}
