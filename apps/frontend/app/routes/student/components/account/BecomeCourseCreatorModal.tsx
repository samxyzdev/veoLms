import {
  BarChart3,
  BookOpen,
  Check,
  GraduationCap,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useRevalidator } from "react-router";
import { isAxiosError } from "axios";

import { api } from "~/lib/axios";

type BecomeCourseCreatorModalProps = {
  open: boolean;
  onClose: () => void;
};

export function BecomeCourseCreatorModal({
  open,
  onClose,
}: BecomeCourseCreatorModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const revalidator = useRevalidator();
  const navigate = useNavigate();

  /**
   * Reset modal state whenever it opens.
   */
  useEffect(() => {
    if (open) {
      setIsSubmitting(false);
      setSuccess(false);
      setErrorMessage("");
    }
  }, [open]);

  /**
   * Become a course creator.
   */
  const handleBecomeCourseCreator = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage("");

      /**
       * Backend identifies the current user from
       * the authenticated session/cookie.
       *
       * No userId is required in the request body.
       */
      const response = await api.patch("/user/course-creator/activate");

      console.log(response.data);

      /**
       * Re-run dashboard clientLoader().
       *
       * /user/me will be fetched again and Header
       * will receive the updated roles:
       *
       * ["student"]
       *       ↓
       * ["student", "course_creator"]
       */
      revalidator.revalidate();

      /**
       * Show success state.
       */
      setSuccess(true);
    } catch (error) {
      /**
       * Authentication/session error.
       */
      if (isAxiosError(error) && error.response?.status === 401) {
        navigate("/signin");
        return;
      }

      /**
       * Backend returned a known error.
       */
      if (isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            "Could not update your account. Please try again.",
        );

        return;
      }

      /**
       * Unknown error.
       */
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Go to course creator dashboard.
   */
  const handleGoToDashboard = () => {
    onClose();
    navigate("/course-creator");
  };

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        /**
         * Don't close when clicking inside the modal.
         */
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* =========================================
            SUCCESS STATE
        ========================================== */}
        {success ? (
          <div className="relative px-6 py-8 text-center">
            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Success icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Check size={32} />
            </div>

            {/* Title */}
            <h2 className="mt-5 text-xl font-bold text-slate-900">
              You're now a Course Creator!
            </h2>

            {/* Description */}
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your account has been upgraded successfully. You now have access
              to the Course Creator dashboard and can start creating your own
              courses.
            </p>

            {/* Dashboard button */}
            <button
              type="button"
              onClick={handleGoToDashboard}
              className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Go to Course Creator Dashboard
            </button>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        ) : (
          /* =========================================
             CONFIRMATION STATE
          ========================================== */
          <div className="relative">
            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="px-6 pt-7 text-center">
              {/* Icon */}
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <GraduationCap size={28} />
              </div>

              {/* Title */}
              <h2 className="mt-4 text-xl font-bold text-slate-900">
                Become a Course Creator
              </h2>

              {/* Description */}
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Start creating and publishing your own courses on Learnly. Your
                account will get access to the Course Creator dashboard.
              </p>
            </div>

            {/* Benefits */}
            <div className="mx-6 mt-5 space-y-3 rounded-xl bg-slate-50 p-4">
              {/* Create courses */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <BookOpen size={17} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">
                    Create and publish courses
                  </p>

                  <p className="text-xs text-slate-500">
                    Share your knowledge with learners
                  </p>
                </div>
              </div>

              {/* Reach learners */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <Users size={17} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">
                    Reach learners
                  </p>

                  <p className="text-xs text-slate-500">
                    Help students grow their skills
                  </p>
                </div>
              </div>

              {/* Manage courses */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <BarChart3 size={17} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">
                    Manage your courses
                  </p>

                  <p className="text-xs text-slate-500">
                    Track your content and performance
                  </p>
                </div>
              </div>
            </div>

            {/* Error */}
            {errorMessage && (
              <div className="mx-6 mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                <p className="text-center text-sm font-medium text-red-600">
                  {errorMessage}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 p-6">
              {/* Cancel */}
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              {/* Become creator */}
              <button
                type="button"
                onClick={handleBecomeCourseCreator}
                disabled={isSubmitting}
                className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Updating...
                  </span>
                ) : (
                  "Become a Course Creator"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
