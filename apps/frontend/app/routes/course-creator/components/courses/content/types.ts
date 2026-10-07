export type LessonType = "video" | "article" | "quiz" | "assignment";

export type Lesson = {
  id: string;
  title: string;
  description: string;
  type: LessonType;
  duration: string;
  freePreview: boolean;
  downloadable: boolean;
};

export type Section = {
  id: string;
  title: string;
  lessons: Lesson[];
};
