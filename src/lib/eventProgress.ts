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

const MS_PER_DAY = 24 * 60 * 60 * 1000;

type DateParts = { year: number; month: number; day: number };

export type EventDayState = "complete" | "current" | "upcoming";

export type EventDay = DateParts & {
  /** Short weekday, e.g. "Thu". */
  weekday: string;
  /** Short date label, e.g. "14 Nov". */
  label: string;
  /** Value for `<time dateTime>` (YYYY-MM-DD). */
  dateTime: string;
  /** Optional admin-provided title for this day. */
  title?: string;
  state: EventDayState;
  isToday: boolean;
};

export type EventDayProgress = {
  totalDays: number;
  /** 1-based day number for today. */
  currentDay: number;
  /** 0–100, filled through today's checkpoint. */
  percent: number;
  days: EventDay[];
};

export type EventDayProgressOptions = {
  /** Checkpoint titles keyed by `YYYY-MM-DD`. */
  titles?: Record<string, string>;
  now?: Date;
};

/**
 * Parses the leading calendar date of an ISO value. Event dates are stored as
 * date-only values at UTC midnight, so all comparisons use UTC days to keep
 * every viewer on the same date.
 */
function parseDateParts(value?: string | null): DateParts | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!MONTHS[month - 1] || day < 1 || day > 31) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}

function utcTime(parts: DateParts): number {
  return Date.UTC(parts.year, parts.month - 1, parts.day);
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/**
 * Day-by-day checkpoint progress for a running multi-day event.
 *
 * Returns null unless the event starts before it ends and today (UTC) falls
 * on or between the start and end dates. Callers hide the tracker for null.
 */
export function getEventDayProgress(
  startAt?: string | null,
  endAt?: string | null,
  { titles, now = new Date() }: EventDayProgressOptions = {},
): EventDayProgress | null {
  const start = parseDateParts(startAt);
  const end = parseDateParts(endAt);
  if (!start || !end) return null;

  const startTime = utcTime(start);
  const endTime = utcTime(end);
  if (endTime <= startTime) return null;

  const todayTime = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );
  if (todayTime < startTime || todayTime > endTime) return null;

  const totalDays = Math.round((endTime - startTime) / MS_PER_DAY) + 1;
  const currentDay = Math.round((todayTime - startTime) / MS_PER_DAY) + 1;

  const days: EventDay[] = Array.from({ length: totalDays }, (_, index) => {
    const date = new Date(startTime + index * MS_PER_DAY);
    const parts: DateParts = {
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      day: date.getUTCDate(),
    };
    const dayNumber = index + 1;
    const dateTime = `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
    const title = titles?.[dateTime]?.trim();
    return {
      ...parts,
      weekday: date.toLocaleDateString("en-US", {
        weekday: "short",
        timeZone: "UTC",
      }),
      label: `${parts.day} ${MONTHS[parts.month - 1]}`,
      dateTime,
      ...(title ? { title } : {}),
      state:
        dayNumber < currentDay
          ? "complete"
          : dayNumber === currentDay
            ? "current"
            : "upcoming",
      isToday: dayNumber === currentDay,
    };
  });

  return {
    totalDays,
    currentDay,
    percent: Math.round((currentDay / totalDays) * 100),
    days,
  };
}
