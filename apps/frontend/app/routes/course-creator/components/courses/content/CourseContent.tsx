import axios, { isAxiosError } from "axios";
import { Plus } from "lucide-react";
import { useState } from "react";
import { api } from "~/lib/axios";
import { SectionItem } from "./SectionItem";
import type { Lesson, LessonType, Section } from "./types";

const COURSE_API_PREFIX = "/course-creator/courses";

type BackendContent = {
  id: string;
  sectionId: string;
  title: string;
  contentType: string;
  contentUrl: string | null;
  sequenceOrder: number;
};

type BackendSection = {
  id: string;
  courseId: string;
  title: string;
  sequenceOrder: number;
  contents: BackendContent[];
};
type PersistedLessonType = Extract<LessonType, "video" | "article" | "resource">;

type CourseContentProps = {
  courseId: string;
  sections: BackendSection[];
  onSectionsChange?: (sections: Section[]) => void;
  disabled?: boolean;
};

function mapSections(sections: BackendSection[]): Section[] {
  return sections.map((section) => ({
    id: section.id,
    title: section.title,
    lessons: (section.contents ?? []).map((content) => {
      const type = content.contentType as LessonType;
      const contentUrl = content.contentUrl ?? "";
      return {
        id: content.id,
        title: content.title,
        description: type === "article" ? contentUrl : "",
        type,
        duration: "",
        freePreview: false,
        downloadable: false,
        contentUrl,
        videoUrl: type === "video" ? contentUrl : "",
        resourceUrl: type === "resource" ? contentUrl : "",
      };
    }),
  }));
}

function getErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError<{ message?: string }>(error)) return error.response?.data?.message ?? fallback;
  return error instanceof Error ? error.message : fallback;
}

function requireHttpUrl(value: string, label: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error();
  } catch {
    throw new Error(`${label} must be a valid HTTP or HTTPS URL.`);
  }
}

function isPersistedLessonType(value: LessonType): value is PersistedLessonType {
  return value === "video" || value === "article" || value === "resource";
}

function isCourseVideoKey(value: string, courseId: string) {
  return value.startsWith(`courses/${courseId}/videos/`);
}

