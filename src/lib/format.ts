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
/** Strip common Markdown formatting so descriptions render as plain text in cards. */
export function stripMarkdown(value?: string | null): string {
  if (!value) return "";
  return value
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/[*_~>|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatDeadline(deadline?: string | null): string {
  if (!deadline) return "Rolling deadline";
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(deadline.trim());
  if (!match) return deadline;
  const [, year, month, day] = match;
  const monthLabel = MONTHS[Number(month) - 1];
  if (!monthLabel) return deadline;
  return `${Number(day)} ${monthLabel} ${year}`;
}

type DateParts = { year: number; month: number; day: number };

function parseDateParts(value?: string | null): DateParts | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!MONTHS[month - 1] || day < 1 || day > 31) return null;
  return { year, month, day };
}

function compareDateParts(a: DateParts, b: DateParts): number {
  return a.year - b.year || a.month - b.month || a.day - b.day;
}

function shortDate(parts: DateParts): string {
  return `${parts.day} ${MONTHS[parts.month - 1]} ${parts.year}`;
}

/**
 * Human label for when an event happens, collapsing multi-day ranges:
 *
 *   14 Nov 2026            single day
 *   14–15 Nov 2026         same month
 *   28 Feb – 2 Mar 2026    same year
 *   30 Dec 2026 – 2 Jan 2027
 *
 * Returns null when no start date is set so callers can fall back to the
 * free-text deadline.
 */
export function formatEventDate(
  start?: string | null,
  end?: string | null,
): string | null {
  const from = parseDateParts(start);
  if (!from) return null;
  const to = parseDateParts(end);
  if (!to || compareDateParts(to, from) <= 0) return shortDate(from);
  if (from.year === to.year && from.month === to.month) {
    return `${from.day}–${to.day} ${MONTHS[from.month - 1]} ${from.year}`;
  }
  if (from.year === to.year) {
    return `${from.day} ${MONTHS[from.month - 1]} – ${to.day} ${MONTHS[to.month - 1]} ${from.year}`;
  }
  return `${shortDate(from)} – ${shortDate(to)}`;
}

type CardDateSource = {
  deadline?: string | null;
  eventStartAt?: string | null;
  eventEndAt?: string | null;
};

/**
 * Label for the date chip on cards. An explicit display deadline always wins
 * (it may be copy like "Applications due Feb 28"); the event's date range is
 * the fallback — and the only automatic option.
 */
export function formatCardDate(item: CardDateSource): string | null {
  const deadline = item.deadline?.trim();
  if (deadline) return formatDeadline(deadline);
  return formatEventDate(item.eventStartAt, item.eventEndAt);
}
