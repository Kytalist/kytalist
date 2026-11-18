import { Check } from "lucide-react";
import type { Listing } from "@/lib/api/types";
import { getEventDayProgress } from "@/lib/eventProgress";

type Props = {
  item: Listing;
};

/**
 * Day-by-day checkpoint rail for multi-day events. Rendered on the server and
 * visible only while the event is running; hidden for single-day, upcoming,
 * finished, or admin-disabled events.
 */
export function EventProgressTracker({ item }: Props) {
  if (item.eventProgressEnabled === false) return null;

  const progress = getEventDayProgress(item.eventStartAt, item.eventEndAt, {
    checkpointDates: item.eventCheckpointDates,
    customCheckpoints: item.eventCheckpointsCustomized,
    hiddenDates: item.eventCheckpointHiddenDates,
    titles: item.eventDayTitles,
  });
  if (!progress) return null;

  return (
    <section
      aria-labelledby="event-progress"
      className="mt-8 rounded-3xl border border-[#0B4650]/10 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <p
          id="event-progress"
          className="text-xs font-bold uppercase tracking-wider text-[#0B4650]/45"
        >
          Event progress
        </p>
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5" aria-hidden>
            <span className="progress-current-pulse absolute inset-0 rounded-full bg-[#F28F6B]" />
            <span className="progress-current-beat relative h-2.5 w-2.5 rounded-full bg-[#F28F6B]" />
          </span>
          <span className="rounded-full bg-[#A3E4D7] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-[#0B4650]">
            In progress
          </span>
        </div>
      </div>

      <div className="hide-scroll mt-5 overflow-x-auto px-1 pb-2 pt-7">
        <ol className="mx-auto flex w-full max-w-3xl">
          {progress.days.map((day, index) => {
            const complete = day.state === "complete";
            const current = day.state === "current";
            const segmentFilled = day.state !== "upcoming";
            const delay = `${Math.min(index, 12) * 70}ms`;
            return (
              <li
                key={day.dateTime}
                aria-current={current ? "step" : undefined}
                style={{ animationDelay: delay }}
                className="progress-checkpoint relative flex min-w-24 flex-1 flex-col items-center px-2 text-center"
              >
                {index > 0 ? (
                  <span
                    aria-hidden
                    style={{
                      animationDelay: `${Math.min(index, 12) * 70 + 40}ms`,
                    }}
                    className={`progress-line absolute left-[calc(-50%+26px)] top-[18px] h-1 w-[calc(100%-52px)] ${
                      segmentFilled ? "bg-[#0B4650]" : "bg-[#0B4650]/12"
                    }`}
                  />
                ) : null}
                <span
                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${
                    complete
                      ? "bg-[#0B4650] text-white"
                      : current
                        ? "progress-current-beat bg-[#F28F6B] text-white ring-8 ring-[#F28F6B]/15"
                        : "border-[3px] border-[#0B4650]/20 bg-white"
                  }`}
                >
                  {current ? (
                    <span
                      aria-hidden
                      className="progress-current-pulse absolute inset-0 rounded-full bg-[#F28F6B]/50"
                    />
                  ) : null}
                  {complete ? (
                    <Check className="h-5 w-5" strokeWidth={3} aria-hidden />
                  ) : current ? (
                    <span
                      className="relative h-3 w-3 rounded-full bg-white"
                      aria-hidden
                    />
                  ) : null}
                </span>
                <time
                  dateTime={day.dateTime}
                  className="mt-3 block text-xs font-bold uppercase tracking-wide text-[#0B4650]/70 sm:text-[13px]"
                >
                  {day.weekday}
                </time>
                <span className="mt-0.5 block text-[11px] font-semibold text-[#0B4650]/45 sm:text-xs">
                  {day.label}
                </span>
                {day.title ? (
                  <span className="mt-1.5 line-clamp-2 max-w-32 text-xs font-semibold leading-snug text-[#0B4650] sm:text-sm">
                    {day.title}
                  </span>
                ) : null}
                <span className="mt-1.5 flex h-5 items-center justify-center">
                  {day.isToday ? (
                    <span className="rounded-full bg-[#F28F6B]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#B4532A]">
                      Today
                    </span>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
