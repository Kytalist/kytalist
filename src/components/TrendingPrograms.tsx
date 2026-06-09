import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  CalendarClock,
} from "lucide-react";
import type { Listing } from "@/lib/api/types";
import { deriveInitials, deriveLogoStyle, deriveTagColor } from "@/lib/visual";

type Props = {
  items: Listing[];
};

function hrefForListing(item: Listing): string {
  const base =
    item.category === "academic"
      ? "/academic"
      : item.category === "professional"
        ? "/professional"
        : item.category === "competition"
          ? "/competition"
          : "/opportunities";
  return `${base}#${item.id}`;
}

function deadlineLabel(item: Listing): string {
  return item.deadline ?? "Rolling deadline";
}

export function TrendingPrograms({ items }: Props) {
  if (items.length === 0) return null;

  const featured = items.slice(0, 2);
  const compact = items.slice(2, 8);

  return (
    <section className="mx-auto max-w-[1440px] px-4 pb-20 pt-4 sm:px-6 lg:pb-24">
      <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#0B4650]/10 bg-white/50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0B4650] shadow-sm backdrop-blur-md">
            <Bookmark className="h-3.5 w-3.5 text-[#F28F6B]" aria-hidden />
            Trending now
          </span>
          <h2 className="font-display max-w-xl text-3xl font-bold leading-tight tracking-tight text-[#0B4650] text-balance sm:text-4xl">
            Students are <span className="text-gradient">eyeing these.</span>
          </h2>
          <p className="max-w-xl text-[#0B4650]/65 text-pretty">
            The most-bookmarked programs this month. Deadlines are coming up.
          </p>
        </div>
        <Link
          href="/activities"
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-[#0B4650]/15 bg-white/70 px-5 py-2.5 text-sm font-semibold text-[#0B4650] shadow-sm backdrop-blur-md transition-colors hover:border-[#0B4650]/25 hover:bg-white sm:self-auto"
        >
          View all
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      {featured.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2">
          {featured.map((item) => {
            const logo = deriveLogoStyle(item.id);
            const tagColor = deriveTagColor(item.id);
            return (
              <Link
                key={item.id}
                href={hrefForListing(item)}
                className="card-surface squircle group flex flex-col p-6 sm:p-7"
              >
                <div className="mb-4 flex items-start gap-4">
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${logo.tint} ${logo.text} font-display text-sm font-bold`}
                    aria-hidden
                  >
                    {deriveInitials(item.org)}
                  </span>
                  <div className="flex min-w-0 flex-col gap-1">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider ${tagColor}`}
                    >
                      {item.badge}
                    </span>
                    <h3 className="font-display text-lg font-bold leading-snug text-[#0B4650] transition-colors group-hover:text-[#F28F6B] sm:text-xl">
                      {item.title}
                    </h3>
                    <p className="truncate text-sm font-medium text-[#0B4650]/60">
                      {item.org}
                    </p>
                  </div>
                </div>

                {item.description ? (
                  <p className="mb-5 text-sm font-medium leading-relaxed text-[#0B4650]/75 text-pretty line-clamp-3">
                    {item.description}
                  </p>
                ) : null}

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#0B4650]/10 pt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B4650]/70">
                    <CalendarClock
                      className="h-3.5 w-3.5 text-[#0B4650]/50"
                      aria-hidden
                    />
                    {deadlineLabel(item)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#0B4650] transition-colors group-hover:text-[#F28F6B]">
                    View details
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : null}

      {compact.length > 0 ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {compact.map((item) => {
            const logo = deriveLogoStyle(item.id);
            const tagColor = deriveTagColor(item.id);
            return (
              <Link
                key={item.id}
                href={hrefForListing(item)}
                className="card-surface squircle group flex items-center gap-3 p-4"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${logo.tint} ${logo.text} font-display text-[11px] font-bold`}
                  aria-hidden
                >
                  {deriveInitials(item.org)}
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-display text-sm font-bold text-[#0B4650] transition-colors group-hover:text-[#F28F6B]">
                    {item.title}
                  </span>
                  <span className="truncate text-[11px] font-medium text-[#0B4650]/55">
                    {item.org}
                  </span>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-0.5">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${tagColor}`}
                  >
                    {item.badge}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#0B4650]/60">
                    <CalendarClock className="h-3 w-3" aria-hidden />
                    {deadlineLabel(item)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
