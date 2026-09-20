/** "Rahul Sharma" → "RS" (max 2 chars, used for avatars). */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Format a price stored as an integer into `₹1,299`. */
export function formatPrice(price: number): string {
  return `₹${price.toLocaleString("en-IN")}`;
}

/** Seconds → `1:35` (or `1:02:05` past an hour). Used by the course player. */
export function formatTimecode(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds || 0));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(rest)}`
    : `${minutes}:${pad(rest)}`;
}

/** Format an ISO date into `12 Aug 2026`. */
export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}