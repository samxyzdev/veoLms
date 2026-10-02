import { Eye, EyeOff } from "lucide-react";
import { useState, type InputHTMLAttributes } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const AuthInput = ({
  label,
  type = "text",
  error,
  ...props
}: AuthInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="relative">
        <input
          {...props}
          type={inputType}
          aria-invalid={Boolean(error)}
          className={`h-12 w-full rounded-xl border bg-white px-4 ${
            isPassword ? "pr-12" : ""
          } text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
              : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          }`}
        />

        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <p className="px-1 text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  );
};
