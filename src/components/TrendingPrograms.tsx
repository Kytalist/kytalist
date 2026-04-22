import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarClock, Bookmark } from "lucide-react";

type TrendingItem = {
  id: string;
  tag: string;
  tagColor: string;
  title: string;
  org: string;
  description?: string;
  deadline: string;
  href: string;
  logoInitials: string;
  logoTint: string;
  logoText: string;
};

const featured: TrendingItem[] = [
  {
    id: "rsi",
    tag: "STEM",
    tagColor: "text-[#5E3BB4]",
    title: "Research Science Institute (RSI)",
    org: "Center for Excellence in Education",
    description:
      "Six-week summer program at MIT. Free. Possibly the most prestigious STEM program for high schoolers.",
    deadline: "Due January 15, 2026",
    href: "/activities#rsi",
    logoInitials: "MIT",
    logoTint: "bg-[#0B4650]",
    logoText: "text-white",
  },
  {
    id: "telluride",
    tag: "Leadership",
    tagColor: "text-[#5E3BB4]",
    title: "Telluride Association Summer Program",
    org: "Telluride Association",
    description:
      "Fully-funded six-week intellectual deep-dive at Cornell. Ultra-selective — under 5% acceptance.",
    deadline: "Due January 4, 2026",
    href: "/activities#telluride",
    logoInitials: "TA",
    logoTint: "bg-[#F28F6B]",
    logoText: "text-white",
  },
];

const compact: TrendingItem[] = [
  {
    id: "sci",
    tag: "STEM",
    tagColor: "text-[#5E3BB4]",
    title: "Summer Science Program",
    org: "Summer Science Program",
    deadline: "February 7, 2026",
    href: "/activities#sci",
    logoInitials: "SS",
    logoTint: "bg-white border border-[#0B4650]/15",
    logoText: "text-[#0B4650]",
  },
  {
    id: "wharton",
    tag: "Business",
    tagColor: "text-[#0B8A6B]",
    title: "Wharton Global Youth",
    org: "Wharton School",
    deadline: "January 31, 2026",
    href: "/activities#wharton",
    logoInitials: "WGC",
    logoTint: "bg-[#0B2E35]",
    logoText: "text-white",
  },
  {
    id: "clark",
    tag: "STEM",
    tagColor: "text-[#5E3BB4]",
    title: "Clark Scholars Program",
    org: "Texas Tech University",
    deadline: "February 15, 2026",
    href: "/activities#clark",
    logoInitials: "CS",
    logoTint: "bg-[#5E3BB4]",
    logoText: "text-white",
  },
  {
    id: "garcia",
    tag: "STEM",
    tagColor: "text-[#5E3BB4]",
    title: "Garcia Summer Program",
    org: "Stony Brook University",
    deadline: "February 28, 2026",
    href: "/activities#garcia",
    logoInitials: "SB",
    logoTint: "bg-[#B4532A]",
    logoText: "text-white",
  },
  {
    id: "mites",
    tag: "STEM",
    tagColor: "text-[#5E3BB4]",
    title: "MITES Summer",
    org: "MIT Office of Engineering Outreach",
    deadline: "February 1, 2026",
    href: "/activities#mites",
    logoInitials: "MIT",
    logoTint: "bg-[#0B2E35]",
    logoText: "text-white",
  },
  {
    id: "usamo",
    tag: "STEM",
    tagColor: "text-[#5E3BB4]",
    title: "USAMO Qualifier",
    org: "Mathematical Association of America",
    deadline: "March 2026",
    href: "/activities#usamo",
    logoInitials: "MA",
    logoTint: "bg-[#5E3BB4]",
    logoText: "text-white",
  },
];

export function TrendingPrograms() {
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
          View all 1,640+
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {featured.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="card-surface group flex flex-col rounded-[2rem] p-6 sm:p-7"
          >
            <div className="mb-4 flex items-start gap-4">
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.logoTint} ${item.logoText} font-display text-sm font-bold`}
                aria-hidden
              >
                {item.logoInitials}
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider ${item.tagColor}`}
                >
                  {item.tag}
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
              <p className="mb-5 text-sm font-medium leading-relaxed text-[#0B4650]/75 text-pretty">
                {item.description}
              </p>
            ) : null}

            <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#0B4650]/10 pt-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B4650]/70">
                <CalendarClock
                  className="h-3.5 w-3.5 text-[#0B4650]/50"
                  aria-hidden
                />
                {item.deadline}
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#0B4650] transition-colors group-hover:text-[#F28F6B]">
                View details
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {compact.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="card-surface group flex items-center gap-3 rounded-2xl p-4"
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.logoTint} ${item.logoText} font-display text-[11px] font-bold`}
              aria-hidden
            >
              {item.logoInitials}
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
                className={`text-[10px] font-bold uppercase tracking-wider ${item.tagColor}`}
              >
                {item.tag}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#0B4650]/60">
                <CalendarClock className="h-3 w-3" aria-hidden />
                {item.deadline}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
