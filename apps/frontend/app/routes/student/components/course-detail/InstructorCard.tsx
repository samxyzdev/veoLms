type Props = {
  creatorName: string;
};

export function InstructorCard({ creatorName }: Props) {
  const initials = creatorName
    .split(" ")
    .filter(Boolean)
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-bold text-slate-900">About the Instructor</h3>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">{initials}</div>

        <div>
          <p className="text-sm font-semibold text-slate-800">{creatorName}</p>

          <p className="text-xs text-slate-400">Course Creator</p>
        </div>
      </div>
    </section>
  );
}
