// app/routes/admin/components/courses/pricing/PricingUI.tsx

import type { ElementType, ReactNode } from "react";

export function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        checked ? "bg-violet-600" : "bg-slate-300"
      }`}
      aria-pressed={checked}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

export function SectionCard({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
    >
      <div className="mb-5">
        <h3 className="text-base font-bold text-[#101537]">{title}</h3>

        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>

      {children}
    </section>
  );
}

export function SettingRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-slate-800">{title}</p>

        <p className="mt-0.5 text-xs text-slate-400">{description}</p>
      </div>

      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export function InputWithIcon({
  icon: Icon,
  prefix,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  icon?: ElementType;
  prefix?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex h-11 overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100">
      {Icon && (
        <div className="flex w-11 items-center justify-center border-r border-slate-200 text-slate-400">
          <Icon className="h-4 w-4" />
        </div>
      )}

      {prefix && (
        <div className="flex w-11 items-center justify-center border-r border-slate-200 text-sm font-medium text-slate-500">
          {prefix}
        </div>
      )}

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
      />
    </div>
  );
}
