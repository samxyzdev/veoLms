// app/routes/admin/components/settings/SecuritySettings.tsx

import { KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  SelectField,
  SettingToggle,
  SettingsCard,
  SettingsPage,
} from "./SettingsPrimitives";

export function SecuritySettings() {
  const [twoFactor, setTwoFactor] = useState(true);

  const [loginAlerts, setLoginAlerts] = useState(true);

  const [sessionTimeout, setSessionTimeout] = useState("30 minutes");

  return (
    <SettingsPage
      title="Security & Privacy"
      description="Protect your platform, administrator accounts, and user data."
    >
      <SettingsCard
        title="Security Controls"
        description="Configure the security rules applied across your platform."
      >
        <div className="space-y-1">
          <SettingToggle
            title="Two-Factor Authentication"
            description="Require administrators to use an additional verification step."
            enabled={twoFactor}
            onChange={() => setTwoFactor(!twoFactor)}
          />

          <SettingToggle
            title="Login Alerts"
            description="Notify administrators when a new login is detected."
            enabled={loginAlerts}
            onChange={() => setLoginAlerts(!loginAlerts)}
          />
        </div>
      </SettingsCard>

      <SettingsCard
        title="Session Security"
        description="Configure administrator session behavior."
      >
        <SelectField
          label="Session Timeout"
          value={sessionTimeout}
          onChange={setSessionTimeout}
          options={["15 minutes", "30 minutes", "1 hour", "4 hours", "Never"]}
        />
      </SettingsCard>

      <div className="grid gap-4 md:grid-cols-3">
        <SecurityInfo
          icon={ShieldCheck}
          title="Platform Security"
          description="All core security controls are active."
        />

        <SecurityInfo
          icon={LockKeyhole}
          title="Encrypted Data"
          description="Sensitive account data is protected."
        />

        <SecurityInfo
          icon={KeyRound}
          title="Admin Access"
          description="Administrator access requires authentication."
        />
      </div>
    </SettingsPage>
  );
}

function SecurityInfo({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        <Icon size={18} />
      </div>

      <h3 className="mt-4 text-xs font-bold text-slate-900">{title}</h3>

      <p className="mt-1 text-[10px] leading-4 text-slate-400">{description}</p>
    </div>
  );
}
