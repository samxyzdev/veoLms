type CourseProgressProps = {
  completedLessons: number;
  totalLessons: number;
  percentage: number;
};

export function CourseProgress({
  completedLessons,
  totalLessons,
  percentage,
}: CourseProgressProps) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-slate-950">Course Content</h2>

        <span className="text-xs font-medium text-slate-500">
          {completedLessons} / {totalLessons} lessons
        </span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <span className="text-xs font-semibold text-slate-500">
          {percentage}%
        </span>
      </div>
    </div>
  );
}
