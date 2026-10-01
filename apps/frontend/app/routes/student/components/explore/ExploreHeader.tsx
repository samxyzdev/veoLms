import { ArrowRight, Play } from "lucide-react";
import { dashboardData } from "../../data/dashboardData";

export function ExploreHeader() {
  const { hero } = dashboardData.explore;

  return (
    <section>
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-xs">
        <span className="font-medium text-slate-400">Home</span>

        <span className="text-slate-300">›</span>

        <span className="font-semibold text-slate-900">Explore Courses</span>
      </div>

      {/* Page heading */}
      <div className="mb-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-[34px]">
          Explore Courses
        </h1>

        <p className="mt-1.5 text-sm text-slate-500">
          Discover new skills and advance your career with our expert-led
          courses.
        </p>
      </div>

      {/* Hero */}
      <div className="relative mb-5 min-h-[188px] overflow-hidden rounded-2xl bg-gradient-to-r from-[#eeedff] via-[#f4f1ff] to-[#e8edff]">
        {/* Decorative circles */}
        <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-violet-200/60" />

        <div className="absolute right-28 top-10 h-32 w-32 rounded-full bg-indigo-100/80" />

        <div className="absolute -bottom-16 right-52 h-36 w-36 rounded-full bg-white/60" />

        {/* Content */}
        <div className="relative z-10 max-w-[650px] px-7 py-7 sm:px-10 sm:py-8">
          <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1.5 text-[10px] font-bold text-indigo-600">
            {hero.badge}
          </span>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            {hero.title}
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            {hero.description}
          </p>

          <button
            type="button"
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Play size={14} />
            {hero.buttonText}
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Right illustration */}
        <div className="absolute bottom-0 right-8 hidden h-full w-[390px] md:block">
          {/* Glow */}
          <div className="absolute bottom-0 right-10 h-32 w-64 rounded-full bg-violet-200/70 blur-2xl" />

          {/* Laptop */}
          <div className="absolute bottom-5 right-10 h-20 w-40 rounded-xl border-4 border-slate-700 bg-slate-950 shadow-lg">
            <div className="absolute left-1/2 top-1/2 h-9 w-24 -translate-x-1/2 -translate-y-1/2 rounded-md bg-indigo-500/80" />
          </div>

          <div className="absolute bottom-1 right-1 h-3 w-56 rounded-full bg-slate-700" />

          {/* Person */}
          <div className="absolute bottom-14 right-28">
            {/* Head */}
            <div className="mx-auto h-12 w-12 rounded-full bg-[#f2b28c]" />

            {/* Hair */}
            <div className="absolute -left-1 top-[-4px] h-7 w-14 rounded-[50%] bg-slate-900" />

            {/* Body */}
            <div className="mt-1 h-24 w-24 rounded-t-[28px] bg-gradient-to-br from-violet-500 to-indigo-600" />

            {/* Arm */}
            <div className="absolute right-[-35px] top-12 h-8 w-12 rotate-[-20deg] rounded-full bg-[#f2b28c]" />

            {/* Laptop glow */}
            <div className="absolute bottom-5 left-1/2 h-8 w-12 -translate-x-1/2 rounded-lg bg-cyan-300/70 blur-md" />
          </div>

          {/* Floating icons */}
          <div className="absolute right-64 top-7 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500 text-white shadow-md">
            <Play size={17} fill="currentColor" />
          </div>

          <div className="absolute right-10 top-12 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-md">
            <span className="text-sm font-black">{"</>"}</span>
          </div>

          <div className="absolute bottom-14 right-0 h-8 w-8 rounded-full bg-amber-300" />
        </div>
      </div>
    </section>
  );
}
