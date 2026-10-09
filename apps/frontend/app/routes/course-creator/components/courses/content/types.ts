export type LessonType = "video" | "article" | "resource" | "quiz" | "assignment" | "file" | "code";

export type Lesson = {
  id: string | number;
  title: string;
  description: string;
  type: LessonType;
  duration: string | number;
  freePreview: boolean;
  downloadable: boolean;
  contentUrl?: string;
  videoUrl?: string;
  videoFile?: string;
  resourceUrl?: string;
};

export type Section = {
  id: string | number;
  title: string;
  lessons: Lesson[];
};
