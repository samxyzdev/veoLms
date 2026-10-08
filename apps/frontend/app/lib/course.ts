const COURSE_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "all_levels", label: "All Levels" },
] as const;

export type CourseLevel = (typeof COURSE_LEVELS)[number]["value"];
export type CourseLevelLabel = (typeof COURSE_LEVELS)[number]["label"];

export const COURSE_LEVEL_OPTIONS: CourseLevelLabel[] = COURSE_LEVELS.map(
  ({ label }) => label,
);

export function getCourseLevelValue(label: string): CourseLevel | undefined {
  return COURSE_LEVELS.find((level) => level.label === label)?.value;
}

export function formatCourseLevel(
  level: CourseLevel | null,
  emptyLabel = "All Levels",
): string {
  return COURSE_LEVELS.find((courseLevel) => courseLevel.value === level)?.label ?? emptyLabel;
}
