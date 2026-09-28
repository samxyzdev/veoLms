import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  imageSide?: boolean;
}

export function AuthLayout({
  children,
  title,
  description,
  imageSide = true,
}: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-[#f7f8fc]">
      <div className="mx-auto flex min-h-screen max-w-[1500px]">
        {/* Left Content */}
        <div className="flex w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-1/2 lg:px-16">
          <div className="w-full max-w-[460px]">
            {/* Logo */}
            <div className="mb-10 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <span className="text-lg font-extrabold">L</span>
              </div>

              <span className="text-xl font-extrabold tracking-tight text-slate-950">
                Learnly
              </span>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                {title}
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {description}
              </p>
            </div>

            {children}
          </div>
        </div>

        {/* Right Visual */}
        {imageSide && (
          <div className="relative hidden w-1/2 overflow-hidden bg-indigo-600 lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-sky-500" />

            <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

            <div className="absolute -bottom-20 right-0 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl" />

            <div className="relative flex h-full items-center justify-center p-16">
              <div className="max-w-md text-white">
                <div className="mb-8 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur">
                  Learn smarter. Grow faster.
                </div>

                <h2 className="text-5xl font-extrabold leading-[1.08] tracking-tight">
                  Your skills can take you anywhere.
                </h2>

                <p className="mt-6 text-base leading-7 text-indigo-100">
                  Learn practical skills, build projects, track your progress,
                  and turn your learning goals into real results.
                </p>

                {/* Mini Stats */}
                <div className="mt-10 grid grid-cols-3 gap-3">
                  {[
                    ["10K+", "Learners"],
                    ["250+", "Courses"],
                    ["4.9", "Rating"],
                  ].map(([value, label]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur"
                    >
                      <p className="text-xl font-bold">{value}</p>

                      <p className="mt-1 text-xs text-indigo-100">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
