import axios, { isAxiosError } from "axios";

import { useEffect, useMemo, useRef, useState } from "react";

import type { ChangeEvent } from "react";

import { BarChart3, Check, CheckCircle2, CircleHelp, Folder, Globe, Info, Plus, Send, Trash2, Upload, X } from "lucide-react";

import { redirect, useLoaderData } from "react-router";

import CourseContent from "../../../components/courses/content/CourseContent";

import PricingAccess from "../../../components/courses/pricing/PricingAccess";

import ReviewPublish from "../../../components/courses/review/ReviewPublish";

import { api } from "~/lib/axios";
import { COURSE_LEVEL_OPTIONS, formatCourseLevel, getCourseLevelValue, type CourseLevel } from "~/lib/course";
import { CourseFormSelect as SelectField } from "~/components/forms/CourseFormSelect";

// =========================================================
// TYPES
// =========================================================

type Step = {
  id: number;
  title: string;
  description: string;
};

type CourseStatus = "draft" | "published" | "private" | "archived";

type Category = {
  id: string;
  name: string;
};

type CourseContentItem = {
  id: string;
  sectionId: string;
  title: string;
  contentType: string;
  contentUrl: string | null;
  sequenceOrder: number;
  createdAt: string;
  updatedAt: string;
};

type CourseSection = {
  id: string;
  courseId: string;
  title: string;
  sequenceOrder: number;
  createdAt: string;
  updatedAt: string;
  contents: CourseContentItem[];
};

type LearningOutcomeResponse = {
  id: string;
  courseId: string;
  text: string;
  sequenceOrder: number;
  createdAt: string;
  updatedAt: string;
};

