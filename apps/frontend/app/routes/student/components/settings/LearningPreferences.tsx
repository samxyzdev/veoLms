import { ChevronDown, Plus, X } from "lucide-react";
import { useState } from "react";

import { dashboardData } from "../../data/dashboardData";

export function LearningPreferences() {
  const data = dashboardData.settings.learningPreferences;

  const [interests, setInterests] = useState(data.interests);

  const [goal, setGoal] = useState(data.learningGoal);

  const [level, setLevel] = useState(data.skillLevel);

  const [language, setLanguage] = useState(data.language);

  const removeInterest = (interest: string) => {
    setInterests((current) => current.filter((item) => item !== interest));
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="text-lg font-extrabold text-slate-950">
          Learning Preferences
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Personalize your learning experience to match your goals and
          interests.
        </p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {/* Learning Goal */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-700">
            Learning Goal
          </label>

          <div className="relative">
            <select
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-xs font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
            >
              <option>Build a career in Web Development</option>
              <option>Learn for a promotion</option>
              <option>Build personal projects</option>
              <option>Learn a new skill</option>
            </select>

            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>

        {/* Skill level */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-700">
            Skill Level
          </label>

          <div className="relative">
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-xs font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>

            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>

        {/* Language */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-700">
            Preferred Language
          </label>

          <div className="relative">
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-xs font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Spanish</option>
            </select>

            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Interests */}
      <div className="mt-5">
        <label className="mb-2 block text-xs font-semibold text-slate-700">
          Interests
        </label>

        <div className="flex flex-wrap items-center gap-2">
          {interests.map((interest) => (
            <span
              key={interest}
              className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-[10px] font-semibold text-indigo-600"
            >
              {interest}

              <button
                type="button"
                onClick={() => removeInterest(interest)}
                className="transition hover:text-red-500"
              >
                <X size={12} />
              </button>
            </span>
          ))}

          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-semibold text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
          >
            <Plus size={12} />
            Add Interest
          </button>
        </div>
      </div>
    </section>
  );
}
