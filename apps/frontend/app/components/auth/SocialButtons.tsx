import { Cat } from "lucide-react";

export function SocialButtons() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.04 5.04 0 0 1-2.2 3.31v2.75h3.55c2.08-1.91 3.29-4.74 3.29-8.07Z" />
          <path d="M12 22.5c2.97 0 5.46-.98 7.27-2.65l-3.55-2.75c-.98.66-2.23 1.05-3.72 1.05-2.86 0-5.29-1.93-6.16-4.53H2.17v2.84A10.98 10.98 0 0 0 12 22.5Z" />
          <path d="M5.84 13.62A6.59 6.59 0 0 1 5.5 11.5c0-.74.13-1.46.34-2.12V6.54H2.17A10.99 10.99 0 0 0 1.5 11.5c0 1.77.42 3.44 1.18 4.96l3.16-2.84Z" />
          <path d="M12 4.85c1.62 0 3.08.56 4.22 1.66l3.16-3.16C17.45 1.62 14.97.5 12 .5A10.98 10.98 0 0 0 2.17 6.54l3.67 2.84C6.71 6.78 9.14 4.85 12 4.85Z" />
        </svg>
        Google
      </button>

      <button
        type="button"
        className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        <Cat size={18} />
        GitHub
      </button>
    </div>
  );
}
