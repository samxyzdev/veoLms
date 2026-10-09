export type PlayerLesson = {
  id: string;
  title: string;
  description: string;
  contentType: string;
  contentUrl: string | null;
  durationSeconds: number | null;
  sectionId: string;
  sectionTitle: string;
  sectionNumber: number;
  lessonNumber: number;
  isCompleted: boolean;
};

export type PlayerSection = {
  id: string;
  number: number;
  title: string;
  lessons: PlayerLesson[];
};

export type CoursePlayerData = {
  course: {
    id: string;
    title: string;
    description: string;
    thumbnail: string | null;
    categoryName: string;
    instructorName: string;
    level: string;
  };
  sections: PlayerSection[];
  lessons: PlayerLesson[];
  progress: {
    completedLessons: number;
    totalLessons: number;
    percentage: number;
  };
  currentLessonId: string | null;
  learningOutcomes: string[];
};

export function formatLessonDuration(seconds: number | null | undefined) {
  if (seconds == null || !Number.isFinite(seconds) || seconds <= 0) return "—";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes} min`;
  return `${remainingSeconds}s`;
}

export function formatVideoTime(seconds: number | null | undefined) {
  if (seconds == null || !Number.isFinite(seconds) || seconds <= 0) return "—";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}
