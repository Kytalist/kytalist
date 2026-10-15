const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** Join level labels, e.g. ["Class 9", "Class 10"] -> "Class 9 · Class 10". */
export function formatGrades(grades?: string[]): string | null {
  if (!grades || grades.length === 0) return null;
  return grades.join(" · ");
}

/**
 * Turn an ISO date deadline (e.g. "2026-09-25") into "25 Sep 2026".
 * Any other free-text deadline is returned unchanged, and a missing one
 * falls back to "Rolling deadline".
 */
export function formatDeadline(deadline?: string | null): string {
  if (!deadline) return "Rolling deadline";
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(deadline.trim());
  if (!match) return deadline;
  const [, year, month, day] = match;
  const monthLabel = MONTHS[Number(month) - 1];
  if (!monthLabel) return deadline;
  return `${Number(day)} ${monthLabel} ${year}`;
}
