import { Bell } from "lucide-react";

export function HeaderNotifications() {
  return (
    <button
      type="button"
      aria-label="Notifications"
      className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
    >
      <Bell size={18} />

      <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
    </button>
  );
}
