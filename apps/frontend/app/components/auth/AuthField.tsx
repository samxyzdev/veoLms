import type { InputHTMLAttributes, ReactNode } from "react";

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  /** Label shown above the input, next to a small icon. */
  label: string;
  /** Small icon displayed beside the label. */
  icon: ReactNode;
  /** Optional element rendered inside the input's right edge (e.g. show/hide password). */
  rightSlot?: ReactNode;
  /** Optional helper text shown under the input. */
  hint?: string;
};

/**
 * Labeled form field used on the auth pages.
 * Renders an icon + label above a bordered, dark input box.
 */
export function AuthField({ label, icon, rightSlot, hint, ...inputProps }: AuthFieldProps) {
  return (
    <label className="block">
      <span className="flex items-center gap-2 text-sm font-medium text-gray-300">
        <span className="text-brand-light">{icon}</span>
        {label}
      </span>

      <span className="relative mt-2 block">
        <input
          {...inputProps}
          className="w-full rounded-lg border border-line bg-surface px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-brand"
        />
        {rightSlot && (
          <span className="absolute inset-y-0 right-3 flex items-center">{rightSlot}</span>
        )}
      </span>

      {hint && <span className="mt-1.5 block text-xs text-gray-500">{hint}</span>}
    </label>
  );
}