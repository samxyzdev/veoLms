import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

type CourseFormSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  icon: ReactNode;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
};

export function CourseFormSelect({
  value,
  onChange,
  options,
  icon,
  placeholder = "Select an option",
  error = false,
  disabled = false,
}: CourseFormSelectProps) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </div>

      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={`h-11 w-full appearance-none rounded-xl bg-white pl-11 pr-10 text-sm text-slate-900 outline-none transition disabled:cursor-not-allowed disabled:bg-slate-50 ${
          error
            ? "border border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
        }`}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}
