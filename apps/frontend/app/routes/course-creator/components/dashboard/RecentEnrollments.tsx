import { ArrowRight } from "lucide-react";
import { Link, useOutletContext } from "react-router";

type RecentEnrollment = {
  id: string;
  student: string;
  email: string;
  course: string;
  date: string;
  status: string;
};

type CourseCreatorStats = {
  totalCourses: number;
  totalStudents: number;
  totalPurchases: number;
  totalRevenue: number;

  enrollmentOverview: {
    month: string;
    value: number;
  }[];

  popularCourses: {
    id: string;
    title: string;
    enrollments: number;
    rank: number;
  }[];

  recentEnrollments: RecentEnrollment[];
};

type CourseCreatorContext = {
  user: unknown;
  stats: CourseCreatorStats;
};

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U"
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function RecentEnrollments() {
  const { stats } = useOutletContext<CourseCreatorContext>();

  const enrollments = stats.recentEnrollments ?? [];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-950">
            Recent Enrollments
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Latest students joining your courses.
          </p>
        </div>

        <Link
          to="/course-creator/enrollments"
          className="flex items-center gap-1 text-xs font-bold text-indigo-600"
        >
          View All
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Empty State */}
      {enrollments.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm font-semibold text-slate-500">
            No recent enrollments
          </p>

          <p className="mt-1 text-xs text-slate-400">
            New students will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-left">
                  <th className="pb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Student
                  </th>

                  <th className="pb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Course
                  </th>

                  <th className="pb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Date
                  </th>

                  <th className="pb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {enrollments.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-50 last:border-0"
                  >
                    {/* Student */}
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-[9px] font-bold text-indigo-600">
                          {getInitials(item.student)}
                        </div>

                        <div>
                          <p className="text-[11px] font-bold text-slate-900">
                            {item.student}
                          </p>

                          <p className="mt-0.5 text-[9px] text-slate-400">
                            {item.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Course */}
                    <td className="py-3">
                      <span className="text-[10px] font-medium text-slate-600">
                        {item.course}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3">
                      <span className="text-[10px] text-slate-500">
                        {formatDate(item.date)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3">
                      <span className="rounded-lg bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="space-y-2 md:hidden">
            {enrollments.map((item) => (
              <div key={item.id} className="rounded-xl bg-slate-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-[9px] font-bold text-indigo-600">
                    {getInitials(item.student)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-slate-900">
                      {item.student}
                    </p>

                    <p className="truncate text-[9px] text-slate-400">
                      {item.course}
                    </p>
                  </div>

                  <span className="rounded-lg bg-emerald-50 px-2 py-1 text-[8px] font-bold text-emerald-600">
                    {item.status}
                  </span>
                </div>

                <div className="mt-2 flex justify-between text-[9px] text-slate-400">
                  <span>{item.email}</span>

                  <span>{formatDate(item.date)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
