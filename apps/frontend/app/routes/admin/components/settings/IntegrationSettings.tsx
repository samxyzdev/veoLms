// app/routes/admin/components/settings/IntegrationSettings.tsx

import { CheckCircle2, Link2, Plus } from "lucide-react";

import { adminData } from "../../data/adminData";
import { SettingsCard, SettingsPage } from "./SettingsPrimitives";

export function IntegrationSettings() {
  return (
    <SettingsPage
      title="Integrations"
      description="Connect your LMS with third-party services and external tools."
    >
      <SettingsCard
        title="Connected Services"
        description="Manage services connected to your platform."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {adminData.settings.integrations.map((integration) => (
            <div
              key={integration.id}
              className="rounded-2xl border border-slate-200 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Link2 size={17} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xs font-bold text-slate-900">
                      {integration.name}
                    </h3>

                    {integration.connected && (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600">
                        <CheckCircle2 size={12} />
                        Connected
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-[10px] text-slate-400">
                    {integration.description}
                  </p>

                  <button
                    type="button"
                    className={`mt-4 h-9 rounded-xl px-3 text-[10px] font-bold ${
                      integration.connected
                        ? "border border-slate-200 text-slate-600 hover:bg-slate-50"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    {integration.connected ? "Manage" : "Connect"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 text-xs font-bold text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
        >
          <Plus size={15} />
          Add Integration
        </button>
      </SettingsCard>
    </SettingsPage>
  );
}
