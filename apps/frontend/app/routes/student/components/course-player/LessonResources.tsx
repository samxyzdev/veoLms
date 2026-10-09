import { Download, FileText, FolderOpen } from "lucide-react";

export type LessonResource = {
  id: string;
  title: string;
  url: string;
  type: string;
};

type LessonResourcesProps = {
  resources: LessonResource[];
};

export function LessonResources({ resources }: LessonResourcesProps) {
  return (
    <section className="mt-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-4.5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-extrabold text-slate-950">Lesson resources</h2>
          <p className="mt-0.5 text-[10px] text-slate-500">Files and materials attached to this lesson</p>
        </div>
        <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-bold text-slate-600">{resources.length} {resources.length === 1 ? "item" : "items"}</span>
      </div>

      {resources.length > 0 ? (
        <div className="mt-3 divide-y divide-slate-100 rounded-lg border border-slate-100">
          {resources.map((resource) => (
            <div key={resource.id} className="flex items-center gap-3 px-3 py-2.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-500"><FileText size={18} /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-800">{resource.title}</p>
                <p className="mt-0.5 text-[10px] text-slate-500">{resource.type}</p>
              </div>
              <a href={resource.url} download aria-label={`Download ${resource.title}`} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"><Download size={15} /></a>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-3 rounded-lg border border-dashed border-slate-200 px-3 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400"><FolderOpen size={17} /></span>
          <p className="text-[11px] leading-4 text-slate-500">No downloadable resources have been added to this lesson yet.</p>
        </div>
      )}
    </section>
  );
}