type Course = {
  id: string;
  title: string | null;
  description: string | null;
  price: number | null;
  createdBy: string;
  categoryId: string | null;
  courseLanguage: string | null;
  status: CourseStatus;
  publishedAt: string | null;
  archivedAt: string | null;
  level: CourseLevel | null;
  thumbnailUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

type LoaderData = {
  course: Course;
  learningOutcomes: string[];
  categories: Category[];
  sections: CourseSection[];
};

type SaveState = "idle" | "unsaved" | "saving" | "saved" | "error";

type DirtyField = "title" | "description" | "categoryId" | "courseLanguage" | "level" | "price" | "learningOutcomes";

type UpdateCoursePayload = {
  title?: string;
  description?: string;
  categoryId?: string;
  courseLanguage?: string;
  level?: CourseLevel;
  price?: number;
  thumbnailUrl?: string | null;
  learningOutcomes?: string[];
};

// =========================================================
// CONSTANTS
// =========================================================

const steps: Step[] = [
  {
    id: 1,
    title: "Basic Information",
    description: "Course details and preview",
  },
  {
    id: 2,
    title: "Course Content",
    description: "Add sections and lessons",
  },
  {
    id: 3,
    title: "Pricing & Access",
    description: "Set price and availability",
  },
  {
    id: 4,
    title: "Review & Publish",
    description: "Preview and publish course",
  },
];

const tips = [
  "Use a clear and descriptive title",
  "Write a compelling description",
  "Choose the right category and level",
  "Upload a high-quality thumbnail (1280 × 720px)",
  "Add at least 3 learning outcomes",
  "Be specific and student-focused",
];

const defaultOutcomes = [""];

const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024;

const ALLOWED_THUMBNAIL_TYPES = ["image/png", "image/jpeg", "image/webp"];

// =========================================================
// HELPERS
// =========================================================

function getUiLevel(level: CourseLevel | null) {
  return formatCourseLevel(level, "");
}

function getCategoryName(categoryId: string | null, categories: Category[]) {
  if (!categoryId) return "";

  return categories.find((item) => item.id === categoryId)?.name ?? "";
}

// =========================================================
// COURSE THUMBNAIL
// =========================================================

function CourseThumbnail({ title, preview, onRemove, disabled = false }: { title: string; preview: string | null; onRemove: () => void; disabled?: boolean }) {
  if (preview) {
    return (
      <div className="relative h-[122px] overflow-hidden rounded-xl">
        <img src={preview} alt="Course thumbnail" className="h-full w-full object-cover" />

        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-700 shadow-md transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex h-[122px] overflow-hidden rounded-xl bg-[#03182d]">
      <div className="absolute -left-4 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full border-[5px] border-cyan-400/90" />

      <div className="absolute left-7 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full border-[5px] border-cyan-400/80" />

      <div className="absolute left-12 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-cyan-400" />

      <div className="relative ml-auto flex w-[58%] flex-col justify-center px-5">
        <p className="text-[24px] font-bold leading-tight text-white">{title || "React"}</p>

        <p className="mt-1 text-[22px] font-semibold leading-tight text-cyan-400">for Beginners</p>
      </div>

      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-700 shadow-md transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// =========================================================
// STEP PROGRESS
// =========================================================

function StepProgress({ currentStep, onStepChange, disabled = false }: { currentStep: number; onStepChange: (step: number) => void; disabled?: boolean }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;

          const isCompleted = currentStep > step.id;

          const canGoBack = step.id < currentStep && !disabled;

          return (
            <button
              key={step.id}
              type="button"
              aria-disabled={!canGoBack}
              onClick={() => {
                if (canGoBack) {
                  onStepChange(step.id);
                }
              }}
              className={`relative flex items-center gap-4 px-6 py-5 text-left transition ${canGoBack ? "cursor-pointer hover:bg-slate-50" : "cursor-default"}`}
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-semibold ${
                  isActive ? "bg-violet-600 text-white shadow-lg shadow-violet-200" : isCompleted ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-500"
                }`}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : step.id}
              </div>

              <div className="min-w-0">
                <p className={`text-sm font-semibold ${isActive || isCompleted ? "text-violet-700" : "text-slate-700"}`}>{step.title}</p>

                <p className="mt-0.5 text-xs text-slate-400">{step.description}</p>
              </div>

              {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600" />}

              {index !== steps.length - 1 && <div className="absolute right-0 top-1/2 hidden h-8 w-px -translate-y-1/2 bg-slate-100 md:block" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// =========================================================
// LOADER
// =========================================================

export async function clientLoader({ params }: { params: Record<string, string | undefined> }): Promise<LoaderData> {
  const courseId = params.courseId;

  if (!courseId) {
    throw new Response("Course ID is required.", {
      status: 400,
    });
  }

  try {
    const [courseResponse, categoriesResponse] = await Promise.all([api.get(`/course-creator/courses/${courseId}`), api.get("/course-creator/courses/categories")]);

    const responseData = courseResponse.data?.data;

    const course = responseData?.course as Course | undefined;

    const rawLearningOutcomes = (responseData?.learningOutcomes ?? []) as LearningOutcomeResponse[];

    /*
     * Backend:
     *
     * learningOutcomes: [
     *   {
     *     id,
     *     text,
     *     sequenceOrder,
     *     ...
     *   }
     * ]
     *
     * Editor ko:
     *
     * ["Learn React", "Build apps"]
     *
     * chahiye.
     */
    const learningOutcomes = rawLearningOutcomes
      .slice()
      .sort((a, b) => a.sequenceOrder - b.sequenceOrder)
      .map((outcome) => outcome.text);

    const sections = (responseData?.sections ?? []) as CourseSection[];

    const categories = (categoriesResponse.data?.data ?? []) as Category[];

    if (!course) {
      throw new Response("Course not found.", {
        status: 404,
      });
    }

    return {
      course,
      learningOutcomes,
      sections,
      categories,
    };
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }

    if (isAxiosError(error) && error.response?.status === 401) {
      throw redirect("/signin");
    }

    if (isAxiosError(error) && error.response?.status === 404) {
      throw new Response("Course not found.", {
        status: 404,
      });
    }

    console.error("Failed to load course:", error);

    throw new Response("Failed to load course.", {
      status: 500,
    });
  }
}

// =========================================================
// ROUTE
// =========================================================

export default function EditCourseRoute() {
  const { course, learningOutcomes, categories, sections } = useLoaderData<typeof clientLoader>();

  // =======================================================
  // STEP
  // =======================================================

  const [currentStep, setCurrentStep] = useState(1);

  // =======================================================
  // PREFILLED BASIC INFORMATION
  // =======================================================

  const initialCategory = getCategoryName(course.categoryId, categories);

  const initialLevel = getUiLevel(course.level);

  const [title, setTitle] = useState(course.title ?? "");

  const [description, setDescription] = useState(course.description ?? "");

  const [category, setCategory] = useState(initialCategory);


  const [level, setLevel] = useState(initialLevel);

  const [language, setLanguage] = useState(course.courseLanguage ?? "");

  const [price, setPrice] = useState(String((course.price ?? 0) / 100));

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(course.thumbnailUrl);

  const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0);

  const [isThumbnailUploading, setIsThumbnailUploading] = useState(false);

  const [thumbnailError, setThumbnailError] = useState<string | null>(null);

  // =======================================================
  // LEARNING OUTCOMES
  // =======================================================

  const [outcomes, setOutcomes] = useState<string[]>(learningOutcomes.length ? learningOutcomes : defaultOutcomes);

  const [courseSections, setCourseSections] = useState<CourseSection[]>(sections);
  const [contentError, setContentError] = useState<string | null>(null);

  // =======================================================
  // VALIDATION
  // =======================================================

  const [showBasicValidation, setShowBasicValidation] = useState(false);

  const [touchedFields, setTouchedFields] = useState({
    title: false,
    description: false,
    category: false,
    level: false,
    language: false,
  });

  // =======================================================
  // AUTOSAVE
  // =======================================================

  const [saveState, setSaveState] = useState<SaveState>("idle");

  const [saveError, setSaveError] = useState<string | null>(null);

  const [isDirty, setIsDirty] = useState(false);

  const dirtyFieldsRef = useRef<Set<DirtyField>>(new Set());

  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveQueueRef = useRef<Promise<boolean>>(Promise.resolve(true));

  const draftVersionRef = useRef(0);

  const objectUrlRef = useRef<string | null>(null);

  const isArchived = course.status === "archived";

  // =======================================================
  // PUBLISH
  // =======================================================

  const [publishModalOpen, setPublishModalOpen] = useState(false);

  const [publishSuccess, setPublishSuccess] = useState(false);

  const [isPublishing, setIsPublishing] = useState(false);

  const [publishError, setPublishError] = useState<string | null>(null);

  // =======================================================
  // DERIVED VALUES
  // =======================================================

  const characterCount = description.length;

  const previewTitle = useMemo(() => title.trim() || "Your Course Title", [title]);

  const previewDescription = useMemo(() => description.trim() || "Your course description will appear here for students.", [description]);

  // =======================================================
  // VALIDATION VALUES
  // =======================================================

  const isTitleMissing = title.trim().length < 3;

  const isDescriptionMissing = description.trim().length === 0;

  const isCategoryMissing = category.trim().length === 0;

  const isLevelMissing = level.trim().length === 0;

  const isLanguageMissing = language.trim().length === 0;

  const isThumbnailMissing = thumbnailPreview === null;

  const filledOutcomes = outcomes.filter((outcome) => outcome.trim().length > 0);

  const areOutcomesMissing = filledOutcomes.length < 3;

  const showTitleError = isTitleMissing && (showBasicValidation || touchedFields.title);

  const showDescriptionError = isDescriptionMissing && (showBasicValidation || touchedFields.description);

  const showCategoryError = isCategoryMissing && (showBasicValidation || touchedFields.category);

  const showLevelError = isLevelMissing && (showBasicValidation || touchedFields.level);

  const showLanguageError = isLanguageMissing && (showBasicValidation || touchedFields.language);

  const showThumbnailError = isThumbnailMissing && showBasicValidation;

  const showOutcomesError = areOutcomesMissing && showBasicValidation;

  const isBasicInformationValid = !isTitleMissing && !isDescriptionMissing && !isCategoryMissing && !isLevelMissing && !isLanguageMissing && !isThumbnailMissing && !areOutcomesMissing;

  // =======================================================
  // FIELD HELPERS
  // =======================================================

  function markFieldTouched(field: keyof typeof touchedFields) {
    setTouchedFields((current) => ({
      ...current,
      [field]: true,
    }));
  }

  function markDraftDirty(field: DirtyField) {
    if (isArchived) return;

    dirtyFieldsRef.current.add(field);

    draftVersionRef.current += 1;

    setIsDirty(true);

    setSaveState("unsaved");

    setSaveError(null);
  }

  // =======================================================
  // BUILD PATCH PAYLOAD
  // =======================================================

  function buildUpdatePayload(): UpdateCoursePayload {
    const payload: UpdateCoursePayload = {};

    const dirtyFields = dirtyFieldsRef.current;

    if (dirtyFields.has("title")) {
      payload.title = title.trim();
    }

    if (dirtyFields.has("description")) {
      payload.description = description.trim();
    }

    if (dirtyFields.has("categoryId")) {
      const selectedCategory = categories.find((item) => item.name === category);

      if (selectedCategory) {
        payload.categoryId = selectedCategory.id;
      }
    }

    if (dirtyFields.has("courseLanguage")) {
      payload.courseLanguage = language.trim();
    }

    if (dirtyFields.has("level") && level) {
      payload.level = getCourseLevelValue(level);
    }

    if (dirtyFields.has("price")) {
      const numericPrice = Number(price);
      if (Number.isFinite(numericPrice) && numericPrice >= 0) payload.price = Math.round(numericPrice * 100);
    }

    if (dirtyFields.has("learningOutcomes")) {
      payload.learningOutcomes = outcomes.map((outcome) => outcome.trim()).filter(Boolean);
    }

    return payload;
  }

  // =======================================================
  // AUTOSAVE
  // =======================================================

  function queueSaveDraft() {
    if (isArchived || !isDirty) {
      return Promise.resolve(true);
    }

    if (dirtyFieldsRef.current.has("price")) {
      const numericPrice = Number(price);
      if (price.trim() === "" || !Number.isFinite(numericPrice) || numericPrice < 0 || numericPrice > 100_000) {
        setSaveState("error");
        setSaveError("Course price must be between ₹0 and ₹100,000.");
        return Promise.resolve(false);
      }
    }

    const operation = async (): Promise<boolean> => {
      const payload = buildUpdatePayload();

      if (Object.keys(payload).length === 0) {
        return true;
      }

      const saveVersion = draftVersionRef.current;

      setSaveState("saving");

      setSaveError(null);

      try {
        await api.patch(`/course-creator/courses/${course.id}`, payload);

        if (draftVersionRef.current === saveVersion) {
          dirtyFieldsRef.current.clear();

          setIsDirty(false);

          setSaveState("saved");
        } else {
          setIsDirty(true);

          setSaveState("unsaved");
          return false;
        }
        return true;
      } catch (error) {
        console.error("Failed to save course:", error);

        let message = "Could not save course.";

        if (isAxiosError(error)) {
          message = error.response?.data?.message ?? message;
        } else if (error instanceof Error) {
          message = error.message;
        }

        setSaveState("error");

        setSaveError(message);

        setIsDirty(true);
        return false;
      }
    };

    const queued = saveQueueRef.current.then(operation, operation);

    saveQueueRef.current = queued.catch(() => false);

    return queued;
  }

  useEffect(() => {
    if (!isDirty || isArchived || isThumbnailUploading) {
      return;
    }

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(() => {
      void queueSaveDraft();
    }, 2000);

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);

        autosaveTimerRef.current = null;
      }
    };
  }, [title, description, category, level, language, price, outcomes, isDirty, isArchived, isThumbnailUploading]);

  // =======================================================
  // MANUAL SAVE
  // =======================================================

  async function handleSaveDraft(): Promise<boolean> {
    if (isArchived || isThumbnailUploading) {
      return false;
    }

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);

      autosaveTimerRef.current = null;
    }

    return queueSaveDraft();
  }

  // =======================================================
  // THUMBNAIL UPLOAD
  // =======================================================

  async function uploadThumbnail(file: File) {
    if (isArchived) return;

    if (isDirty && !(await handleSaveDraft())) {
      setThumbnailError("Save the current course changes before uploading a thumbnail.");
      return;
    }

    setIsThumbnailUploading(true);

    setThumbnailUploadProgress(0);

    setThumbnailError(null);

    try {
      const presignResponse = await api.post(`/course-creator/courses/${course.id}/thumbnail/presign`, {
        courseId: course.id,
        fileName: file.name,
        contentType: file.type,
        fileSize: file.size,
      });

      const data = presignResponse.data?.data;

      if (!data?.uploadUrl || typeof data.uploadUrl !== "string") {
        throw new Error("Upload URL was not returned by the server.");
      }

      await axios.put(data.uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (event) => {
          if (!event.total) return;

          const progress = Math.round((event.loaded / event.total) * 100);

          setThumbnailUploadProgress(progress);
        },
      });

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }

      const localPreview = URL.createObjectURL(file);

      objectUrlRef.current = localPreview;

      setThumbnailPreview(localPreview);

      await api.patch(`/course-creator/courses/${course.id}`, {
        thumbnailUrl: data.key,
      });

      setThumbnailUploadProgress(100);

      setSaveState("saved");

      setIsDirty(false);
    } catch (error) {
      console.error("Thumbnail upload failed:", error);

      let message = "Could not upload thumbnail.";

      if (isAxiosError(error)) {
        message = error.response?.data?.message ?? message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      setThumbnailError(message);

      setSaveState("error");

      setSaveError(message);
    } finally {
      setIsThumbnailUploading(false);
    }
  }

  // =======================================================
  // THUMBNAIL INPUT
  // =======================================================

  function handleThumbnailChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file || isArchived) {
      return;
    }

    if (file.size > MAX_THUMBNAIL_SIZE) {
      alert("Maximum thumbnail size is 5MB.");

      event.target.value = "";

      return;
    }

    if (!ALLOWED_THUMBNAIL_TYPES.includes(file.type)) {
      alert("Only PNG, JPG and WebP images are allowed.");

      event.target.value = "";

      return;
    }

    void uploadThumbnail(file);

    event.target.value = "";
  }

  async function removeThumbnail() {
    if (isArchived || isThumbnailUploading) {
      return;
    }

    if (isDirty && !(await handleSaveDraft())) return;

    setThumbnailError(null);
    try {
      await api.patch(`/course-creator/courses/${course.id}`, { thumbnailUrl: null });
    } catch (error) {
      setThumbnailError(isAxiosError(error) ? error.response?.data?.message ?? "Could not remove thumbnail." : "Could not remove thumbnail.");
      return;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);

      objectUrlRef.current = null;
    }

    setThumbnailPreview(null);
    setSaveState("saved");
    setSaveError(null);
  }

  // =======================================================
  // OUTCOMES
  // =======================================================

  function updateOutcome(index: number, value: string) {
    setOutcomes((current) => current.map((outcome, outcomeIndex) => (outcomeIndex === index ? value : outcome)));

    markDraftDirty("learningOutcomes");
  }

  function addOutcome() {
    if (outcomes.length >= 6 || isArchived) {
      return;
    }

    setOutcomes((current) => [...current, ""]);

    markDraftDirty("learningOutcomes");
  }

  function removeOutcome(index: number) {
    if (isArchived) {
      return;
    }

    setOutcomes((current) => current.filter((_, outcomeIndex) => outcomeIndex !== index));

    markDraftDirty("learningOutcomes");
  }

  // =======================================================
  // PUBLISH
  // =======================================================

  function openPublishModal() {
    if (isArchived || isPublishing) {
      return;
    }

    setPublishError(null);

    setPublishModalOpen(true);
  }

  async function handlePublishCourse() {
    if (isArchived || isPublishing) {
      return;
    }

    const contents = courseSections.flatMap((section) => section.contents);
    if (!contents.length || contents.some((content) => content.id.startsWith("draft:") || !content.contentUrl?.trim())) {
      setPublishError("Add at least one lesson and save or remove each unfinished lesson before publishing.");
      setCurrentStep(2);
      return;
    }

    /*
     * Agar koi unsaved field abhi bhi hai,
     * pehle usse save karne ki koshish karo.
     */
    if (isDirty) {
      const saved = await handleSaveDraft();

      /*
       * Agar save fail ho gaya to publish
       * mat karo.
       */
      if (!saved) {
        setPublishError("Please save your changes before publishing.");

        return;
      }
    }

    setIsPublishing(true);

    setPublishError(null);

    try {
      await api.patch(`/course-creator/courses/${course.id}/publish`, {});

      /*
       * Confirmation modal close.
       */
      setPublishModalOpen(false);

      /*
       * Success modal open.
       */
      setPublishSuccess(true);
    } catch (error) {
      console.error("Failed to publish course:", error);

      let message = "Could not publish course.";

      if (isAxiosError<{ message?: string; errors?: { missingFields?: string[] } }>(error)) {
        const missing = error.response?.data?.errors?.missingFields;
        message = missing?.length ? `${error.response?.data?.message ?? message} Missing: ${missing.join(", ")}.` : error.response?.data?.message ?? message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      setPublishError(message);
    } finally {
      setIsPublishing(false);
    }
  }

  function closePublishSuccess() {
    setPublishSuccess(false);

    window.location.reload();
  }

  function goToCourses() {
    window.location.href = "/course-creator/courses";
  }

  // =======================================================
  // NEXT
  // =======================================================

  async function handleNext() {
    if (isArchived) return;

    if (currentStep === 1) {
      if (!isBasicInformationValid) {
        setShowBasicValidation(true);

        setTouchedFields({
          title: true,
          description: true,
          category: true,
          level: true,
          language: true,
        });

        return;
      }

      setShowBasicValidation(false);

      if (isDirty) {
        if (!(await handleSaveDraft())) return;
      }
    }

    if (currentStep === 3) {
      const numericPrice = Number(price);
      if (price.trim() === "" || !Number.isFinite(numericPrice) || numericPrice < 0 || numericPrice > 100_000) return;
      if (isDirty && !(await handleSaveDraft())) return;
    }

    if (currentStep === 2) {
      const contents = courseSections.flatMap((section) => section.contents);
      if (!contents.length || contents.some((content) => content.id.startsWith("draft:") || !content.contentUrl?.trim())) {
        setContentError("Add at least one lesson and save or remove each unfinished lesson before continuing.");
        return;
      }
    }

    if (currentStep < 4) {
      setCurrentStep((step) => step + 1);

      return;
    }

    /*
     * Step 4 par direct publish nahi karna.
     * Pehle confirmation modal.
     */
    openPublishModal();
  }

  // =======================================================
  // SAVE STATUS
  // =======================================================

  function renderSaveStatus() {
    if (isThumbnailUploading) {
      return <span className="text-xs font-medium text-violet-600">Uploading thumbnail {thumbnailUploadProgress}%</span>;
    }

    if (saveState === "saving") {
      return <span className="text-xs font-medium text-slate-500">Saving...</span>;
    }

    if (saveState === "saved") {
      return (
        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
          <Check className="h-3.5 w-3.5" />
          Saved
        </span>
      );
    }

    if (saveState === "unsaved") {
      return <span className="text-xs font-medium text-amber-600">Unsaved changes</span>;
    }

    if (saveState === "error") {
      return (
        <span className="text-xs font-medium text-red-600" title={saveError ?? "Save failed"}>
          Save failed
        </span>
      );
    }

    return null;
  }

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <>
      <main className="min-h-full bg-[#f7f9ff]">
        <div className="mx-auto max-w-[1600px] px-5 py-6 md:px-8 lg:px-10">
          {/* BREADCRUMB */}

          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-slate-500">Home</span>

            <span className="text-slate-300">›</span>

            <span className="text-slate-500">Courses</span>

            <span className="text-slate-300">›</span>

            <span className="font-medium text-slate-900">Edit Course</span>
          </div>

          {/* HEADER */}

          <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#101537]">Edit Course</h1>

              <p className="mt-1 text-sm text-slate-500">Update your course and continue building it.</p>
            </div>

            <div className="flex items-center gap-3">
              {renderSaveStatus()}

              <button
                type="button"
                onClick={() => void handleSaveDraft()}
                disabled={isArchived || isThumbnailUploading || saveState === "saving"}
                className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save Draft
              </button>

              <button
                type="button"
                onClick={() => void handleNext()}
                disabled={isArchived || isThumbnailUploading}
                className={`inline-flex h-11 items-center gap-2 rounded-xl px-6 text-sm font-semibold transition active:scale-[0.98] ${
                  isArchived || isThumbnailUploading
                    ? "cursor-not-allowed bg-slate-200 text-slate-400"
                    : currentStep === 1 && !isBasicInformationValid
                      ? "cursor-not-allowed bg-slate-200 text-slate-400 shadow-none"
                      : "cursor-pointer bg-violet-600 text-white shadow-lg shadow-violet-200 hover:bg-violet-700"
                }`}
              >
                {currentStep === 4 ? "Publish" : "Next"}

                <span>→</span>
              </button>
            </div>
          </div>

          {isArchived && (
            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">This course is archived and cannot be edited. Restore it first.</div>
          )}

          {saveState === "error" && saveError && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{saveError}</div>}

          {/* STEP PROGRESS */}

          <div className="mb-5">
            <StepProgress currentStep={currentStep} onStepChange={setCurrentStep} disabled={isArchived} />
          </div>

          {/* MAIN */}

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(340px,1fr)]">
            {/* LEFT */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              {/* STEP 1 */}

              {currentStep === 1 && (
                <>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-[#101537]">Basic Information</h2>

                    <p className="mt-1 text-sm text-slate-500">Update the main details about your course. These changes are automatically saved after a short pause.</p>
                  </div>

                  {/* TITLE */}

                  <div className="mb-5">
                    <label htmlFor="course-title" className={`mb-2 block text-sm font-medium ${showTitleError ? "text-red-600" : "text-slate-900"}`}>
                      Course Title <span className="text-red-500">*</span>
                    </label>

                    <input
                      id="course-title"
                      type="text"
                      value={title}
                      disabled={isArchived}
                      onChange={(event) => {
                        setTitle(event.target.value);

                        markFieldTouched("title");

                        markDraftDirty("title");
                      }}
                      onBlur={() => markFieldTouched("title")}
                      placeholder="Enter your course title"
                      className={`h-11 w-full rounded-xl bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 ${
                        showTitleError
                          ? "border border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                      }`}
                    />

                    {showTitleError && <p className="mt-1.5 text-xs font-medium text-red-500">{title.trim().length > 0 ? "Enter at least 3 characters." : "This field is required."}</p>}
                  </div>

                  {/* DESCRIPTION */}

                  <div className="mb-5">
                    <label htmlFor="course-description" className={`mb-2 block text-sm font-medium ${showDescriptionError ? "text-red-600" : "text-slate-900"}`}>
                      Short Description <span className="text-red-500">*</span>
                    </label>

                    <textarea
                      id="course-description"
                      value={description}
                      disabled={isArchived}
                      onChange={(event) => {
                        setDescription(event.target.value);

                        markFieldTouched("description");

                        markDraftDirty("description");
                      }}
                      onBlur={() => markFieldTouched("description")}
                      rows={4}
                      maxLength={500}
                      placeholder="Describe what students will learn..."
                      className={`w-full resize-none rounded-xl bg-white px-3.5 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 ${
                        showDescriptionError
                          ? "border border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                      }`}
                    />

                    <div className="mt-1 flex items-center justify-between">
                      {showDescriptionError ? <p className="text-xs font-medium text-red-500">This field is required.</p> : <span />}

                      <span className="text-xs text-slate-400">
                        {characterCount}
                        /500
                      </span>
                    </div>
                  </div>

                  {/* CATEGORY */}

                  <div className="mb-5 grid grid-cols-1 gap-5">
                    <div>
                      <label className={`mb-2 block text-sm font-medium ${showCategoryError ? "text-red-600" : "text-slate-900"}`}>
                        Category <span className="text-red-500">*</span>
                      </label>

                      <SelectField
                        value={category}
                        onChange={(value) => {
                          setCategory(value);

                          markFieldTouched("category");

                          markDraftDirty("categoryId");
                        }}
                        icon={<Folder className="h-4 w-4" />}
                        placeholder="Select a category"
                        error={showCategoryError}
                        disabled={isArchived}
                        options={categories.map((item) => item.name)}
                      />

                      {showCategoryError && <p className="mt-1.5 text-xs font-medium text-red-500">Please select a category.</p>}
                    </div>

                  </div>

                  {/* LEVEL + LANGUAGE */}

                  <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label className={`mb-2 block text-sm font-medium ${showLevelError ? "text-red-600" : "text-slate-900"}`}>
                        Level <span className="text-red-500">*</span>
                      </label>

                      <SelectField
                        value={level}
                        onChange={(value) => {
                          setLevel(value);

                          markFieldTouched("level");

                          markDraftDirty("level");
                        }}
                        placeholder="Select a level"
                        icon={<BarChart3 className="h-4 w-4" />}
                        error={showLevelError}
                        disabled={isArchived}
                        options={COURSE_LEVEL_OPTIONS}
                      />

                      {showLevelError && <p className="mt-1.5 text-xs font-medium text-red-500">Please select a level.</p>}
                    </div>

                    <div>
                      <label className={`mb-2 block text-sm font-medium ${showLanguageError ? "text-red-600" : "text-slate-900"}`}>
                        Language <span className="text-red-500">*</span>
                      </label>

                      <SelectField
                        value={language}
                        onChange={(value) => {
                          setLanguage(value);

                          markFieldTouched("language");

                          markDraftDirty("courseLanguage");
                        }}
                        placeholder="Select a language"
                        icon={<Globe className="h-4 w-4" />}
                        error={showLanguageError}
                        disabled={isArchived}
                        options={["English", "Hindi", "Spanish", "French", "German"]}
                      />

                      {showLanguageError && <p className="mt-1.5 text-xs font-medium text-red-500">Please select a language.</p>}
                    </div>
                  </div>

                  {/* THUMBNAIL */}

                  <div className="mb-6">
                    <label className={`mb-2 block text-sm font-medium ${showThumbnailError ? "text-red-600" : "text-slate-900"}`}>
                      Course Thumbnail <span className="text-red-500">*</span>
                    </label>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <label
                        className={`group flex min-h-[122px] flex-col items-center justify-center rounded-xl border border-dashed px-5 text-center transition ${
                          isArchived || isThumbnailUploading
                            ? "pointer-events-none opacity-50"
                            : showThumbnailError
                              ? "cursor-pointer border-red-300 bg-red-50/40 hover:border-red-400"
                              : "cursor-pointer border-slate-300 bg-slate-50/70 hover:border-violet-400 hover:bg-violet-50/30"
                        }`}
                      >
                        <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleThumbnailChange} disabled={isArchived || isThumbnailUploading} className="hidden" />

                        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
                          <Upload className="h-4 w-4" />
                        </div>

                        <p className="text-sm font-medium text-slate-700">
                          Click to upload <span className="font-normal text-slate-400">or drag and drop</span>
                        </p>

                        <p className="mt-1 text-xs text-slate-400">PNG, JPG or WebP (Max 5MB)</p>

                        <p className="mt-0.5 text-xs text-slate-400">Recommended size: 1280 × 720px</p>
                      </label>

                      <CourseThumbnail title={title} preview={thumbnailPreview} onRemove={removeThumbnail} disabled={isArchived || isThumbnailUploading} />
                    </div>

                    {isThumbnailUploading && (
                      <div className="mt-3">
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-600">Uploading thumbnail...</span>

                          <span className="font-semibold text-violet-600">{thumbnailUploadProgress}%</span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-violet-600 transition-all duration-200"
                            style={{
                              width: `${thumbnailUploadProgress}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {thumbnailError && <p className="mt-1.5 text-xs font-medium text-red-500">{thumbnailError}</p>}

                    {showThumbnailError && !thumbnailError && <p className="mt-1.5 text-xs font-medium text-red-500">Please upload a course thumbnail.</p>}
                  </div>

                  {/* OUTCOMES */}

                  <div>
                    <div className="mb-3">
                      <label className={`block text-sm font-medium ${showOutcomesError ? "text-red-600" : "text-slate-900"}`}>
                        What will students learn? <span className="text-red-500">*</span>
                      </label>

                      <p className="mt-1 text-xs text-slate-400">Add 3-6 key learning outcomes. These will be shown on the course page.</p>
                    </div>

                    <div className="space-y-2.5">
                      {outcomes.map((outcome, index) => {
                        const isEmptyOutcome = outcome.trim().length === 0;

                        const showOutcomeError = showOutcomesError && isEmptyOutcome;

                        return (
                          <div key={index} className="flex items-center gap-2">
                            <div className="flex shrink-0 flex-col gap-0.5 text-slate-400">
                              <span className="h-1 w-1 rounded-full bg-current" />
                              <span className="h-1 w-1 rounded-full bg-current" />
                              <span className="h-1 w-1 rounded-full bg-current" />
                            </div>

                            <input
                              type="text"
                              value={outcome}
                              disabled={isArchived}
                              onChange={(event) => updateOutcome(index, event.target.value)}
                              placeholder="What will students learn?"
                              className={`h-10 flex-1 rounded-lg bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 ${
                                showOutcomeError
                                  ? "border border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                  : "border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                              }`}
                            />

                            <button
                              type="button"
                              onClick={() => removeOutcome(index)}
                              disabled={outcomes.length <= 1 || isArchived}
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {showOutcomesError && <p className="mt-2 text-xs font-medium text-red-500">Add at least 3 learning outcomes.</p>}

                    <button
                      type="button"
                      onClick={addOutcome}
                      disabled={outcomes.length >= 6 || isArchived}
                      className="mt-3 inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus className="h-4 w-4" />
                      Add Learning Outcome
                    </button>
                  </div>
                </>
              )}

              {/* STEP 2 */}

              {currentStep === 2 && <>
              {contentError && <div role="alert" className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{contentError}</div>}
              <CourseContent courseId={course.id} sections={courseSections} disabled={isArchived} onSectionsChange={(next) => {
                const now = new Date().toISOString();
                const updated = next.map((section, sectionIndex) => {
                  const existing = courseSections.find((item) => item.id === section.id);
                  return {
                    id: String(section.id),
                    courseId: course.id,
                    title: section.title,
                    sequenceOrder: sectionIndex + 1,
                    createdAt: existing?.createdAt ?? now,
                    updatedAt: now,
                    contents: section.lessons.map((lesson, lessonIndex) => ({
                      id: String(lesson.id),
                      sectionId: String(section.id),
                      title: lesson.title,
                      contentType: lesson.type,
                      contentUrl: lesson.contentUrl ?? "",
                      sequenceOrder: lessonIndex + 1,
                      createdAt: existing?.contents.find((item) => item.id === lesson.id)?.createdAt ?? now,
                      updatedAt: now,
                    })),
                  };
                });
                setCourseSections(updated);
                if (updated.flatMap((section) => section.contents).every((content) => !content.id.startsWith("draft:") && Boolean(content.contentUrl?.trim()))) setContentError(null);
              }} />
              </>}

              {/* STEP 3 */}

              {currentStep === 3 && (
                <PricingAccess
                  price={price}
                  onPriceChange={(value) => {
                    setPrice(value);
                    markDraftDirty("price");
                  }}
                  disabled={isArchived}
                  onPrevious={() => setCurrentStep(2)}
                  onNext={async () => {
                    if (await handleSaveDraft()) setCurrentStep(4);
                  }}
                  onSaveDraft={() => void handleSaveDraft()}
                />
              )}

              {/* STEP 4 */}

              {currentStep === 4 && (
                <ReviewPublish
                  title={title}
                  description={description}
                  category={category}
                  level={level}
                  language={language}
                  price={price}
                  thumbnailUrl={thumbnailPreview}
                  outcomes={outcomes}
                  sections={courseSections}
                  isSaving={saveState === "saving" || isThumbnailUploading}
                  isPublishing={isPublishing}
                  publishError={publishError}
                  onPrevious={() => setCurrentStep(3)}
                  onSaveDraft={() => void handleSaveDraft()}
                  onPublish={openPublishModal}
                  onEditBasicInfo={() => setCurrentStep(1)}
                  onEditContent={() => setCurrentStep(2)}
                  onEditPricing={() => setCurrentStep(3)}
                />
              )}

              {/* BOTTOM NAVIGATION */}

              <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => setCurrentStep((step) => Math.max(1, step - 1))}
                  disabled={currentStep === 1 || isArchived}
                  className="h-10 rounded-xl border border-slate-200 px-5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={() => void handleNext()}
                  disabled={isArchived || isThumbnailUploading}
                  className={`inline-flex h-10 items-center gap-2 rounded-xl px-6 text-sm font-semibold transition ${
                    isArchived || isThumbnailUploading
                      ? "cursor-not-allowed bg-slate-200 text-slate-400"
                      : currentStep === 1 && !isBasicInformationValid
                        ? "cursor-not-allowed bg-slate-200 text-slate-400"
                        : "cursor-pointer bg-violet-600 text-white hover:bg-violet-700"
                  }`}
                >
                  {currentStep === 4 ? "Publish Course" : "Next"}

                  <span>→</span>
                </button>
              </div>
            </section>

            {/* RIGHT SIDEBAR */}

            <aside className="space-y-5">
              {/* PREVIEW */}

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#101537]">Course Preview</h3>

                    <p className="mt-1 text-sm text-slate-500">This is how your course will appear to students.</p>
                  </div>

                </div>

                <CourseThumbnail title={title} preview={thumbnailPreview} onRemove={removeThumbnail} disabled={isArchived || isThumbnailUploading} />

                <div className="mt-4">
                  <h2 className="text-xl font-bold text-[#101537]">{previewTitle}</h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">{previewDescription}</p>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Folder className="h-4 w-4" />

                    <span className="truncate">{category || "Category"}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-500">
                    <BarChart3 className="h-4 w-4" />

                    <span>{level || "Level"}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-500">
                    <Globe className="h-4 w-4" />

                    <span>{language || "Language"}</span>
                  </div>
                </div>
              </section>

              {/* TIPS */}

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                    <Info className="h-4 w-4" />
                  </div>

                  <h3 className="text-base font-bold text-[#101537]">Tips for a Great Course</h3>
                </div>

                <div className="space-y-4">
                  {tips.map((tip) => (
                    <div key={tip} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </div>

                      <p className="text-sm leading-5 text-slate-500">{tip}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* HELP */}

              <section className="rounded-2xl border border-violet-100 bg-violet-50/60 p-5">
                <div className="flex items-start gap-3">
                  <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />

                  <div>
                    <p className="text-sm font-semibold text-slate-900">Need help?</p>

                    <p className="mt-1 text-sm leading-5 text-slate-500">Continue editing your course and your basic information will be saved automatically.</p>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>

      {/* =====================================================
          PUBLISH CONFIRMATION MODAL
      ====================================================== */}

      {publishModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isPublishing) {
              setPublishModalOpen(false);
            }
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            {/* HEADER */}

            <div className="relative px-6 pt-7 text-center">
              <button
                type="button"
                onClick={() => setPublishModalOpen(false)}
                disabled={isPublishing}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                <Send className="h-6 w-6" />
              </div>

              <h2 className="mt-4 text-xl font-bold text-slate-900">Publish this course?</h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">Your course will be published and made available to students according to its access settings.</p>
            </div>

            {/* ERROR */}

            {publishError && (
              <div className="mx-6 mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                <p className="text-center text-sm font-medium text-red-600">{publishError}</p>
              </div>
            )}

            {/* ACTIONS */}

            <div className="flex gap-3 p-6">
              <button
                type="button"
                onClick={() => setPublishModalOpen(false)}
                disabled={isPublishing}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void handlePublishCourse()}
                disabled={isPublishing}
                className="flex-1 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPublishing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Publishing...
                  </span>
                ) : (
                  "Yes, Publish"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          PUBLISH SUCCESS MODAL
      ====================================================== */}

      {publishSuccess && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">Course Published Successfully!</h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">Your course has been published successfully and is now available to students according to its access settings.</p>

              <div className="mt-6 flex gap-3">
                <button type="button" onClick={closePublishSuccess} className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  Stay Here
                </button>

                <button type="button" onClick={goToCourses} className="flex-1 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700">
                  My Courses
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
