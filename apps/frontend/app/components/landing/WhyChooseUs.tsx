import type { ReactNode } from "react";
import {
  AwardIcon,
  BadgeCheckIcon,
  ClockIcon,
  InfinityIcon,
} from "./icons";

type Feature = {
  title: string;
  text: string;
  icon: ReactNode;
};

const features: Feature[] = [
  {
    title: "Expert Instructors",
    text: "Learn from industry professionals with years of hands-on experience.",
    icon: <AwardIcon className="size-6" />,
  },
  {
    title: "Flexible Learning",
    text: "Study at your own pace with access to every course, anytime.",
    icon: <ClockIcon className="size-6" />,
  },
  {
    title: "Lifetime Access",
    text: "Get lifetime access to courses and future updates — one purchase.",
    icon: <InfinityIcon className="size-6" />,
  },
  {
    title: "Certificate of Completion",
    text: "Earn a certificate for every course you complete to showcase your skills.",
    icon: <BadgeCheckIcon className="size-6" />,
  },
];

export function WhyChooseUs() {
  return (
    <section id="why-us" className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
      <h2 className="text-center text-2xl font-bold text-white lg:text-3xl">
        Why Choose Us
      </h2>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-xl border border-line bg-surface p-6 transition hover:border-brand/50"
          >
            <span className="flex size-11 items-center justify-center rounded-lg bg-brand-ink text-brand-light">
              {feature.icon}
            </span>
            <h3 className="mt-4 text-base font-semibold text-white">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-400">
              {feature.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}