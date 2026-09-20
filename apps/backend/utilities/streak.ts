import { toDateKey } from "./date";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/** Current run of consecutive active days, including yesterday when today is idle. */
export function currentStreak(activeDates: Set<string>, today: Date): number {
  const cursor = new Date(today);
  if (!activeDates.has(toDateKey(cursor))) cursor.setDate(cursor.getDate() - 1);

  let streak = 0;
  while (activeDates.has(toDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/** Longest consecutive run of active days. */
export function bestStreak(activeDates: Set<string>): number {
  const timestamps = [...activeDates]
    .map((key) => new Date(`${key}T00:00:00`).getTime())
    .sort((a, b) => a - b);

  let best = 0;
  let run = 0;
  let previous: number | null = null;

  for (const timestamp of timestamps) {
    run = previous !== null && timestamp - previous === ONE_DAY_MS ? run + 1 : 1;
    if (run > best) best = run;
    previous = timestamp;
  }
  return best;
}
