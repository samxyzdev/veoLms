// app/routes/admin/components/settings/GeneralSettings.tsx

import {
  Award,
  Bell,
  BookOpen,
  Check,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  CreditCard,
  Link2,
  Mail,
  Megaphone,
  MessageCircle,
  Pencil,
  Save,
  Settings,
  Shield,
  Star,
  UserPlus,
  Video,
} from "lucide-react";
import { useState } from "react";

import { adminData } from "../../data/adminData";

const featureIcons = {
  UserPlus,
  Star,
  MessageCircle,
  Video,
  Award,
  ClipboardList,
};

export function GeneralSettings() {
  const data = adminData.settings.general;

  const [platformName, setPlatformName] = useState(data.platformName);

  const [tagline, setTagline] = useState(data.tagline);

  const [siteUrl, setSiteUrl] = useState(data.siteUrl);

  const [timezone, setTimezone] = useState(data.timezone);

  const [language, setLanguage] = useState(data.language);

  const [primaryColor, setPrimaryColor] = useState(
    data.appearance.primaryColor,
  );

  const [secondaryColor, setSecondaryColor] = useState(
    data.appearance.secondaryColor,
  );

  const [theme, setTheme] = useState(data.appearance.theme);

  const [features, setFeatures] = useState(data.features);

  const toggleFeature = (id: number) => {
    setFeatures((current) =>
      current.map((feature) =>
        feature.id === id
          ? {
              ...feature,
              enabled: !feature.enabled,
            }
          : feature,
      ),
    );
  };

  return (
    <div className="space-y-5">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Platform
          </p>

          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">
            General Settings
          </h2>

          <p className="mt-1.5 text-xs leading-5 text-slate-500">
            Configure the basic information and default settings for your
            platform.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white hover:bg-indigo-700"
        >
          <Save size={15} />
          Save Changes
        </button>
      </div>

      {/* Platform Information */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <h3 className="text-base font-extrabold text-slate-950">
            Platform Information
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Basic details about your learning platform.
          </p>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_350px]">
          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-700">
                Platform Name
              </label>

              <input
                value={platformName}
                onChange={(event) => setPlatformName(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            {/* Tagline */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-700">
                Tagline
              </label>

              <input
                value={tagline}
                onChange={(event) => setTagline(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />
            </div>
          </div>

          {/* Logo */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-700">
              Platform Logo
            </label>

            <div className="flex items-center gap-5">
              <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-indigo-50">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-extrabold text-white">
                  {data.logo.text}
                </div>
              </div>

              <div>
                <button
                  type="button"
                  className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Pencil size={13} />
                  Change Logo
                </button>

                <p className="mt-2 text-[10px] leading-4 text-slate-400">
                  Recommended size: 200 × 200px
                  <br />
                  PNG, JPG or SVG (Max 2MB)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Site Configuration */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <h3 className="text-base font-extrabold text-slate-950">
            Site Configuration
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Set your platform URL, timezone, and language preferences.
          </p>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {/* URL */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-700">
              Site URL
            </label>

            <input
              value={siteUrl}
              onChange={(event) => setSiteUrl(event.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
            />
          </div>

          {/* Timezone */}
          <SelectField
            label="Timezone"
            value={timezone}
            onChange={setTimezone}
            options={[
              "(GMT+5:30) Asia/Kolkata",
              "(GMT+0:00) UTC",
              "(GMT-5:00) America/New_York",
              "(GMT-8:00) America/Los_Angeles",
            ]}
          />

          {/* Language */}
          <SelectField
            label="Default Language"
            value={language}
            onChange={setLanguage}
            options={["English", "Hindi", "Spanish", "French"]}
          />
        </div>
      </section>

      {/* Appearance */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <h3 className="text-base font-extrabold text-slate-950">
            Appearance
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Customize the look and feel of your platform.
          </p>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {/* Primary */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-700">
              Primary Color
            </label>

            <div className="flex h-11 items-center rounded-xl border border-slate-200 px-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(event) => setPrimaryColor(event.target.value)}
                className="h-8 w-8 cursor-pointer rounded-lg border-0 bg-transparent p-0"
              />

              <input
                value={primaryColor}
                onChange={(event) => setPrimaryColor(event.target.value)}
                className="ml-3 flex-1 bg-transparent text-sm uppercase outline-none"
              />
            </div>
          </div>

          {/* Secondary */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-700">
              Secondary Color
            </label>

            <div className="flex h-11 items-center rounded-xl border border-slate-200 px-3">
              <input
                type="color"
                value={secondaryColor}
                onChange={(event) => setSecondaryColor(event.target.value)}
                className="h-8 w-8 cursor-pointer rounded-lg border-0 bg-transparent p-0"
              />

              <input
                value={secondaryColor}
                onChange={(event) => setSecondaryColor(event.target.value)}
                className="ml-3 flex-1 bg-transparent text-sm uppercase outline-none"
              />
            </div>
          </div>

          {/* Theme */}
          <div>
            <p className="mb-2 text-xs font-semibold text-slate-700">
              Theme Mode
            </p>

            <div className="grid grid-cols-3 gap-2">
              {["light", "dark", "system"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTheme(item)}
                  className={`rounded-xl border px-3 py-2.5 text-[10px] font-semibold capitalize ${
                    theme === item
                      ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {theme === item && (
                    <Check size={12} className="mx-auto mb-1" />
                  )}

                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <h3 className="text-base font-extrabold text-slate-950">
            Platform Features
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Enable or disable key features on your platform.
          </p>
        </div>

        <div className="mt-6 grid gap-x-10 md:grid-cols-2">
          {features.map((feature) => {
            const Icon =
              featureIcons[feature.icon as keyof typeof featureIcons];

            return (
              <div
                key={feature.id}
                className="flex items-center gap-3 border-b border-slate-100 py-4 last:border-0"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Icon size={16} />
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900">
                    {feature.title}
                  </h4>

                  <p className="mt-1 text-[10px] leading-4 text-slate-400">
                    {feature.description}
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={feature.enabled}
                  onClick={() => toggleFeature(feature.id)}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    feature.enabled ? "bg-indigo-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                      feature.enabled ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-[10px] text-slate-400">
          <CircleHelp size={13} />
          Changes to platform features may affect existing courses and users.
        </div>
      </section>
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <ChevronDown
          size={15}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
    </div>
  );
}
