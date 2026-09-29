// app/routes/admin/components/courses/pricing/AccessType.tsx

import { Globe, Link2, Lock } from "lucide-react";

import type { AccessType as AccessTypeValue } from "./types";
import { SectionCard } from "./PricingUI";

function AccessOption({
  value,
  currentValue,
  onChange,
  icon: Icon,
  title,
  description,
}: {
  value: AccessTypeValue;
  currentValue: AccessTypeValue;
  onChange: (value: AccessTypeValue) => void;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  const active = currentValue === value;

  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition ${
        active
          ? "border-violet-500 bg-violet-50/40"
          : "border-slate-200 hover:border-violet-200 hover:bg-slate-50"
      }`}
    >
      <div className="relative mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center">
        <span
          className={`absolute h-4 w-4 rounded-full border-2 ${
            active ? "border-violet-600" : "border-slate-300"
          }`}
        />

        {active && (
          <span className="absolute h-2 w-2 rounded-full bg-violet-600" />
        )}
      </div>

      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          active
            ? "bg-violet-100 text-violet-600"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>

        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      </div>
    </button>
  );
}

export default function AccessType({
  value,
  onChange,
}: {
  value: AccessTypeValue;
  onChange: (value: AccessTypeValue) => void;
}) {
  return (
    <SectionCard
      title="Access Type"
      description="Control who can access and enroll in this course."
    >
      <div className="space-y-2.5">
        <AccessOption
          value="public"
          currentValue={value}
          onChange={onChange}
          icon={Globe}
          title="Public Course"
          description="Visible to everyone. Anyone can enroll."
        />

        <AccessOption
          value="unlisted"
          currentValue={value}
          onChange={onChange}
          icon={Link2}
          title="Unlisted Course"
          description="Only users with the link can access."
        />

        <AccessOption
          value="private"
          currentValue={value}
          onChange={onChange}
          icon={Lock}
          title="Private Course"
          description="Only selected users can access."
        />
      </div>
    </SectionCard>
  );
}
