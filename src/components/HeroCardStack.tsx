import {
  ArrowUpRight,
  BookOpen,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  Compass,
  Search,
  Trophy,
  type LucideIcon,
} from "lucide-react";

const BOARD_ITEMS: Array<{
  title: string;
  meta: string;
  deadline: string;
  icon: LucideIcon;
  tint: string;
}> = [
  {
    title: "Research Fellowship",
    meta: "Academic · Grades 10–12",
    deadline: "Apr 14",
    icon: BookOpen,
    tint: "bg-[#D6ECFB] text-[#1F6FB2]",
  },
  {
    title: "Startup Case Sprint",
    meta: "Competition · Team event",
    deadline: "May 02",
    icon: Trophy,
    tint: "bg-[#A3E4D7]/45 text-[#0B4650]",
  },
  {
    title: "Policy Internship",
    meta: "Professional · Remote",
    deadline: "Rolling",
    icon: Briefcase,
    tint: "bg-[#FFE4C4]/80 text-[#B4532A]",
  },
];

const FILTERS = ["All", "Free", "Grade 11", "Local"] as const;

type HeroCardStackProps = {
  size: "sm" | "lg";
};

export function HeroCardStack({ size }: HeroCardStackProps) {
  const isLg = size === "lg";

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-[10%] rounded-full bg-[#A3E4D7]/30 blur-3xl" />
      <div className="absolute bottom-[10%] right-[4%] h-[42%] w-[42%] rounded-full bg-[#F28F6B]/16 blur-3xl" />

      <div
        className={
          isLg
            ? "absolute left-[1%] top-[11%] w-[38%] -rotate-6 rounded-3xl bg-[#0B4650] p-4 text-white"
            : "absolute left-0 top-[6%] w-[56%] -rotate-6 rounded-2xl bg-[#0B4650] p-3 text-white"
        }
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/55">
            Deadline map
          </span>
          <CalendarClock className="h-4 w-4 text-[#FFD3B6]" aria-hidden />
        </div>
        <div className={isLg ? "mt-5 space-y-3" : "mt-3 space-y-2"}>
          {[
            ["This week", "w-[72%]", "14"],
            ["This month", "w-[88%]", "32"],
            ["Rolling", "w-[54%]", "51"],
          ].map(([label, width, count]) => (
            <div key={label}>
              <div className="mb-1 flex items-center justify-between text-[10px] font-bold text-white/65">
                <span>{label}</span>
                <span>{count}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
                <div className={`h-full rounded-full bg-[#F28F6B] ${width}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={
          isLg
            ? "absolute right-[2%] top-[2%] w-[82%] rounded-3xl bg-white/92 p-5 shadow-[0_12px_14px_-12px_rgba(11,70,80,0.45)] ring-1 ring-white/80 backdrop-blur-xl xl:p-6"
            : "absolute right-0 top-[13%] w-[92%] rounded-3xl bg-white/94 p-4 shadow-[0_10px_12px_-10px_rgba(11,70,80,0.4)] ring-1 ring-white/80 backdrop-blur-xl"
        }
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#F9F8F6] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#0B4650]/60 ring-1 ring-[#0B4650]/8">
              <Compass className="h-3.5 w-3.5 text-[#F28F6B]" aria-hidden />
              Fit finder
            </span>
            <h2
              className={
                isLg
                  ? "font-display mt-4 max-w-sm text-3xl font-extrabold leading-tight tracking-[-0.02em] text-[#0B4650]"
                  : "font-display mt-3 max-w-64 text-xl font-extrabold leading-tight tracking-[-0.02em] text-[#0B4650]"
              }
            >
              A calmer way to choose what deserves your next tab.
            </h2>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#E0F2F1] text-[#0B4650]">
            <CheckCircle2 className="h-5 w-5" aria-hidden />
          </span>
        </div>

        <div
          className={
            isLg
              ? "mt-5 flex items-center gap-3 rounded-2xl bg-[#F9F8F6] px-4 py-3 ring-1 ring-[#0B4650]/8"
              : "mt-4 flex items-center gap-2 rounded-2xl bg-[#F9F8F6] px-3 py-2.5 ring-1 ring-[#0B4650]/8"
          }
        >
          <Search className="h-4 w-4 shrink-0 text-[#0B4650]/45" aria-hidden />
          <span className="truncate text-xs font-bold text-[#0B4650]/65 sm:text-sm">
            research, hackathons, internships…
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {FILTERS.map((filter, index) => (
            <span
              key={filter}
              className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${
                index === 0
                  ? "bg-[#0B4650] text-white"
                  : "bg-[#E0F2F1]/70 text-[#0B4650]"
              }`}
            >
              {filter}
            </span>
          ))}
        </div>

        <div className={isLg ? "mt-5 space-y-3" : "mt-4 space-y-2.5"}>
          {BOARD_ITEMS.map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-3 rounded-2xl bg-white/80 p-3 ring-1 ring-[#0B4650]/8"
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.tint}`}
              >
                <item.icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-sm font-extrabold text-[#0B4650]">
                  {item.title}
                </span>
                <span className="block truncate text-[11px] font-bold text-[#0B4650]/55">
                  {item.meta}
                </span>
              </span>
              <span className="shrink-0 rounded-full bg-[#F9F8F6] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#0B4650]/55">
                {item.deadline}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className={
          isLg
            ? "absolute bottom-[7%] left-[8%] flex w-[52%] rotate-2 items-center gap-3 rounded-3xl bg-[#F28F6B] p-4 text-[#0B4650]"
            : "absolute bottom-[4%] left-[5%] flex w-[72%] rotate-2 items-center gap-2 rounded-2xl bg-[#F28F6B] p-3 text-[#0B4650]"
        }
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/35">
          <ArrowUpRight className="h-5 w-5" aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-[#0B4650]/60">
            Next move
          </span>
          <span className="block truncate font-display text-sm font-extrabold">
            Open the full board
          </span>
        </span>
      </div>
    </div>
  );
}