export default function CourseContent({ courseId, sections: backendSections, onSectionsChange, disabled = false }: CourseContentProps) {
  const [sections, setSections] = useState<Section[]>(() => mapSections(backendSections));
  const [openSections, setOpenSections] = useState<string[]>(() => backendSections.map((section) => section.id));
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [busyAction, setBusyAction] = useState(false);
  const [busyActionLabel, setBusyActionLabel] = useState("Saving course content…");
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  function commit(next: Section[]) {
    setSections(next);
    onSectionsChange?.(next);
  }

  function showError(error: unknown, fallback: string) {
    setActionMessage(null);
    setActionError(getErrorMessage(error, fallback));
  }

  async function addSection() {
    if (disabled || isAddingSection) return;
    setActionError(null);
    setActionMessage(null);
    setIsAddingSection(true);
    try {
      const response = await api.post(`${COURSE_API_PREFIX}/${courseId}/sections`, { title: `New Section ${sections.length + 1}` });
      const created = response.data?.data;
      if (!created?.id) throw new Error("Server did not return the created section.");
      commit([...sections, { id: created.id, title: created.title, lessons: [] }]);
      setOpenSections((current) => [...current, created.id]);
      setActionMessage("Section created and saved.");
    } catch (error) {
      showError(error, "Could not create section.");
    } finally {
      setIsAddingSection(false);
    }
  }

  async function renameSection(sectionId: string) {
    const section = sections.find((item) => item.id === sectionId);
    if (!section || disabled) return;
    const title = window.prompt("Section title", section.title)?.trim();
    if (!title || title === section.title) return;
    setBusyAction(true);
    setActionError(null);
    try {
      await api.patch(`${COURSE_API_PREFIX}/sections/${sectionId}`, { title });
      commit(sections.map((item) => (item.id === sectionId ? { ...item, title } : item)));
      setActionMessage("Section title saved.");
    } catch (error) {
      showError(error, "Could not rename section.");
    } finally {
      setBusyAction(false);
    }
  }

  async function deleteSection(sectionId: string) {
    const section = sections.find((item) => item.id === sectionId);
    if (!section || disabled || !window.confirm("Delete this section and all its lessons?")) return;
    setBusyAction(true);
    setActionError(null);
    try {
      await api.delete(`${COURSE_API_PREFIX}/sections/${sectionId}`);
      commit(sections.filter((item) => item.id !== sectionId));
      setOpenSections((current) => current.filter((id) => id !== sectionId));
      setActiveLessonId(null);
      setActionMessage("Section and its lessons deleted.");
    } catch (error) {
      showError(error, "Could not delete section.");
    } finally {
      setBusyAction(false);
    }
  }

  async function duplicateSection(sectionId: string) {
    const source = sections.find((item) => item.id === sectionId);
    if (!source || disabled || busyAction) return;
    setBusyAction(true);
    setActionError(null);
    let createdSectionId: string | null = null;
    try {
      const sectionResponse = await api.post(`${COURSE_API_PREFIX}/${courseId}/sections`, { title: `${source.title} Copy` });
      const createdSection = sectionResponse.data?.data;
      if (!createdSection?.id) throw new Error("Server did not return the duplicated section.");
      createdSectionId = createdSection.id;
      const lessons: Lesson[] = [];
      for (const lesson of source.lessons) {
        if (String(lesson.id).startsWith("draft:")) throw new Error(`Save lesson "${lesson.title}" before duplicating this section.`);
        if (!lesson.contentUrl) throw new Error(`Save lesson "${lesson.title}" before duplicating this section.`);
        const response = await api.post(`${COURSE_API_PREFIX}/sections/${createdSection.id}/contents`, {
          title: lesson.title,
          contentType: lesson.type,
          contentUrl: lesson.contentUrl,
        });
        const createdLesson = response.data?.data;
        if (!createdLesson?.id) throw new Error("A lesson could not be copied.");
        lessons.push({ ...lesson, id: createdLesson.id, title: createdLesson.title, type: createdLesson.contentType as LessonType });
      }
      const duplicate = { id: createdSection.id, title: createdSection.title, lessons };
      commit([...sections, duplicate]);
      setOpenSections((current) => [...current, duplicate.id]);
      setActionMessage("Section and saved lessons duplicated.");
    } catch (error) {
      if (createdSectionId) {
        try {
          await api.delete(`${COURSE_API_PREFIX}/sections/${createdSectionId}`);
        } catch {
          /* Keep the original failure visible. */
        }
      }
      showError(error, "Could not duplicate section.");
    } finally {
      setBusyAction(false);
    }
  }

  function toggleSection(sectionId: string) {
    setOpenSections((current) => (current.includes(sectionId) ? current.filter((id) => id !== sectionId) : [...current, sectionId]));
  }

  function addLesson(sectionId: string) {
    if (disabled || busyAction) return;
    const id = `draft:${crypto.randomUUID()}`;
    const lesson: Lesson = { id, title: "New Lesson", description: "", type: "video", duration: "", freePreview: false, downloadable: false, contentUrl: "" };
    commit(sections.map((section) => (section.id === sectionId ? { ...section, lessons: [...section.lessons, lesson] } : section)));
    setOpenSections((current) => (current.includes(sectionId) ? current : [...current, sectionId]));
    setActiveLessonId(id);
    setActionError(null);
    setActionMessage("Add lesson details and save it to the course.");
  }

  async function saveLesson(updatedLesson: Lesson) {
    if (disabled || busyAction) return;
    const section = sections.find((item) => item.lessons.some((lesson) => lesson.id === updatedLesson.id));
    if (!section) return;
    const title = updatedLesson.title.trim();
    const contentUrl = updatedLesson.contentUrl?.trim() ?? "";
    if (!title) return showError(new Error("Lesson title is required."), "Lesson title is required.");
    if (!isPersistedLessonType(updatedLesson.type)) return showError(new Error("Choose a supported lesson type."), "Choose a supported lesson type.");
    if (!contentUrl) return showError(new Error("Lesson content is required."), "Lesson content is required.");
    if (contentUrl.length > 2000) return showError(new Error("Lesson content must be 2,000 characters or fewer."), "Lesson content must be 2,000 characters or fewer.");
    if (updatedLesson.type !== "article" && !(updatedLesson.type === "video" && isCourseVideoKey(contentUrl, courseId))) {
      try {
        requireHttpUrl(contentUrl, updatedLesson.type === "video" ? "Video URL" : "Resource URL");
      } catch (error) {
        return showError(error, "Enter a valid URL.");
      }
    }

    setBusyAction(true);
    setActionError(null);
    setActionMessage(null);
    try {
      const payload = { title, contentType: updatedLesson.type, contentUrl };
      const response = String(updatedLesson.id).startsWith("draft:")
        ? await api.post(`${COURSE_API_PREFIX}/sections/${section.id}/contents`, payload)
        : await api.patch(`${COURSE_API_PREFIX}/sections/${section.id}/contents/${updatedLesson.id}`, payload);
      const saved = response.data?.data;
      if (!saved?.id) throw new Error("Server did not return the saved lesson.");
      const lesson: Lesson = { ...updatedLesson, id: saved.id, title: saved.title, type: saved.contentType as LessonType, contentUrl: saved.contentUrl ?? contentUrl };
      commit(sections.map((item) => ({ ...item, lessons: item.lessons.map((current) => (current.id === updatedLesson.id ? lesson : current)) })));
      setActiveLessonId(null);
      setActionMessage("Lesson saved.");
    } catch (error) {
      showError(error, "Could not save lesson.");
    } finally {
      setBusyAction(false);
    }
  }

  async function uploadVideo(file: File, onProgress: (progress: number) => void) {
    setBusyAction(true);
    setBusyActionLabel("Uploading video to storage…");
    setActionError(null);
    setActionMessage(null);
    try {
      const response = await api.post(`${COURSE_API_PREFIX}/${courseId}/videos/presign`, {
        fileName: file.name,
        contentType: file.type,
        fileSize: file.size,
      });
      const upload = response.data?.data;
      if (!upload?.uploadUrl || typeof upload.uploadUrl !== "string" || !upload?.key || typeof upload.key !== "string") {
        throw new Error("The server did not return the video upload details.");
      }

      await axios.put(upload.uploadUrl, file, {
        headers: { "Content-Type": file.type },
        withCredentials: false,
        onUploadProgress: (event) => {
          const total = event.total ?? file.size;
          if (total > 0) onProgress(Math.round((event.loaded / total) * 100));
        },
      });
      onProgress(100);
      return upload.key as string;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Could not upload video."));
    } finally {
      setBusyActionLabel("Saving course content…");
      setBusyAction(false);
    }
  }

  async function deleteLesson(lessonId: string) {
    if (disabled || busyAction) return;
    const parent = sections.find((section) => section.lessons.some((lesson) => lesson.id === lessonId));
    if (!parent) return;
    setBusyAction(true);
    setActionError(null);
    try {
      if (!lessonId.startsWith("draft:")) await api.delete(`${COURSE_API_PREFIX}/sections/${parent.id}/contents/${lessonId}`);
      commit(sections.map((section) => ({ ...section, lessons: section.lessons.filter((lesson) => lesson.id !== lessonId) })));
      setActiveLessonId(null);
      setActionMessage("Lesson deleted.");
    } catch (error) {
      showError(error, "Could not delete lesson.");
    } finally {
      setBusyAction(false);
    }
  }

  async function duplicateLesson(lessonId: string) {
    if (disabled || busyAction) return;
    const parent = sections.find((section) => section.lessons.some((lesson) => lesson.id === lessonId));
    const source = parent?.lessons.find((lesson) => lesson.id === lessonId);
    if (!parent || !source || String(source.id).startsWith("draft:")) return;
    if (!source.contentUrl) return showError(new Error("Save the lesson content before duplicating it."), "Save the lesson content before duplicating it.");
    setBusyAction(true);
    setActionError(null);
    try {
      const response = await api.post(`${COURSE_API_PREFIX}/sections/${parent.id}/contents`, {
        title: `${source.title} Copy`,
        contentType: source.type,
        contentUrl: source.contentUrl,
      });
      const created = response.data?.data;
      if (!created?.id) throw new Error("Server did not return the duplicated lesson.");
      const duplicate: Lesson = { ...source, id: created.id, title: created.title, type: created.contentType as LessonType };
      commit(
        sections.map((section) => {
          if (section.id !== parent.id) return section;
          const index = section.lessons.findIndex((lesson) => lesson.id === lessonId);
          const lessons = [...section.lessons];
          lessons.splice(index + 1, 0, duplicate);
          return { ...section, lessons };
        }),
      );
      setActionMessage("Lesson duplicated.");
    } catch (error) {
      showError(error, "Could not duplicate lesson.");
    } finally {
      setBusyAction(false);
    }
  }

  function openLesson(lessonId: string) {
    setActiveLessonId((current) => (current === lessonId ? null : lessonId));
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#101537]">Course Content</h2>
          <p className="mt-1 text-sm text-slate-500">Organize the saved lessons into sections.</p>
        </div>
        <button
          type="button"
          onClick={() => void addSection()}
          disabled={disabled || isAddingSection}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          {isAddingSection ? "Creating…" : "Add Section"}
        </button>
      </div>

      {actionError && (
        <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      )}
      {actionMessage && (
        <p role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {actionMessage}
        </p>
      )}
      {busyAction && (
        <p role="status" className="mb-3 text-sm text-slate-500">
          {busyActionLabel}
        </p>
      )}

      <div className="space-y-4">
        {sections.map((section) => (
          <SectionItem
            key={String(section.id)}
            section={section}
            isOpen={openSections.includes(String(section.id))}
            activeLessonId={activeLessonId}
            onToggle={() => toggleSection(String(section.id))}
            onRename={() => void renameSection(String(section.id))}
            onDelete={() => void deleteSection(String(section.id))}
            onDuplicate={() => void duplicateSection(String(section.id))}
            onAddLesson={() => addLesson(String(section.id))}
            onOpenLesson={openLesson}
            onDeleteLesson={(lessonId) => void deleteLesson(lessonId)}
            onDuplicateLesson={(lessonId) => void duplicateLesson(lessonId)}
            onSaveLesson={(lesson) => void saveLesson(lesson)}
            onUploadVideo={uploadVideo}
            disabled={disabled || busyAction}
          />
        ))}
      </div>

      {sections.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-10 text-center">
          <p className="text-sm font-medium text-slate-700">No sections yet.</p>
          <p className="mt-1 text-sm text-slate-400">Start building your course by adding a section.</p>
        </div>
      )}
      <button
        type="button"
        onClick={() => void addSection()}
        disabled={disabled || isAddingSection}
        className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-violet-200 bg-white text-sm font-semibold text-violet-600 hover:border-violet-400 hover:bg-violet-50 disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
        Add Section
      </button>
    </div>
  );
}
