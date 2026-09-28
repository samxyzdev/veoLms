export function MyLearningHeader() {
  return (
    <section className="relative mb-5 overflow-hidden">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-20 -top-32 h-72 w-72 rounded-full bg-indigo-100/50 blur-3xl" />

      <div className="pointer-events-none absolute right-32 top-5 h-56 w-[420px] rotate-[-12deg] rounded-[50%] bg-violet-50/80 blur-2xl" />

      <div className="relative">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-xs">
          <span className="font-medium text-slate-400">Home</span>

          <span className="text-slate-300">›</span>

          <span className="font-semibold text-slate-900">My Learning</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-[34px]">
          My Learning
        </h1>

        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
          Access all your enrolled courses, track progress, and continue
          learning at your own pace.
        </p>
      </div>
    </section>
  );
}
