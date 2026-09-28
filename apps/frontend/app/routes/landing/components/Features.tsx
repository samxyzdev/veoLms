import {
  Award,
  BarChart3,
  BookOpen,
  Clock3,
  PlayCircle,
  Users,
} from "lucide-react";

const features = [
  {
    id: 1,
    icon: BookOpen,
    title: "Learn from experts",
    description:
      "Access structured courses created by instructors with real-world experience.",
  },
  {
    id: 2,
    icon: PlayCircle,
    title: "Learn at your pace",
    description:
      "Watch lessons whenever you want and continue exactly where you stopped.",
  },
  {
    id: 3,
    icon: BarChart3,
    title: "Track your progress",
    description:
      "See your course completion, learning streaks, goals, and activity in one place.",
  },
  {
    id: 4,
    icon: Award,
    title: "Earn certificates",
    description:
      "Complete courses and showcase your newly acquired skills with certificates.",
  },
  {
    id: 5,
    icon: Clock3,
    title: "Flexible learning",
    description:
      "Build a learning routine around your schedule without fixed classroom hours.",
  },
  {
    id: 6,
    icon: Users,
    title: "Learn with a community",
    description:
      "Connect with other learners and grow together throughout your journey.",
  },
];

export function Features() {
  return (
    <section className="bg-[#f8f9fc] py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold text-indigo-600">
            Everything you need
          </span>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            A better way to learn
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
            Everything is designed to keep your learning experience simple,
            focused, and motivating.
          </p>
        </div>

        {/* Features */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.id}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                  <Icon size={22} />
                </div>

                <h3 className="mt-5 text-base font-bold text-slate-950">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
