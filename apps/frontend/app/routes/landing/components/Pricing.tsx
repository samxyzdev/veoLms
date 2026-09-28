import { Check } from "lucide-react";
import { Link } from "react-router";

const plans = [
  {
    id: 1,
    name: "Free",
    description: "For learners getting started.",
    price: "$0",
    period: "/ forever",
    popular: false,
    features: [
      "Access to free courses",
      "Basic progress tracking",
      "Learning dashboard",
      "Community access",
    ],
  },
  {
    id: 2,
    name: "Pro",
    description: "For serious learners.",
    price: "$19",
    period: "/ month",
    popular: true,
    features: [
      "All premium courses",
      "Advanced progress analytics",
      "Certificates",
      "Unlimited learning",
      "Priority support",
    ],
  },
  {
    id: 3,
    name: "Teams",
    description: "For growing teams.",
    price: "$49",
    period: "/ user / month",
    popular: false,
    features: [
      "Everything in Pro",
      "Team learning dashboard",
      "Admin analytics",
      "Team progress reports",
      "Dedicated support",
    ],
  },
];

export function Pricing() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold text-indigo-600">
            Simple pricing
          </span>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Choose how you want to learn
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
            Start free and upgrade whenever you need more learning power.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl border p-7 ${
                plan.popular
                  ? "border-indigo-500 bg-indigo-600 text-white shadow-xl shadow-indigo-200"
                  : "border-slate-200 bg-white"
              }`}
            >
              {plan.popular && (
                <span className="absolute right-5 top-5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                  Most Popular
                </span>
              )}

              <p
                className={`text-sm font-bold ${
                  plan.popular ? "text-indigo-100" : "text-indigo-600"
                }`}
              >
                {plan.name}
              </p>

              <h3
                className={`mt-2 text-sm ${
                  plan.popular ? "text-indigo-100" : "text-slate-500"
                }`}
              >
                {plan.description}
              </h3>

              <div className="mt-7 flex items-end gap-1">
                <span className="text-4xl font-extrabold">{plan.price}</span>

                <span
                  className={`mb-1 text-xs ${
                    plan.popular ? "text-indigo-100" : "text-slate-400"
                  }`}
                >
                  {plan.period}
                </span>
              </div>

              <Link
                to="/signup"
                className={`mt-7 flex h-11 items-center justify-center rounded-xl text-sm font-bold transition ${
                  plan.popular
                    ? "bg-white text-indigo-600 hover:bg-indigo-50"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                Get started
              </Link>

              <div className="mt-7 space-y-4">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                        plan.popular
                          ? "bg-white/15 text-white"
                          : "bg-indigo-50 text-indigo-600"
                      }`}
                    >
                      <Check size={13} />
                    </span>

                    <span
                      className={`text-sm ${
                        plan.popular ? "text-indigo-50" : "text-slate-600"
                      }`}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
