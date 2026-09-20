import type { ReactNode } from "react";
import {
  ArrowRightIcon,
  BriefcaseIcon,
  CodeIcon,
  MegaphoneIcon,
  PaletteIcon,
} from "./icons";

type Course = {
  tag: string;
  tagClassName: string;
  title: string;
  subtitle: string;
  author: string;
  price: number;
  oldPrice: number;
  thumbClassName: string;
  icon: ReactNode;
};

const courses: Course[] = [
  {
    tag: "Design",
    tagClassName: "bg-sky-400/10 text-sky-400",
    title: "UI/UX Design Masterclass",
    subtitle: "Learn Figma From Scratch",
    author: "Darrell Steward",
    price: 49,
    oldPrice: 99,
    thumbClassName: "from-sky-500 to-blue-700",
    icon: <PaletteIcon className="size-12 text-white" />,
  },
  {
    tag: "Development",
    tagClassName: "bg-cyan-400/10 text-cyan-400",
    title: "Complete React Developer Course",
    subtitle: "Node.js & Modern JavaScript",
    author: "Cody Fisher",
    price: 59,
    oldPrice: 99,
    thumbClassName: "from-cyan-400 to-teal-600",
    icon: <CodeIcon className="size-12 text-white" />,
  },
  {
    tag: "Marketing",
    tagClassName: "bg-fuchsia-400/10 text-fuchsia-400",
    title: "Digital Marketing Bootcamp 2024",
    subtitle: "SEO, Ads & Analytics",
    author: "Devon Lane",
    price: 59,
    oldPrice: 79,
    thumbClassName: "from-fuchsia-500 to-purple-700",
    icon: <MegaphoneIcon className="size-12 text-white" />,
  },
  {
    tag: "Business",
    tagClassName: "bg-orange-400/10 text-orange-400",
    title: "Financial Analysis for Beginners",
    subtitle: "Fundamentals & Modeling",
    author: "Esther Howard",
    price: 29,
    oldPrice: 49,
    thumbClassName: "from-orange-400 to-red-600",
    icon: <BriefcaseIcon className="size-12 text-white" />,
  },
];

export function FeaturedCourses() {
  return (
    <section id="featured-courses" className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-bold text-white lg:text-3xl">
          Featured Courses
        </h2>
        <a
          href="#categories"
          className="flex items-center gap-1.5 text-sm font-medium text-brand-light transition hover:text-white"
        >
          View all courses
          <ArrowRightIcon className="size-4" />
        </a>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {courses.map((course) => (
          <article
            key={course.title}
            className="overflow-hidden rounded-xl border border-line bg-surface transition hover:border-brand/50"
          >
            <div
              className={`flex h-40 items-center justify-center bg-linear-to-br ${course.thumbClassName}`}
            >
              {course.icon}
            </div>
            <div className="p-4">
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${course.tagClassName}`}
              >
                {course.tag}
              </span>
              <h3 className="mt-3 text-base font-semibold leading-snug text-white">
                {course.title}
              </h3>
              <p className="mt-1 text-sm text-gray-400">{course.subtitle}</p>
              <p className="mt-1 text-xs text-gray-500">{course.author}</p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-base font-bold text-white">
                  ${course.price}.00
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${course.oldPrice}.00
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}