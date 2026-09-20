import { useState } from "react";
import { Link } from "react-router";

import { CheckIcon } from "./icons";

type BillingCycle = "monthly" | "yearly";

type Plan = {
  name: string;
  monthlyPrice: number;
  features: string[];
  popular?: boolean;
};

const plans: Plan[] = [
  {
    name: "Basic",
    monthlyPrice: 19,
    features: [
      "Access to 100 Courses",
      "Community Access",
      "Course Completion Certificate",
    ],
  },
  {
    name: "Pro",
    monthlyPrice: 39,
    popular: true,
    features: [
      "Access to 500 Courses",
      "Priority Support",
      "Offline Download",
    ],
  },
  {
    name: "Premium",
    monthlyPrice: 79,
    features: [
      "Access to All Courses",
      "1-on-1 Mentoring",
      "Certified Courses",
    ],
  },
];

export function Pricing() {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white lg:text-3xl">
          Choose Your Plan
        </h2>

        {/* Billing toggle */}
        <div className="mx-auto mt-6 inline-flex items-center rounded-full border border-line bg-surface p-1">
          {(["monthly", "yearly"] as BillingCycle[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setCycle(option)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
                cycle === option
                  ? "bg-brand text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {option === "yearly" ? "Yearly (Save 30%)" : "Monthly"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {plans.map((plan) => {
          const price =
            cycle === "yearly"
              ? Math.round(plan.monthlyPrice * 0.7)
              : plan.monthlyPrice;

          return (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-xl border p-6 ${
                plan.popular
                  ? "border-brand bg-brand/10"
                  : "border-line bg-surface"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-0.5 text-xs font-semibold text-white">
                  Most Popular
                </span>
              )}

              <h3 className="text-base font-semibold text-white">{plan.name}</h3>

              <p className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">${price}</span>
                <span className="text-sm text-gray-500">/month</span>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {cycle === "yearly" ? "billed annually" : "billed monthly"}
              </p>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm text-gray-300">
                    <CheckIcon className="size-4 shrink-0 text-brand-light" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to="/signup"
                className={`mt-8 rounded-full px-5 py-2.5 text-center text-sm font-semibold transition ${
                  plan.popular
                    ? "bg-brand text-white hover:bg-brand-hover"
                    : "border border-line text-white hover:border-brand/60"
                }`}
              >
                Get Started
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}