import { KeyRound, LogOut, ShieldCheck } from "lucide-react";

export function SecuritySettings() {
  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <ShieldCheck size={20} />
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-slate-950">
              Account Security
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Manage your password and account security.
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Password</h3>

              <p className="mt-1 text-xs text-slate-400">
                Last changed 30 days ago.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              <KeyRound size={14} />
              Change Password
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-sm font-extrabold text-red-600">
          Sign out of all devices
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-400">
          This will end all active sessions except your current session.
        </p>

        <button
          type="button"
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-red-50 px-4 text-xs font-bold text-red-600 hover:bg-red-100"
        >
          <LogOut size={14} />
          Sign out everywhere
        </button>
      </div>
    </section>
  );
}
