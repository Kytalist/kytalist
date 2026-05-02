import Link from "next/link";
import {
  Award,
  Briefcase,
  CalendarClock,
  CircleDollarSign,
  Clock,
  FlaskConical,
  Grid3x3,
  HandHeart,
  Microscope,
  Sparkles,
  Sun,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

type Category = {
  href: string;
  title: string;
  blurb: string;
  count: string;
  icon: LucideIcon;
  tint: string;
  iconColor: string;
};

const categories: Category[] = [
  {
    href: "/activities",
    title: "Browse all",
    blurb: "See everything",
    count: "1,640+ programs",
    icon: Grid3x3,
    tint: "bg-[#E0F2F1]",
    iconColor: "text-[#0B4650]",
  },
  {
    href: "/camps",
    title: "Summer programs",
    blurb: "Camps, intensives & residentials",
    count: "198+",
    icon: Sun,
    tint: "bg-[#FFE4C4]/70",
    iconColor: "text-[#B4532A]",
  },
  {
    href: "/activities?type=Competition",
    title: "Competitions",
    blurb: "Math, science & more",
    count: "245+",
    icon: Trophy,
    tint: "bg-[#FADCD0]",
    iconColor: "text-[#B4532A]",
  },
  {
    href: "/activities?type=Research",
    title: "Research",
    blurb: "Publish real work",
    count: "203+",
    icon: Microscope,
    tint: "bg-[#E4D7F4]",
    iconColor: "text-[#5E3BB4]",
  },
  {
    href: "/activities?cost=Free",
    title: "Free programs",
    blurb: "No cost to apply or attend",
    count: "1,234+",
    icon: CircleDollarSign,
    tint: "bg-[#A3E4D7]/40",
    iconColor: "text-[#0B8A6B]",
  },
  {
    href: "/internships",
    title: "Scholarships",
    blurb: "Win money for college",
    count: "166+",
    icon: Award,
    tint: "bg-[#FFE4C4]/70",
    iconColor: "text-[#B4532A]",
  },
  {
    href: "/activities?type=STEM",
    title: "STEM",
    blurb: "Engineering, CS, biotech",
    count: "706+",
    icon: FlaskConical,
    tint: "bg-[#D6ECFB]",
    iconColor: "text-[#1F6FB2]",
  },
  {
    href: "/activities?type=Leadership",
    title: "Leadership",
    blurb: "Conferences & fellowships",
    count: "272+",
    icon: Users,
    tint: "bg-[#E4D7F4]",
    iconColor: "text-[#5E3BB4]",
  },
  {
    href: "/activities?sort=selective",
    title: "Most selective",
    blurb: "The ones colleges notice",
    count: "59+",
    icon: Sparkles,
    tint: "bg-[#FFF3C9]",
    iconColor: "text-[#B08D1A]",
  },
  {
    href: "/internships",
    title: "Business",
    blurb: "Finance, startups & econ",
    count: "130+",
    icon: Briefcase,
    tint: "bg-[#A3E4D7]/40",
    iconColor: "text-[#0B8A6B]",
  },
  {
    href: "/activities?sort=deadline",
    title: "Deadlines soon",
    blurb: "Apply before it's too late",
    count: "57+",
    icon: Clock,
    tint: "bg-[#E0F2F1]",
    iconColor: "text-[#0B4650]",
  },
  {
    href: "/activities?type=Volunteer",
    title: "Community service",
    blurb: "Volunteer & give back",
    count: "113+",
    icon: HandHeart,
    tint: "bg-[#FADCD0]",
    iconColor: "text-[#B4532A]",
  },
];

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 pb-20 pt-4 sm:px-6 lg:pb-24">
      <div className="mb-10 flex flex-col gap-3 sm:mb-12">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#0B4650]/10 bg-white/50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0B4650] shadow-sm backdrop-blur-md">
          <CalendarClock className="h-3.5 w-3.5 text-[#F28F6B]" aria-hidden />
          Explore categories
        </span>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <h2 className="font-display max-w-xl text-3xl font-bold leading-tight tracking-tight text-[#0B4650] text-balance sm:text-4xl">
            What are you <span className="text-gradient">into?</span>
          </h2>
          <p className="max-w-sm text-[#0B4650]/65 text-pretty">
            Jump into any category &mdash; or{" "}
            <Link
              href="/activities"
              className="font-semibold text-[#0B4650] underline-offset-4 hover:underline"
            >
              browse everything
            </Link>
            .
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {categories.map((c) => (
          <Link
            key={c.title}
            href={c.href}
            className="card-surface squircle group flex items-center gap-4 p-4 sm:p-5"
          >
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${c.tint} ${c.iconColor} transition-transform duration-300 group-hover:scale-110`}
            >
              <c.icon className="h-5 w-5" aria-hidden />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="font-display text-sm font-bold text-[#0B4650] transition-colors group-hover:text-[#F28F6B]">
                {c.title}
              </span>
              <span className="truncate text-xs font-medium text-[#0B4650]/65">
                {c.blurb}
              </span>
              <span className="mt-1 text-[11px] font-bold uppercase tracking-wider text-[#0B4650]/45">
                {c.count}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
