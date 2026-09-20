import { ArrowRightIcon } from "./icons";

const stats = [
  { value: "10K+", label: "Courses" },
  { value: "50K+", label: "Students" },
  { value: "200+", label: "Instructors" },
];

const chartBars = [35, 55, 45, 70, 60, 85, 75, 100];

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        {/* Copy */}
        <div>
          <span className="inline-flex items-center rounded-full bg-brand-ink px-4 py-1.5 text-xs font-semibold tracking-widest text-brand-light">
            Learn Without Limits
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-[1.1] tracking-tight text-white lg:text-6xl">
            Learn Smarter.
            <br />
            Achieve Greater.
          </h1>

          <p className="mt-5 max-w-md text-lg leading-relaxed text-gray-400">
            Discover premium courses taught by industry experts. Learn at your
            own pace and build skills that matter.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#featured-courses"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover"
            >
              Browse Courses
              <ArrowRightIcon className="size-4" />
            </a>
            <a
              href="#why-us"
              className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-gray-200 transition hover:border-gray-500 hover:text-white"
            >
              How it works
            </a>
          </div>

          <div className="mt-10 flex max-w-md items-center justify-between gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="flex-1">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="mt-0.5 text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Progress card */}
        <div className="relative">
          <div className="rounded-2xl border border-line bg-surface p-6">
            <p className="text-sm text-gray-400">Your Progress</p>

            <div className="mt-4 flex items-end gap-3">
              <span className="text-5xl font-bold text-white">70%</span>
              <span className="mb-2 text-sm text-gray-500">Keep going</span>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-line">
              <div className="h-full w-[70%] rounded-full bg-brand" />
            </div>

            {/* Mini bar-chart illustration */}
            <div className="mt-10 flex h-24 items-end justify-center gap-3">
              {chartBars.map((height, index) => (
                <div
                  key={index}
                  style={{ height: `${height}%` }}
                  className={
                    index === chartBars.length - 1
                      ? "w-3 rounded-t-sm bg-brand-light"
                      : "w-3 rounded-t-sm bg-brand"
                  }
                />
              ))}
            </div>
          </div>

          {/* Floating goal card */}
          <div className="absolute -bottom-10 right-6 rounded-2xl border border-line bg-surface p-5 shadow-2xl shadow-black/40">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Goal
            </p>
            <p className="mt-1 text-3xl font-bold text-white">50K</p>
            <p className="mt-0.5 text-xs text-gray-500">Happy learners</p>
          </div>
        </div>
      </div>
    </section>
  );
}