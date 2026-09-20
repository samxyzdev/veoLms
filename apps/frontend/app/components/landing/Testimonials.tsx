import { QuoteIcon, StarIcon } from "./icons";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  avatarClassName: string;
  initials: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Learnova helped me launch my career in data science. The courses are practical, hands-on and easy to follow.",
    name: "Jamie Wilson",
    role: "Web Designer",
    avatarClassName: "from-amber-400 to-orange-500",
    initials: "JW",
  },
  {
    quote:
      "The instructors are amazing and the content is top-notch. Highly recommended for everyone.",
    name: "Chris Hawkins",
    role: "Product Manager",
    avatarClassName: "from-emerald-400 to-teal-600",
    initials: "CH",
  },
  {
    quote:
      "I love the lifetime access and practical projects. It's the best learning platform I've ever used.",
    name: "John Lenner",
    role: "Digital Marketer",
    avatarClassName: "from-sky-400 to-indigo-600",
    initials: "JL",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
      <h2 className="text-2xl font-bold text-white lg:text-3xl">
        Student Testimonials
      </h2>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <figure
            key={testimonial.name}
            className="rounded-xl border border-line bg-surface p-6"
          >
            <QuoteIcon className="size-8 text-brand" />
            <blockquote className="mt-4 text-sm leading-relaxed text-gray-300">
              “{testimonial.quote}”
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
              <span
                className={`flex size-9 items-center justify-center rounded-full bg-linear-to-br text-xs font-bold text-white ${testimonial.avatarClassName}`}
              >
                {testimonial.initials}
              </span>
              <div>
                <p className="text-sm font-semibold text-white">
                  {testimonial.name}
                </p>
                <p className="text-xs text-gray-500">{testimonial.role}</p>
              </div>
              <span className="ml-auto flex items-center gap-1 text-xs text-gray-400">
                <StarIcon className="size-3.5 text-amber-400" />5.0
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}