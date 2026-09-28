// app/routes/admin/components/settings/SettingsSidebar.tsx

import {
  Award,
  Bell,
  BookOpen,
  ClipboardList,
  CreditCard,
  GraduationCap,
  HardDrive,
  Link2,
  Mail,
  Megaphone,
  Settings,
  Shield,
  ShieldCheck,
  Star,
  UserRound,
  UsersRound,
  Users,
  Wrench,
} from "lucide-react";

import { adminData } from "../../data/adminData";

export type AdminSettingsSection =
  | "profile"
  | "security"
  | "general"
  | "courses"
  | "enrollments"
  | "payments"
  | "certificates"
  | "roles"
  | "instructors"
  | "students"
  | "email"
  | "notifications"
  | "announcements"
  | "storage"
  | "integrations"
  | "privacy"
  | "maintenance";

interface SettingsSidebarProps {
  activeSection: AdminSettingsSection;
  onChange: (section: AdminSettingsSection) => void;
}

const iconMap = {
  Award,
  Bell,
  BookOpen,
  ClipboardList,
  CreditCard,
  GraduationCap,
  HardDrive,
  Link2,
  Mail,
  Megaphone,
  Settings,
  Shield,
  ShieldCheck,
  Star,
  UserRound,
  UsersRound,
  Users,
  Wrench,
};

const groups = [
  "Account",
  "Platform",
  "Users & Access",
  "Communication",
  "System",
];

export function SettingsSidebar({
  activeSection,
  onChange,
}: SettingsSidebarProps) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="px-3 pb-4 pt-2">
        <h2 className="text-lg font-extrabold text-slate-950">Settings</h2>
      </div>

      <div className="space-y-5">
        {groups.map((group) => {
          const items = adminData.settings.sidebar.filter(
            (item) => item.group === group,
          );

          return (
            <div key={group}>
              <p className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
                {group}
              </p>

              <div className="space-y-1">
                {items.map((item) => {
                  const Icon = iconMap[item.icon as keyof typeof iconMap];

                  const active = activeSection === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onChange(item.id as AdminSettingsSection)}
                      className={`
                        flex w-full items-start gap-3 rounded-xl
                        px-3 py-2.5 text-left transition
                        ${
                          active
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                        }
                      `}
                    >
                      <Icon
                        size={18}
                        className="mt-0.5 shrink-0"
                        strokeWidth={active ? 2.3 : 1.9}
                      />

                      <div className="min-w-0">
                        <p
                          className={`text-xs font-semibold ${
                            active ? "text-indigo-600" : "text-slate-700"
                          }`}
                        >
                          {item.label}
                        </p>

                        <p className="mt-0.5 text-[10px] leading-4 text-slate-400">
                          {item.description}
                        </p>
                      </div>
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
