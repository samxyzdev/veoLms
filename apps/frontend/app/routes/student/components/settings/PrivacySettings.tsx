import { Download, Lock, Trash2 } from "lucide-react";

export function PrivacySettings() {
  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Lock size={20} />
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-slate-950">
              Privacy & Data
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Control your privacy and manage your personal data.
            </p>
          </div>
        </div>

        <div className="mt-6 divide-y divide-slate-100 border-t border-slate-100">
          <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Download your data
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Get a copy of your learning and account data.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              <Download size={14} />
              Download
            </button>
          </div>

          <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-bold text-red-600">Delete account</h3>

              <p className="mt-1 text-xs text-slate-400">
                Permanently delete your Learnly account and data.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-red-50 px-4 text-xs font-bold text-red-600 hover:bg-red-100"
            >
              <Trash2 size={14} />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
