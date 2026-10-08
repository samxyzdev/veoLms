/** Returns up to two initials, with a stable fallback for empty names. */
export function getInitials(name: string, fallback = "U"): string {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return initials || fallback;
}
