// app/routes/admin/components/courses/review/ReviewCard.tsx

import type { ReactNode } from "react";
import { Edit3 } from "lucide-react";

export default function ReviewCard({
  title,
  icon,
  children,
  onEdit,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  onEdit?: () => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
            {icon}
          </div>

          <h3 className="text-base font-bold text-[#101537]">{title}</h3>
        </div>

        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-lg border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-600 transition hover:bg-violet-100"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit
          </button>
        )}
      </div>

      {children}
    </section>
  );
}
