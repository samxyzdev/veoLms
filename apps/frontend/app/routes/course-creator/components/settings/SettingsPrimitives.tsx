// app/routes/admin/components/settings/SettingsPrimitives.tsx

import { Check, ChevronDown } from "lucide-react";

import type { ReactNode } from "react";

interface SettingsPageProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function SettingsPage({
  title,
  description,
  children,
}: SettingsPageProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">
            {title}
          </h2>

          <p className="mt-1.5 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>

        <button
          type="button"
          className="hidden h-10 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white hover:bg-indigo-700 sm:block"
        >
          Save Changes
        </button>
      </div>

      {children}
    </div>
  );
}

interface SettingsCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SettingsCard({
  title,
  description,
  children,
}: SettingsCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h3 className="text-base font-extrabold text-slate-950">{title}</h3>

        {description && (
          <p className="mt-1 text-xs leading-5 text-slate-400">{description}</p>
        )}
      </div>

      <div className="mt-6">{children}</div>
    </section>
  );
}

interface SettingToggleProps {
  title: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
}

export function SettingToggle({
  title,
  description,
  enabled,
  onChange,
}: SettingToggleProps) {
  return (
    <div className="flex items-center gap-4 border-b border-slate-100 py-4 last:border-0">
      <div className="min-w-0 flex-1">
        <h4 className="text-xs font-bold text-slate-900">{title}</h4>

        <p className="mt-1 text-[10px] leading-4 text-slate-400">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={onChange}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-indigo-600" : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: SelectFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <ChevronDown
          size={15}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
    </div>
  );
}
