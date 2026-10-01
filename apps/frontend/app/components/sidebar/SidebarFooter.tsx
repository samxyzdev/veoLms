import { Trophy } from "lucide-react";

import type { SidebarFooterCard as SidebarFooterCardType } from "./types";

type SidebarFooterCardProps = {
  card: SidebarFooterCardType;
};

export function SidebarFooterCard({ card }: SidebarFooterCardProps) {
  return (
    <div className="m-3 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-4 text-white">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
        <Trophy size={18} />
      </div>

      <h3 className="text-sm font-bold">{card.title}</h3>

      <p className="mt-1 text-xs leading-5 text-indigo-100">
        {card.description}
      </p>

      {card.buttonText && (
        <button
          type="button"
          className="mt-4 h-9 w-full rounded-lg bg-white text-xs font-bold text-indigo-600 transition hover:bg-indigo-50"
        >
          {card.buttonText}
        </button>
      )}
    </div>
  );
}
