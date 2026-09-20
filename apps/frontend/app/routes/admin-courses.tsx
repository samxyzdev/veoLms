import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Route } from "./+types/admin-courses";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import {
  BookOpenIcon,
  CheckIcon,
  PlusIcon,
  ShoppingBagIcon,
  UsersIcon,
  XIcon,
} from "../components/landing/icons";
import {
  createCourse,
  getAdminCategories,
  getAdminCourses,
  type AdminCategory,
  type Course,
} from "../lib/api";
import { formatDate, formatPrice } from "../lib/format";
import { useAdmin } from "../lib/useAdmin";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Courses — Admin — Learnova" },
    {
      name: "description",
      content: "All courses on Learnova.",
    },
  ];
}

const adminNav = [
  { label: "Overview", icon: <UsersIcon className="size-4.5" />, to: "/admin" },
  { label: "Users", icon: <UsersIcon className="size-4.5" />, to: "/admin/users" },
  { label: "Courses", icon: <BookOpenIcon className="size-4.5" />, to: "/admin/courses" },
  { label: "Back to app", icon: <ShoppingBagIcon className="size-4.5" />, to: "/dashboard" },
];

const inputClasses =
  "w-full rounded-lg border border-line bg-base px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-brand";

export default function AdminCourses() {
  const { user, isLoading } = useAdmin();
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [categoriesError, setCategoriesError] = useState("");

  // --- Create-course form state ---
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [courseLanguage, setCourseLanguage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  /**
   * Load the options for the Category select. `isCancelled` lets the initial
   * effect skip state updates after unmount; the retry button calls it bare.
   */
  function loadCategories(isCancelled: () => boolean = () => false) {
    getAdminCategories()
      .then((list) => {
        if (isCancelled()) return;
        setCategories(list);
        setCategoriesError("");
      })
      .catch((error) => {
        if (isCancelled()) return;
        setCategories([]);
        setCategoriesError(
          error instanceof Error
            ? error.message
            : "Could not load categories. Please try again.",
        );
      });
  }

  useEffect(() => {
    let cancelled = false;

    // Courses and categories load separately: a failure in one shouldn't hide
    // the other.
    getAdminCourses()
      .then((list) => {
        if (cancelled) return;
        setCourses(list);
      })
      .catch(() => {
        if (cancelled) return;
        setCourses([]);
      });

    loadCategories(() => cancelled);

    return () => {
      cancelled = true;
    };
  }, []);

  /** Refresh the course list after creating one. */
  function refreshCourses() {
    getAdminCourses()
      .then((list) => setCourses(list))
      .catch(() => setCourses([]));
  }

  /** Create the course, then reload the list and reset the form. */
  async function handleCreateCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isCreating) return;

    setIsCreating(true);
    setCreateError("");
    try {
      await createCourse({
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        courseLanguage: courseLanguage.trim(),
        categoryId,
      });
      setShowForm(false);
      setTitle("");
      setDescription("");
      setPrice("");
      setCourseLanguage("");
      setCategoryId("");
      refreshCourses();
    } catch (error) {
      setCreateError(
        error instanceof Error ? error.message : "Could not create the course. Please try again.",
      );
    } finally {
      setIsCreating(false);
    }
  }

  // Wait for the session check — useAdmin redirects to /admin/login when
  // there's no valid session, so don't render the page before that.
  if (isLoading) return null;

  return (
    <DashboardLayout user={user} nav={adminNav}>
      {/* Heading row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white lg:text-3xl">Courses</h1>
          <p className="mt-1 text-sm text-gray-500">
            Every course on the platform.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((visible) => !visible)}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
        >
          {showForm ? <XIcon className="size-4" /> : <PlusIcon className="size-4" />}
          {showForm ? "Cancel" : "Create Course"}
        </button>
      </div>

      {/* Create-course form */}
      {showForm && (
        <form
          onSubmit={handleCreateCourse}
          className="mt-6 rounded-xl border border-line bg-surface p-5"
        >
          <h2 className="text-sm font-semibold text-white">New course</h2>
          <p className="mt-0.5 text-xs text-gray-500">
            Fill in the basics — sections and video content can be added later.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-gray-300">Title</span>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. React for Beginners"
                className={`${inputClasses} mt-2`}
                minLength={3}
                maxLength={255}
                required
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-gray-300">Description</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="What will students learn?"
                rows={3}
                maxLength={1000}
                className={`${inputClasses} mt-2 resize-none`}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-300">Price (₹)</span>
              <input
                type="number"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="e.g. 1299"
                min={0}
                step={1}
                className={`${inputClasses} mt-2`}
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-300">Language</span>
              <input
                type="text"
                value={courseLanguage}
                onChange={(event) => setCourseLanguage(event.target.value)}
                placeholder="e.g. English, Hindi"
                maxLength={50}
                className={`${inputClasses} mt-2`}
                required
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-gray-300">Category</span>
              <select
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                className={`${inputClasses} mt-2`}
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {categoriesError ? (
                <p className="mt-2 text-xs text-red-400">
                  {categoriesError}{" "}
                  <button
                    type="button"
                    onClick={() => loadCategories()}
                    className="font-semibold underline"
                  >
                    Retry
                  </button>
                </p>
              ) : (
                categories.length === 0 && (
                  <p className="mt-2 text-xs text-gray-500">Loading categories…</p>
                )
              )}
            </label>
          </div>

          {createError && (
            <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {createError}
            </p>
          )}

          <div className="mt-5 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isCreating ||
                !title.trim() ||
                !price ||
                Number(price) < 0 ||
                !courseLanguage.trim() ||
                !categoryId
              }
              className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brand"
            >
              {isCreating ? "Creating…" : "Create Course"}
              {!isCreating && <CheckIcon className="size-4" />}
            </button>
          </div>
        </form>
      )}

      {/* Courses table */}
      <div className="mt-6 overflow-hidden rounded-xl border border-line bg-surface">
        {courses === null ? (
          <p className="px-5 py-8 text-sm text-gray-500">Loading courses…</p>
        ) : courses.length === 0 ? (
          <p className="px-5 py-8 text-sm text-gray-500">
            No courses yet. Create your first course above.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-widest text-gray-500">
                  <th className="px-5 py-3 font-semibold">Title</th>
                  <th className="px-5 py-3 font-semibold">Language</th>
                  <th className="px-5 py-3 font-semibold">Price</th>
                  <th className="px-5 py-3 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-base/40">
                    <td className="max-w-md px-5 py-3">
                      <p className="truncate font-medium text-white">{course.title}</p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">
                        {course.description || "No description yet."}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-gray-400">{course.courseLanguage}</td>
                    <td className="px-5 py-3 font-semibold text-white">
                      {formatPrice(course.price)}
                    </td>
                    <td className="px-5 py-3 text-gray-400">{formatDate(course.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}