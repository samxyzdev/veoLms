import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  CirclePlay,
  Clock3,
  ExternalLink,
  FileText,
  FolderOpen,
  GripVertical,
  Layers,
  Pencil,
  Plus,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router";

import { formatCourseLevel, type CourseLevel } from "~/lib/course";

export type CourseContentViewCourse = {
  id: string;
  title: string | null;
  description: string | null;
  categoryId: string | null;
  courseLanguage: string | null;
  level: CourseLevel | null;
  status: "draft" | "published" | "private" | "archived";
  thumbnailUrl: string | null;
};

export type CourseContentViewSection = {
  id: string;
  title: string;
  sequenceOrder: number;
  contents: {
    id: string;
    title: string;
    contentType: string;
    sequenceOrder: number;
  }[];
};

type CourseContentOverviewProps = {
  course: CourseContentViewCourse;
  categoryName: string;
  sections: CourseContentViewSection[];
};

function getInitials(title: string | null) {
  if (!title?.trim()) return "CO";

  return title
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function getStatusStyles(status: CourseContentViewCourse["status"]) {
  switch (status) {
    case "published":
      return "bg-emerald-50 text-emerald-700";
    case "draft":
      return "bg-amber-50 text-amber-700";
    case "private":
      return "bg-blue-50 text-blue-700";
    case "archived":
      return "bg-slate-100 text-slate-600";
  }
}

function getStatusLabel(status: CourseContentViewCourse["status"]) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getLessonIcon(contentType: string) {
  switch (contentType.toLowerCase()) {
    case "video":
      return CirclePlay;
    case "article":
      return FileText;
    default:
      return FolderOpen;
  }
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold leading-tight text-slate-900">{value}</p>
        <p className="mt-1 truncate text-xs font-medium text-slate-500">{label}</p>
      </div>
    </div>
  );
}

export default function CourseContentOverview({
  course,
  categoryName,
  sections,
}: CourseContentOverviewProps) {
  const [openSections, setOpenSections] = useState<string[]>(() =>
    sections[0] ? [sections[0].id] : [],
  );
  const title = course.title?.trim() || "Untitled Course";
  const lessonCount = sections.reduce(
    (total, section) => total + section.contents.length,
    0,
  );
  const editHref = `/course-creator/courses/${course.id}/edit`;
  const editContentHref = `${editHref}?step=2`;

  function toggleSection(sectionId: string) {
    setOpenSections((current) =>
      current.includes(sectionId)
        ? current.filter((id) => id !== sectionId)
        : [...current, sectionId],
    );
  }

  return (
    <main className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-[1600px] px-5 py-6 md:px-8 lg:px-10">
        <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link to="/course-creator" className="transition-colors hover:text-slate-900">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/course-creator/courses" className="transition-colors hover:text-slate-900">
            Courses
          </Link>
          <span aria-hidden="true">/</span>
          <span className="max-w-[180px] truncate">{title}</span>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="font-medium text-slate-900">
            Content
          </span>
        </nav>

        <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              {title}
            </h1>
            <p className="mt-1 text-sm text-slate-500 md:text-base">
              View and manage your course content, sections and lectures.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {course.status === "published" ? (
              <Link
                to={`/dashboard/explore-courses/${course.id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <ExternalLink className="h-4 w-4" />
                Preview Course
              </Link>
            ) : (
              <button
                type="button"
                disabled
                title="Publish the course to preview it."
                className="inline-flex h-10 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-400 shadow-sm"
              >
                <ExternalLink className="h-4 w-4" />
                Preview Course
              </button>
            )}
            <Link
              to={editHref}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <Pencil className="h-4 w-4" />
              Edit Course
            </Link>
          </div>
        </div>

        <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-extrabold text-white">
              {course.thumbnailUrl ? (
                <img
                  src={course.thumbnailUrl}
                  alt={`${title} course thumbnail`}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(course.title)
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">{title}</h2>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusStyles(course.status)}`}>
                  {getStatusLabel(course.status)}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  {categoryName}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {formatCourseLevel(course.level, "All Levels")}
                </span>
                {course.courseLanguage && <span>{course.courseLanguage}</span>}
              </div>

              <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-500">
                {course.description?.trim() || "No course description has been added yet."}
              </p>
            </div>
          </div>
        </section>

        <section aria-label="Course statistics" className="mb-7 grid grid-cols-2 gap-3 xl:grid-cols-4">
          <StatCard icon={Layers} label="Sections" value={sections.length} />
          <StatCard icon={CirclePlay} label="Lectures" value={lessonCount} />
          <StatCard icon={Clock3} label="Total Duration" value="—" />
          <StatCard icon={Users} label="Enrolled Students" value="—" />
        </section>

        <section>
          <div className="mb-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              Course Curriculum <span className="ml-1 text-sm font-medium text-slate-500">({sections.length} Sections)</span>
            </h2>
            <Link
              to={editContentHref}
              className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              Add Section
            </Link>
          </div>

          {sections.length > 0 ? (
            <div className="space-y-2.5">
              {sections.map((section, sectionIndex) => {
                const isOpen = openSections.includes(section.id);

                return (
                  <section key={section.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => toggleSection(section.id)}
                      className="flex w-full items-center gap-3 px-3.5 py-3.5 text-left transition hover:bg-slate-50 sm:px-4"
                    >
                      <GripVertical className="hidden h-4 w-4 shrink-0 text-slate-400 sm:block" />
                      <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${isOpen ? "rotate-0" : "-rotate-90"}`} />
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900">
                        {sectionIndex + 1}. {section.title}
                      </span>
                      <span className="shrink-0 text-xs text-slate-500">
                        {section.contents.length} {section.contents.length === 1 ? "lecture" : "lectures"}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="border-t border-slate-100">
                        {section.contents.length > 0 ? (
                          <div className="divide-y divide-slate-100 px-3 sm:px-3.5">
                            {section.contents.map((content, lessonIndex) => {
                              const LessonIcon = getLessonIcon(content.contentType);

                              return (
                                <div key={content.id} className="flex min-w-0 items-center gap-3 py-3">
                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                                    <LessonIcon className="h-4 w-4" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-slate-800">
                                      {lessonIndex + 1}. {content.title}
                                    </p>
                                    <p className="mt-0.5 text-xs capitalize text-slate-500">
                                      {content.contentType}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="px-4 py-4 text-sm text-slate-500">No lectures in this section yet.</p>
                        )}

                        <Link
                          to={editContentHref}
                          className="inline-flex items-center gap-1.5 px-4 py-3 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                        >
                          <Plus className="h-4 w-4" />
                          Add Lecture
                        </Link>
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-900">No course content yet</h3>
              <p className="mt-1 text-sm text-slate-500">Add a section to start building this course.</p>
              <Link
                to={editContentHref}
                className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                Add Section
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
