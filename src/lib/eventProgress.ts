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
  totalCheckpoints: number;
  /** Checkpoints dated today or earlier. */
  reachedCheckpoints: number;
  /** 0–100, reached checkpoints out of the total. */
  percent: number;
  days: EventDay[];
};

export type EventDayProgressOptions = {
  /** Admin-selected checkpoint dates; empty means every day. */
  checkpointDates?: string[];
  /** When true, only the selected dates are used. */
  customCheckpoints?: boolean;
  /** Checkpoint dates hidden from display. */
  hiddenDates?: string[];
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
 * Checkpoint progress for a running multi-day event.
 *
 * Events of 5 days or fewer automatically checkpoint every day; longer events
 * use only the dates the admin added. Hidden dates are omitted from the rail.
 * Returns null unless the event starts before it ends, today (UTC) falls within
 * the event, and at least one visible checkpoint is available.
 */
export function getEventDayProgress(
  startAt?: string | null,
  endAt?: string | null,
  {
    checkpointDates,
    customCheckpoints = false,
    hiddenDates,
    titles,
    now = new Date(),
  }: EventDayProgressOptions = {},
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
  const selectedTimes = [
    ...new Set(
      (checkpointDates ?? [])
        .map((value) => parseDateParts(value))
        .filter((parts): parts is DateParts => parts !== null)
        .map((parts) => utcTime(parts))
        .filter((time) => time >= startTime && time <= endTime),
    ),
  ].sort((a, b) => a - b);

  const allTimes = Array.from(
    { length: totalDays },
    (_, index) => startTime + index * MS_PER_DAY,
  );
  const autoMode = totalDays <= 5 && !customCheckpoints;
  const baseTimes = autoMode ? allTimes : selectedTimes;
  const hiddenTimes = new Set(
    (hiddenDates ?? [])
      .map((value) => parseDateParts(value))
      .filter((parts): parts is DateParts => parts !== null)
      .map((parts) => utcTime(parts)),
  );
  const checkpointTimes = baseTimes.filter((time) => !hiddenTimes.has(time));

  if (checkpointTimes.length === 0) return null;

  const days: EventDay[] = checkpointTimes.map((time) => {
    const date = new Date(time);
    const parts: DateParts = {
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      day: date.getUTCDate(),
    };
    const dateTime = `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
    const title = titles?.[dateTime]?.trim();
    const current = time === todayTime;
    return {
      ...parts,
      weekday: date.toLocaleDateString("en-US", {
        weekday: "short",
        timeZone: "UTC",
      }),
      label: `${parts.day} ${MONTHS[parts.month - 1]}`,
      dateTime,
      ...(title ? { title } : {}),
      state: time < todayTime ? "complete" : current ? "current" : "upcoming",
      isToday: current,
    };
  });

  const reachedCheckpoints = days.filter(
    (day) => day.state !== "upcoming",
  ).length;

  return {
    totalCheckpoints: days.length,
    reachedCheckpoints,
    percent: Math.round((reachedCheckpoints / days.length) * 100),
    days,
  };
}
