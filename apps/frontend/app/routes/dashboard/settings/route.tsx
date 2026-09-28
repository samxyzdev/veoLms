import { useState } from "react";

import { AppearanceSettings } from "../components/settings/AppearanceSettings";
import { LearningPreferences } from "../components/settings/LearningPreferences";
import { NotificationSettings } from "../components/settings/NotificationSettings";
import {
  SettingsSidebar,
  type SettingsSection,
} from "../components/settings/SettingsSidebar";
import { ProfileSettings } from "../components/settings/ProfileSettings";
import { PrivacySettings } from "../components/settings/PrivacySettings";
import { SecuritySettings } from "../components/settings/SecuritySettings";

export default function SettingsPage() {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("profile");

  return (
    <div>
      {/* Page Header */}
      <section className="mb-5">
        <div className="mb-4 flex items-center gap-2 text-xs">
          <span className="font-medium text-slate-400">Home</span>

          <span className="text-slate-300">›</span>

          <span className="font-semibold text-slate-900">Settings</span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-[34px]">
          Settings
        </h1>

        <p className="mt-1.5 text-sm text-slate-500">
          Manage your account, preferences, and learning experience.
        </p>
      </section>

      {/* Hero */}
      <section className="relative mb-5 min-h-[122px] overflow-hidden rounded-2xl bg-gradient-to-r from-[#eeeaff] via-[#f3f0ff] to-[#e8edff]">
        <div className="absolute -right-10 -top-24 h-56 w-56 rounded-full bg-violet-200/60 blur-2xl" />

        <div className="absolute right-48 top-4 h-28 w-72 rounded-[50%] bg-white/40 blur-xl" />

        <div className="absolute bottom-[-35px] right-[280px] h-32 w-32 rounded-full bg-indigo-100/80" />

        <div className="relative z-10 px-7 py-7 sm:px-9">
          <h2 className="text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl">
            Customize your learning experience
          </h2>

          <p className="mt-1.5 max-w-xl text-sm text-slate-500">
            Update your profile, manage preferences, and control your account
            settings.
          </p>
        </div>

        {/* CSS illustration */}
        <div className="absolute bottom-0 right-8 hidden h-full w-[270px] md:block">
          <div className="absolute bottom-0 right-4 h-16 w-40 rounded-t-[50%] bg-indigo-400/30 blur-xl" />

          {/* Body */}
          <div className="absolute bottom-0 right-14 h-20 w-24 rounded-t-[28px] bg-gradient-to-br from-indigo-500 to-violet-500" />

          {/* Head */}
          <div className="absolute bottom-[75px] right-[76px] h-11 w-11 rounded-full bg-[#f2b28c]" />

          {/* Hair */}
          <div className="absolute bottom-[100px] right-[72px] h-7 w-14 rounded-[50%] bg-slate-900" />

          {/* Laptop */}
          <div className="absolute bottom-3 right-0 h-12 w-32 rounded-lg bg-slate-800 shadow-xl">
            <div className="absolute inset-2 rounded bg-indigo-400/60" />
          </div>

          {/* Gear */}
          <div className="absolute right-36 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-violet-500 text-white shadow-md">
            ⚙
          </div>
        </div>
      </section>

      {/* Settings */}
      <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Settings navigation */}
        <SettingsSidebar
          activeSection={activeSection}
          onChange={setActiveSection}
        />

        {/* Content */}
        <div className="min-w-0 space-y-5">
          {activeSection === "profile" && (
            <>
              <ProfileSettings />

              <LearningPreferences />

              <div className="grid gap-5 xl:grid-cols-2">
                <NotificationSettings />

                <AppearanceSettings />
              </div>
            </>
          )}

          {activeSection === "security" && <SecuritySettings />}

          {activeSection === "learning" && <LearningPreferences />}

          {activeSection === "notifications" && <NotificationSettings />}

          {activeSection === "appearance" && <AppearanceSettings />}

          {activeSection === "language" && <LearningPreferences />}

          {activeSection === "privacy" && <PrivacySettings />}

          {activeSection === "support" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-extrabold text-slate-950">
                Help & Support
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Need help with your account or learning experience? Contact our
                support team.
              </p>

              <button
                type="button"
                className="mt-5 h-10 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white hover:bg-indigo-700"
              >
                Contact Support
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
