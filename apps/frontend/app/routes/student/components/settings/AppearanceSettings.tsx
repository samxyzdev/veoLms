import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useState } from "react";

import { dashboardData } from "../../data/dashboardData";

const themes = [
  {
    id: "light",
    label: "Light",
    icon: Sun,
  },
  {
    id: "dark",
    label: "Dark",
    icon: Moon,
  },
  {
    id: "system",
    label: "System",
    icon: Monitor,
  },
];

const accentColors = [
  {
    id: "indigo",
    className: "bg-indigo-500",
  },
  {
    id: "blue",
    className: "bg-blue-500",
  },
  {
    id: "green",
    className: "bg-emerald-500",
  },
  {
    id: "orange",
    className: "bg-orange-500",
  },
  {
    id: "pink",
    className: "bg-pink-500",
  },
  {
    id: "red",
    className: "bg-red-500",
  },
];

export function AppearanceSettings() {
  const [theme, setTheme] = useState(dashboardData.settings.appearance.theme);

  const [accentColor, setAccentColor] = useState(
    dashboardData.settings.appearance.accentColor,
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="text-lg font-extrabold text-slate-950">Appearance</h2>

        <p className="mt-1 text-xs text-slate-500">
          Customize how the platform looks for you.
        </p>
      </div>

      {/* Theme */}
      <div className="mt-6">
        <p className="mb-3 text-xs font-semibold text-slate-700">Theme</p>

        <div className="grid grid-cols-3 gap-2">
          {themes.map((item) => {
            const Icon = item.icon;
            const active = theme === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTheme(item.id)}
                className={`
                  relative flex flex-col items-center
                  justify-center gap-2 rounded-xl
                  border p-3 transition
                  ${
                    active
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }
                `}
              >
                {active && (
                  <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-white">
                    <Check size={10} />
                  </span>
                )}

                <Icon
                  size={18}
                  className={active ? "text-indigo-600" : "text-slate-500"}
                />

                <span
                  className={`text-[10px] font-semibold ${
                    active ? "text-indigo-600" : "text-slate-500"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accent */}
      <div className="mt-6">
        <p className="mb-3 text-xs font-semibold text-slate-700">
          Accent Color
        </p>

        <div className="flex items-center gap-3">
          {accentColors.map((color) => {
            const active = accentColor === color.id;

            return (
              <button
                key={color.id}
                type="button"
                aria-label={`Select ${color.id} accent`}
                onClick={() => setAccentColor(color.id)}
                className={`
                  flex h-7 w-7 items-center justify-center
                  rounded-full border-2 transition
                  ${active ? "border-slate-900" : "border-transparent"}
                `}
              >
                <span className={`h-6 w-6 rounded-full ${color.className}`} />

                {active && <Check size={13} className="absolute text-white" />}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
