import { ArrowRightIcon, StarIcon } from "./icons";

type Instructor = {
  name: string;
  role: string;
  rating: string;
  reviews: string;
  avatarClassName: string;
  initials: string;
};

const instructors: Instructor[] = [
  {
    name: "Darrell Steward",
    role: "Full Stack Developer",
    rating: "4.9",
    reviews: "3.2k",
    avatarClassName: "from-amber-400 to-orange-500",
    initials: "DS",
  },
  {
    name: "Cody Fisher",
    role: "UX/UI Designer",
    rating: "4.8",
    reviews: "2.7k",
    avatarClassName: "from-emerald-400 to-teal-600",
    initials: "CF",
  },
  {
    name: "Devon Lane",
    role: "Digital Marketer",
    rating: "4.9",
    reviews: "2.2k",
    avatarClassName: "from-sky-400 to-indigo-600",
    initials: "DL",
  },
  {
    name: "Esther Howard",
    role: "Data Scientist",
    rating: "4.8",
    reviews: "2.1k",
    avatarClassName: "from-fuchsia-400 to-purple-600",
    initials: "EH",
  },
  {
    name: "Theresa Webb",
    role: "Business Coach",
    rating: "4.9",
    reviews: "2.0k",
    avatarClassName: "from-rose-400 to-pink-600",
    initials: "TW",
  },
];

export function TopInstructors() {
  return (
    <section id="instructors" className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-bold text-white lg:text-3xl">
          Top Instructors
        </h2>
        <a
          href="#featured-courses"
          className="flex items-center gap-1.5 text-sm font-medium text-brand-light transition hover:text-white"
        >
          View all instructors
          <ArrowRightIcon className="size-4" />
        </a>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {instructors.map((instructor) => (
          <div
            key={instructor.name}
            className="rounded-xl border border-line bg-surface p-5 text-center transition hover:border-brand/50"
          >
            <span
              className={`mx-auto flex size-14 items-center justify-center rounded-full bg-linear-to-br text-sm font-bold text-white ${instructor.avatarClassName}`}
            >
              {instructor.initials}
            </span>
            <h3 className="mt-3 text-sm font-semibold text-white">
              {instructor.name}
            </h3>
            <p className="mt-0.5 text-xs text-gray-500">{instructor.role}</p>
            <p className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-400">
              <StarIcon className="size-3.5 text-amber-400" />
              {instructor.rating}
              <span className="text-gray-500">({instructor.reviews})</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}