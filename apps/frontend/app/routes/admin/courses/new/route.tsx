import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import {
  BarChart3,
  BookOpen,
  Check,
  ChevronDown,
  CircleHelp,
  Folder,
  Globe,
  Image as ImageIcon,
  Info,
  List,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import CourseContent from "../../components/courses/content/CourseContent";
import PricingAccess from "../../components/courses/pricing/PricingAccess";
import ReviewPublish from "../../components/courses/review/ReviewPublish";

type Step = {
  id: number;
  title: string;
  description: string;
};

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

const defaultOutcomes = [
  "Understand React fundamentals and core concepts",
  "Build reusable components",
];

function SelectField({
  value,
  onChange,
  options,
  icon,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  icon: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </div>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-11 pr-10 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

function CourseThumbnail({
  title,
  preview,
  onRemove,
}: {
  title: string;
  preview: string | null;
  onRemove: () => void;
}) {
  if (preview) {
    return (
      <div className="relative h-[122px] overflow-hidden rounded-xl">
        <img
          src={preview}
          alt="Course thumbnail"
          className="h-full w-full object-cover"
        />

        <button
          type="button"
          onClick={onRemove}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-700 shadow-md transition hover:bg-slate-100"
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
        <p className="text-[24px] font-bold leading-tight text-white">
          {title || "React"}
        </p>

        <p className="mt-1 text-[22px] font-semibold leading-tight text-cyan-400">
          for Beginners
        </p>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-700 shadow-md transition hover:bg-slate-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function StepProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div
              key={step.id}
              className={`relative flex items-center gap-4 px-6 py-5 ${
                isActive ? "bg-white" : "bg-white"
              }`}
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-semibold ${
                  isActive
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
                    : isCompleted
                      ? "bg-violet-100 text-violet-700"
                      : "bg-slate-100 text-slate-500"
                }`}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : step.id}
              </div>

              <div className="min-w-0">
                <p
                  className={`text-sm font-semibold ${
                    isActive || isCompleted
                      ? "text-violet-700"
                      : "text-slate-700"
                  }`}
                >
                  {step.title}
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  {step.description}
                </p>
              </div>

              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600" />
              )}

              {index !== steps.length - 1 && (
                <div className="absolute right-0 top-1/2 hidden h-8 w-px -translate-y-1/2 bg-slate-100 md:block" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CreateCourseRoute() {
  const [currentStep, setCurrentStep] = useState(1);

  const [title, setTitle] = useState("React for Beginners");

  const [description, setDescription] = useState(
    "Learn React from scratch and build real-world projects. This course covers all the essentials you need to become a confident React developer.",
  );

  const [category, setCategory] = useState("Web Development");

  const [subcategory, setSubcategory] = useState("Frontend Development");

  const [level, setLevel] = useState("Beginner");

  const [language, setLanguage] = useState("English");

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [outcomes, setOutcomes] = useState(defaultOutcomes);

  const characterCount = description.length;

  const previewTitle = useMemo(() => {
    return title.trim() || "Your Course Title";
  }, [title]);

  const previewDescription = useMemo(() => {
    return (
      description.trim() ||
      "Your course description will appear here for students."
    );
  }, [description]);

  function handleThumbnailChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Maximum thumbnail size is 5MB.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setThumbnailPreview(imageUrl);
  }

  function removeThumbnail() {
    setThumbnailPreview(null);
  }

  function updateOutcome(index: number, value: string) {
    setOutcomes((current) =>
      current.map((outcome, outcomeIndex) =>
        outcomeIndex === index ? value : outcome,
      ),
    );
  }

  function addOutcome() {
    if (outcomes.length >= 6) {
      return;
    }

    setOutcomes((current) => [...current, ""]);
  }

  function removeOutcome(index: number) {
    setOutcomes((current) =>
      current.filter((_, outcomeIndex) => outcomeIndex !== index),
    );
  }

  function handleNext() {
    if (currentStep < 4) {
      setCurrentStep((step) => step + 1);
      return;
    }

    console.log("Publish course");
  }

  return (
    <main className="min-h-full bg-[#f7f9ff]">
      <div className="mx-auto max-w-[1600px] px-5 py-6 md:px-8 lg:px-10">
        {/* Breadcrumb */}
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-slate-500">Home</span>

          <span className="text-slate-300">›</span>

          <span className="text-slate-500">Courses</span>

          <span className="text-slate-300">›</span>

          <span className="font-medium text-slate-900">Create Course</span>
        </div>

        {/* Header */}
        <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#101537]">
              Create New Course
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Build and publish a high-quality course for your learners.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Save Draft
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-violet-600 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 active:scale-[0.98]"
            >
              {currentStep === 4 ? "Publish" : "Next"}
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Step Progress */}
        <div className="mb-5">
          <StepProgress currentStep={currentStep} />
        </div>

        {/* Main */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(340px,1fr)]">
          {/* LEFT */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            {currentStep === 1 && (
              <>
                {/* Section title */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold tracking-tight text-[#101537]">
                    Basic Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Add the main details about your course. This information
                    will be shown to students.
                  </p>
                </div>

                {/* Course title */}
                <div className="mb-5">
                  <label
                    htmlFor="course-title"
                    className="mb-2 block text-sm font-medium text-slate-900"
                  >
                    Course Title <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="course-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your course title"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  />
                </div>

                {/* Description */}
                <div className="mb-5">
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="course-description"
                      className="block text-sm font-medium text-slate-900"
                    >
                      Short Description <span className="text-red-500">*</span>
                    </label>
                  </div>

                  <textarea
                    id="course-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    maxLength={500}
                    placeholder="Describe what students will learn..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  />

                  <div className="mt-1 text-right text-xs text-slate-400">
                    {characterCount}/500
                  </div>
                </div>

                {/* Category */}
                <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900">
                      Category <span className="text-red-500">*</span>
                    </label>

                    <SelectField
                      value={category}
                      onChange={setCategory}
                      icon={<Folder className="h-4 w-4" />}
                      options={[
                        "Web Development",
                        "Design",
                        "Business",
                        "Marketing",
                        "Data Science",
                        "Personal Development",
                      ]}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900">
                      Subcategory
                    </label>

                    <SelectField
                      value={subcategory}
                      onChange={setSubcategory}
                      icon={<List className="h-4 w-4" />}
                      options={[
                        "Frontend Development",
                        "Backend Development",
                        "Full Stack Development",
                        "Mobile Development",
                        "DevOps",
                      ]}
                    />
                  </div>
                </div>

                {/* Level + Language */}
                <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900">
                      Level <span className="text-red-500">*</span>
                    </label>

                    <SelectField
                      value={level}
                      onChange={setLevel}
                      icon={<BarChart3 className="h-4 w-4" />}
                      options={[
                        "Beginner",
                        "Intermediate",
                        "Advanced",
                        "All Levels",
                      ]}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900">
                      Language <span className="text-red-500">*</span>
                    </label>

                    <SelectField
                      value={language}
                      onChange={setLanguage}
                      icon={<Globe className="h-4 w-4" />}
                      options={[
                        "English",
                        "Hindi",
                        "Spanish",
                        "French",
                        "German",
                      ]}
                    />
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-slate-900">
                    Course Thumbnail <span className="text-red-500">*</span>
                  </label>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Upload */}
                    <label className="group flex min-h-[122px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/70 px-5 text-center transition hover:border-violet-400 hover:bg-violet-50/30">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/svg+xml"
                        onChange={handleThumbnailChange}
                        className="hidden"
                      />

                      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
                        <Upload className="h-4 w-4" />
                      </div>

                      <p className="text-sm font-medium text-slate-700">
                        Click to upload{" "}
                        <span className="font-normal text-slate-400">
                          or drag and drop
                        </span>
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        PNG, JPG or SVG (Max 5MB)
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        Recommended size: 1280 × 720px
                      </p>
                    </label>

                    {/* Preview thumbnail */}
                    <CourseThumbnail
                      title={title}
                      preview={thumbnailPreview}
                      onRemove={removeThumbnail}
                    />
                  </div>
                </div>

                {/* Learning Outcomes */}
                <div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-slate-900">
                      What will students learn?{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <p className="mt-1 text-xs text-slate-400">
                      Add 3-6 key learning outcomes. These will be shown on the
                      course page.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {outcomes.map((outcome, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="flex shrink-0 flex-col gap-0.5 text-slate-400">
                          <span className="h-1 w-1 rounded-full bg-current" />
                          <span className="h-1 w-1 rounded-full bg-current" />
                          <span className="h-1 w-1 rounded-full bg-current" />
                        </div>

                        <input
                          type="text"
                          value={outcome}
                          onChange={(e) => updateOutcome(index, e.target.value)}
                          placeholder="What will students learn?"
                          className="h-10 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                        />

                        <button
                          type="button"
                          onClick={() => removeOutcome(index)}
                          disabled={outcomes.length <= 1}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addOutcome}
                    disabled={outcomes.length >= 6}
                    className="mt-3 inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" />
                    Add Learning Outcome
                  </button>
                </div>
              </>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && <CourseContent />}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <PricingAccess
                onPrevious={() => setCurrentStep(2)}
                onNext={() => setCurrentStep(4)}
                onSaveDraft={() => {
                  console.log("Saving course draft...");
                }}
              />
            )}
            {/* STEP 4 */}
            {currentStep === 4 && (
              <ReviewPublish
                onPrevious={() => setCurrentStep(3)}
                onSaveDraft={() => {
                  console.log("Saving draft...");
                }}
                onPublish={() => {
                  console.log("Publishing course...");
                }}
                onEditBasicInfo={() => setCurrentStep(1)}
                onEditContent={() => setCurrentStep(2)}
                onEditPricing={() => setCurrentStep(3)}
              />
            )}
            {/* Bottom navigation */}
            <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={() => setCurrentStep((step) => Math.max(1, step - 1))}
                disabled={currentStep === 1}
                className="h-10 rounded-xl border border-slate-200 px-5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-6 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                {currentStep === 4 ? "Publish Course" : "Next"}
                <span>→</span>
              </button>
            </div>
          </section>

          {/* RIGHT */}
          <aside className="space-y-5">
            {/* Preview */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-[#101537]">
                    Course Preview
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    This is how your course will appear to students.
                  </p>
                </div>

                <button
                  type="button"
                  className="whitespace-nowrap text-sm font-semibold text-violet-600 transition hover:text-violet-700"
                >
                  View on Site ↗
                </button>
              </div>

              <CourseThumbnail
                title={title}
                preview={thumbnailPreview}
                onRemove={removeThumbnail}
              />

              <div className="mt-4">
                <h2 className="text-xl font-bold text-[#101537]">
                  {previewTitle}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {previewDescription}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <Folder className="h-4 w-4" />
                  <span className="truncate">{category}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-500">
                  <BarChart3 className="h-4 w-4" />
                  <span>{level}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-500">
                  <Globe className="h-4 w-4" />
                  <span>{language}</span>
                </div>
              </div>
            </section>

            {/* Tips */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                  <Info className="h-4 w-4" />
                </div>

                <h3 className="text-base font-bold text-[#101537]">
                  Tips for a Great Course
                </h3>
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

            {/* Help */}
            <section className="rounded-2xl border border-violet-100 bg-violet-50/60 p-5">
              <div className="flex items-start gap-3">
                <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Need help?
                  </p>

                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    Follow the steps above to create and publish your course.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
