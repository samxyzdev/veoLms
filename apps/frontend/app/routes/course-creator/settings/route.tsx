// app/routes/admin/settings/route.tsx

import { useState } from "react";

import { CertificateSettings } from "../components/settings/CertificateSettings";
import { CourseSettings } from "../components/settings/CourseSettings";
import { EnrollmentSettings } from "../components/settings/EnrollmentSettings";
import { GeneralSettings } from "../components/settings/GeneralSettings";
import { IntegrationSettings } from "../components/settings/IntegrationSettings";
import {
  SettingsSidebar,
  type AdminSettingsSection,
} from "../components/settings/SettingsSidebar";
import { NotificationSettings } from "../components/settings/NotificationSettings";
import { PaymentSettings } from "../components/settings/PaymentSettings";
import { RolesPermissions } from "../components/settings/RolesPermissions";
import { SecuritySettings } from "../components/settings/SecuritySettings";

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] =
    useState<AdminSettingsSection>("general");

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-xs">
        <span className="text-slate-400">Home</span>

        <span className="text-slate-300">›</span>

        <span className="text-slate-400">Settings</span>

        <span className="text-slate-300">›</span>

        <span className="font-semibold text-slate-900">
          {getSectionTitle(activeSection)}
        </span>
      </div>

      {/* Page Header */}
      <div className="mb-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-[34px]">
          Settings
        </h1>

        <p className="mt-1.5 text-sm text-slate-500">
          Manage your platform settings, configurations, and preferences.
        </p>
      </div>

      {/* Main settings */}
      <div className="grid gap-5 xl:grid-cols-[250px_minmax(0,1fr)]">
        {/* Settings sidebar */}
        <SettingsSidebar
          activeSection={activeSection}
          onChange={setActiveSection}
        />

        {/* Content */}
        <main className="min-w-0">
          {activeSection === "general" && <GeneralSettings />}

          {activeSection === "courses" && <CourseSettings />}

          {activeSection === "enrollments" && <EnrollmentSettings />}

          {activeSection === "payments" && <PaymentSettings />}

          {activeSection === "certificates" && <CertificateSettings />}

          {activeSection === "roles" && <RolesPermissions />}

          {activeSection === "notifications" && <NotificationSettings />}

          {activeSection === "integrations" && <IntegrationSettings />}

          {activeSection === "security" && <SecuritySettings />}

          {/* Placeholder sections */}
          {activeSection === "profile" && (
            <PlaceholderPage
              title="Admin Profile"
              description="Manage your administrator profile information."
            />
          )}

          {activeSection === "instructors" && (
            <PlaceholderPage
              title="Instructor Settings"
              description="Configure instructor access and platform rules."
            />
          )}

          {activeSection === "students" && (
            <PlaceholderPage
              title="Student Settings"
              description="Configure student access and account rules."
            />
          )}

          {activeSection === "email" && (
            <PlaceholderPage
              title="Email Settings"
              description="Configure SMTP and email delivery settings."
            />
          )}

          {activeSection === "announcements" && (
            <PlaceholderPage
              title="Announcement Settings"
              description="Manage announcements and broadcast settings."
            />
          )}

          {activeSection === "storage" && (
            <PlaceholderPage
              title="Storage"
              description="Manage file and media storage configuration."
            />
          )}

          {activeSection === "privacy" && <SecuritySettings />}

          {activeSection === "maintenance" && (
            <PlaceholderPage
              title="Maintenance"
              description="Manage maintenance mode and system operations."
            />
          )}
        </main>
      </div>
    </div>
  );
}

function getSectionTitle(section: AdminSettingsSection) {
  const titles: Record<AdminSettingsSection, string> = {
    profile: "Profile",
    security: "Security",
    general: "General",
    courses: "Course Settings",
    enrollments: "Enrollment Settings",
    payments: "Payment Settings",
    certificates: "Certificate Settings",
    roles: "Roles & Permissions",
    instructors: "Instructor Settings",
    students: "Student Settings",
    email: "Email Settings",
    notifications: "Notification Settings",
    announcements: "Announcement Settings",
    storage: "Storage",
    integrations: "Integrations",
    privacy: "Security & Privacy",
    maintenance: "Maintenance",
  };

  return titles[section];
}

function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-extrabold text-slate-950">{title}</h2>

      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}
