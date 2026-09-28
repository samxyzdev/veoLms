import {
  Award,
  Bell,
  CircleHelp,
  Globe,
  Lock,
  Palette,
  Shield,
  SlidersHorizontal,
  UserRound,
} from "lucide-react";

import { dashboardData } from "../../data/dashboardData";

export type SettingsSection =
  | "profile"
  | "security"
  | "learning"
  | "notifications"
  | "appearance"
  | "language"
  | "privacy"
  | "support";

interface SettingsSidebarProps {
  activeSection: SettingsSection;
  onChange: (section: SettingsSection) => void;
}

const iconMap = {
  UserRound,
  Shield,
  SlidersHorizontal,
  Bell,
  Palette,
  Globe,
  Lock,
  CircleHelp,
};

export function SettingsSidebar({
  activeSection,
  onChange,
}: SettingsSidebarProps) {
  const groups = ["Account", "Learning", "Privacy"];

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:p-4">
      <div className="mb-4 px-2 pt-1">
        <h2 className="text-lg font-extrabold text-slate-950">Settings</h2>
      </div>

      <div className="space-y-5">
        {groups.map((group) => {
          const items = dashboardData.settings.sidebar.filter(
            (item) => item.group === group,
          );

          return (
            <div key={group}>
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                {group}
              </p>

              <div className="space-y-1">
                {items.map((item) => {
                  const Icon = iconMap[item.icon as keyof typeof iconMap];

                  const isActive = activeSection === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onChange(item.id as SettingsSection)}
                      className={`
                        flex w-full items-start gap-3
                        rounded-xl px-3 py-3 text-left
                        transition
                        ${
                          isActive
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        }
                      `}
                    >
                      <Icon
                        size={19}
                        className="mt-0.5 shrink-0"
                        strokeWidth={isActive ? 2.3 : 1.9}
                      />

                      <span className="min-w-0">
                        <span
                          className={`block text-sm font-semibold ${
                            isActive ? "text-indigo-600" : "text-slate-700"
                          }`}
                        >
                          {item.label}
                        </span>

                        <span className="mt-0.5 block text-[10px] leading-4 text-slate-400">
                          {item.description}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
