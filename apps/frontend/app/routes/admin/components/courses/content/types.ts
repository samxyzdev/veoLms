// app/routes/admin/components/courses/content/types.ts

export type LessonType =
  "video" | "article" | "quiz" | "assignment" | "file" | "code";

export type Lesson = {
  id: number;
  title: string;
  description: string;
  type: LessonType;
  duration: string;
  videoUrl?: string;
  videoFile?: string;
  freePreview?: boolean;
  downloadable?: boolean;
};

export type Section = {
  id: number;
  title: string;
  lessons: Lesson[];
};
