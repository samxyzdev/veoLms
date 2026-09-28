import { ArrowRight, Play, Sparkles, Star } from "lucide-react";
import { Link } from "react-router";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background */}
      <div className="absolute left-1/2 top-[-180px] -z-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-100/60 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-16 md:px-10 lg:pb-32 lg:pt-24">
        <div className="relative z-10 grid items-center gap-16 lg:grid-cols-2">
          {/* Left */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-2 text-xs font-semibold text-indigo-600">
              <Sparkles size={14} />
              Learn smarter. Grow faster.
            </div>

            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Build skills that
              <span className="block text-indigo-600">move you forward.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-500 sm:text-lg">
              Learn practical skills from expert instructors, follow structured
              courses, and track your progress from one beautiful learning
              workspace.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                Start learning
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/explore-courses"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                <Play size={16} />
                Explore courses
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex -space-x-2">
                {["JD", "AS", "MK", "RP"].map((avatar) => (
                  <div
                    key={avatar}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[10px] font-bold text-slate-600"
                  >
                    {avatar}
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  Trusted by 10,000+ learners
                </p>
              </div>
            </div>
          </div>

          {/* Right dashboard preview */}
          <div className="relative">
            <div className="absolute -right-10 top-10 h-40 w-40 rounded-full bg-purple-200/50 blur-3xl" />

            <div className="relative rounded-[28px] border border-slate-200 bg-white p-3 shadow-2xl shadow-indigo-100/50">
              {/* Window top */}
              <div className="flex items-center gap-2 border-b border-slate-100 px-3 pb-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
              </div>

              <div className="grid grid-cols-[120px_1fr] gap-3 p-3">
                {/* Sidebar */}
                <div className="rounded-2xl bg-slate-50 p-3">
                  <div className="mb-5 flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-indigo-600" />
                    <div className="h-2 w-12 rounded-full bg-slate-200" />
                  </div>

                  {[1, 2, 3, 4, 5].map((item) => (
                    <div
                      key={item}
                      className={`mb-3 h-7 rounded-lg ${
                        item === 1 ? "bg-indigo-100" : "bg-transparent"
                      }`}
                    />
                  ))}
                </div>

                {/* Main mock dashboard */}
                <div className="space-y-3">
                  <div className="rounded-2xl bg-indigo-600 p-5">
                    <div className="h-2 w-24 rounded-full bg-white/40" />

                    <div className="mt-3 h-4 w-44 rounded-full bg-white/80" />

                    <div className="mt-2 h-2 w-32 rounded-full bg-white/30" />

                    <div className="mt-5 h-8 w-24 rounded-lg bg-white/20" />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {["12", "48", "7"].map((value) => (
                      <div
                        key={value}
                        className="rounded-xl border border-slate-100 bg-white p-3"
                      >
                        <div className="h-2 w-10 rounded-full bg-slate-200" />

                        <div className="mt-2 text-base font-bold text-slate-800">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-slate-100 p-4">
                    <div className="flex items-center justify-between">
                      <div className="h-2 w-24 rounded-full bg-slate-200" />
                      <div className="h-2 w-10 rounded-full bg-indigo-100" />
                    </div>

                    <div className="mt-5 flex h-28 items-end gap-2">
                      {[35, 50, 45, 70, 55, 80, 66].map((height, index) => (
                        <div
                          key={index}
                          className="flex-1 rounded-t-lg bg-indigo-200"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-5 -left-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
              <p className="text-[10px] font-medium text-slate-400">
                Weekly progress
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span className="text-xl font-extrabold text-slate-900">
                  76%
                </span>

                <span className="text-xs font-semibold text-emerald-500">
                  +12%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
