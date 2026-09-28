import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Aarav Mehta",
    role: "Frontend Developer",
    avatar: "AM",
    review:
      "Learnly helped me create a consistent learning routine. The progress tracking makes it really easy to see how far I've come.",
  },
  {
    id: 2,
    name: "Sarah Wilson",
    role: "Product Designer",
    avatar: "SW",
    review:
      "The courses are easy to follow and the dashboard gives me everything I need without making the experience complicated.",
  },
  {
    id: 3,
    name: "Daniel Kim",
    role: "Software Engineer",
    avatar: "DK",
    review:
      "I love being able to switch between courses and continue exactly where I stopped. It feels like having my own learning workspace.",
  },
];

export function Testimonial() {
  return (
    <section className="bg-[#f8f9fc] py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold text-indigo-600">
            Learner stories
          </span>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Loved by learners
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
            See how people are using Learnly to build better learning habits.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <Quote size={26} className="text-indigo-200" />

              <div className="mt-4 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className="fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              <p className="mt-5 text-sm leading-6 text-slate-600">
                "{testimonial.review}"
              </p>

              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                  {testimonial.avatar}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {testimonial.name}
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
