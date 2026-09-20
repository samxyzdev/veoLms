import { useState } from "react";
import { ChevronDownIcon } from "./icons";

const faqs = [
  {
    question: "What is Learnova?",
    answer:
      "Learnova is an online learning platform offering premium courses across design, development, marketing, business and more — all taught by industry experts.",
  },
  {
    question: "Are the courses certificate or accredited?",
    answer:
      "Every course includes a certificate of completion that you can add to your resume or LinkedIn profile to showcase your new skills.",
  },
  {
    question: "Can I get a refund if I'm not satisfied?",
    answer:
      "Yes — we offer a 30-day money-back guarantee on every plan. If it's not the right fit, we'll refund you in full, no questions asked.",
  },
  {
    question: "Do I get lifetime access to my courses?",
    answer:
      "Absolutely. Once you enroll, you keep access to the course and all future updates forever — no recurring fees.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-16 lg:py-20">
      <h2 className="text-center text-2xl font-bold text-white lg:text-3xl">
        Frequently Asked Questions
      </h2>

      <div className="mt-8 divide-y divide-line rounded-xl border border-line bg-surface">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={faq.question}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-sm font-semibold text-white">
                  {faq.question}
                </span>
                <ChevronDownIcon
                  className={`size-4 shrink-0 text-gray-400 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <p className="px-5 pb-5 text-sm leading-relaxed text-gray-400">
                  {faq.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}