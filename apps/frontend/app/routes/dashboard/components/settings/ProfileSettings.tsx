import { Camera, Save } from "lucide-react";
import { useState } from "react";

import { dashboardData } from "../../data/dashboardData";

export function ProfileSettings() {
  const profile = dashboardData.settings.profile;

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [bio, setBio] = useState(profile.bio);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-950">
            Profile Information
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Update your personal details and how others see you on the platform.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white transition hover:bg-indigo-700"
        >
          <Save size={15} />
          Save Changes
        </button>
      </div>

      {/* Form */}
      <div className="mt-7 grid gap-7 md:grid-cols-[145px_1fr]">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-3xl font-extrabold text-indigo-600">
              {profile.avatar}
            </div>

            <button
              type="button"
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-white text-slate-600 shadow-md transition hover:text-indigo-600"
            >
              <Camera size={14} />
            </button>
          </div>

          <button
            type="button"
            className="mt-3 text-xs font-bold text-slate-800"
          >
            Upload Photo
          </button>

          <p className="mt-1 text-[10px] text-slate-400">JPG, PNG up to 5MB</p>
        </div>

        {/* Inputs */}
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Name */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-700">
              Full Name
            </label>

            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-700">
              Email Address
            </label>

            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
            />
          </div>

          {/* Bio */}
          <div className="sm:col-span-2">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Bio
              </label>

              <span className="text-[10px] text-slate-400">
                {bio.length}/{profile.maxBioLength}
              </span>
            </div>

            <textarea
              value={bio}
              onChange={(event) =>
                setBio(event.target.value.slice(0, profile.maxBioLength))
              }
              rows={4}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
