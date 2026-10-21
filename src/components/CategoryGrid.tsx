import Link from "next/link";
import {
  Award,
  BookOpen,
  Briefcase,
  Compass,
  CalendarClock,
  CircleDollarSign,
  Clock,
  FlaskConical,
  Grid3x3,
  HandHeart,
  Microscope,
  Sparkles,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

type Category = {
  href: string;
  title: string;
  blurb: string;
  icon: LucideIcon;
  tint: string;
  iconColor: string;
  comingSoon?: boolean;
};

const categories: Category[] = [
  {
    href: "/activities",
    title: "Browse all",
    blurb: "See everything",
    icon: Grid3x3,
    tint: "bg-[#E0F2F1]",
    iconColor: "text-[#0B4650]",
  },
  {
    href: "/academic",
    title: "Academic",
    blurb: "Olympiads, research & debate",
    icon: BookOpen,
    tint: "bg-[#D6ECFB]",
    iconColor: "text-[#1F6FB2]",
  },
  {
    href: "/academic?type=Olympiad",
    title: "Olympiad",
    blurb: "Math, science & more",
    icon: Trophy,
    tint: "bg-[#FADCD0]",
    iconColor: "text-[#B4532A]",
  },
  {
    href: "/academic?type=Research",
    title: "Research",
    comingSoon: true,
    blurb: "Publish real work",
    icon: Microscope,
    tint: "bg-[#E4D7F4]",
    iconColor: "text-[#5E3BB4]",
  },
  {
    href: "/competition",
    title: "Competition",
    blurb: "Hackathons & tech contests",
    icon: Sparkles,
    tint: "bg-[#FFF3C9]",
    iconColor: "text-[#B08D1A]",
  },
  {
    href: "/competition?type=Hackathon",
    title: "Hackathon",
    comingSoon: true,
    blurb: "Build fast, win prizes",
    icon: FlaskConical,
    tint: "bg-[#E0F2F1]",
    iconColor: "text-[#0B4650]",
  },
  {
    href: "/professional",
    title: "Professional",
    blurb: "Internships & mentorships",
    icon: Briefcase,
    tint: "bg-[#A3E4D7]/40",
    iconColor: "text-[#0B8A6B]",
  },
  {
    href: "/professional?cost=Free",
    title: "Free programs",
    blurb: "No cost to apply or attend",
    icon: CircleDollarSign,
    tint: "bg-[#FFE4C4]/70",
    iconColor: "text-[#B4532A]",
  },
  {
    href: "/opportunities",
    title: "Opportunities",
    blurb: "Exchange & conferences",
    icon: Award,
    tint: "bg-[#E4D7F4]",
    iconColor: "text-[#5E3BB4]",
  },
  {
    href: "/opportunities?type=MUN",
    title: "MUN",
    blurb: "Model United Nations",
    icon: Users,
    tint: "bg-[#FADCD0]",
    iconColor: "text-[#B4532A]",
  },
  {
    href: "/activities?sort=deadline",
    title: "Deadlines soon",
    blurb: "Apply before it's too late",
    icon: Clock,
    tint: "bg-[#E0F2F1]",
    iconColor: "text-[#0B4650]",
  },
  {
    href: "/academic?type=Debate",
    title: "Debate",
    comingSoon: true,
    blurb: "Public speaking & MUN",
    icon: HandHeart,
    tint: "bg-[#A3E4D7]/40",
    iconColor: "text-[#0B8A6B]",
  },

  {
    href: "/academic?type=Quiz",
    title: "Quiz",
    blurb: "Knowledge challenges",
    icon: Trophy,
    tint: "bg-[#FADCD0]",
    iconColor: "text-[#B4532A]",
    comingSoon: true,
  },
  {
    href: "/academic?type=WritingCompetition",
    title: "Writing Competition",
    blurb: "Essays & creative writing",
    icon: BookOpen,
    tint: "bg-[#D6ECFB]",
    iconColor: "text-[#1F6FB2]",
    comingSoon: true,
  },
  {
    href: "/professional?type=Internship",
    title: "Internship",
    blurb: "Real-world experience",
    icon: Briefcase,
    tint: "bg-[#A3E4D7]/40",
    iconColor: "text-[#0B8A6B]",
    comingSoon: true,
  },
  {
    href: "/professional?type=Mentorship",
    title: "Mentorship",
    blurb: "Guidance from experts",
    icon: Users,
    tint: "bg-[#FFE4C4]/70",
    iconColor: "text-[#B4532A]",
    comingSoon: true,
  },
  {
    href: "/competition?type=Startup",
    title: "Startup & Case Solving",
    blurb: "Business challenges",
    icon: Sparkles,
    tint: "bg-[#FFF3C9]",
    iconColor: "text-[#B08D1A]",
    comingSoon: true,
  },
  {
    href: "/competition?type=FilmArt",
    title: "Film and Art",
    blurb: "Creative competitions",
    icon: Award,
    tint: "bg-[#E4D7F4]",
    iconColor: "text-[#5E3BB4]",
    comingSoon: true,
  },
  {
    href: "/opportunities?type=ExchangeProgram",
    title: "Exchange Program",
    blurb: "Study abroad",
    icon: Compass,
    tint: "bg-[#FADCD0]",
    iconColor: "text-[#B4532A]",
    comingSoon: true,
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
          <p className="max-w-sm text-[#0B4650]/75 text-pretty">
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

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {categories.map((c) => {
          const inner = (
            <>
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${c.tint} ${c.iconColor} ${c.comingSoon ? "" : "transition-transform duration-300 group-hover:scale-110"}`}
              >
                <c.icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="font-display text-sm font-bold text-[#0B4650] transition-colors group-hover:text-[#F28F6B]">
                  {c.title}
                </span>
                <span className="line-clamp-2 text-xs font-medium text-[#0B4650]/75">
                  {c.blurb}
                </span>
              </span>
            </>
          );

          if (c.comingSoon) {
            return (
              <div
                key={c.title}
                aria-disabled="true"
                className="card-surface squircle relative flex cursor-not-allowed items-center gap-3 overflow-hidden p-4 opacity-80 sm:gap-4 sm:p-5"
              >
                {inner}
                <span className="pointer-events-none absolute -right-10 top-5 rotate-45 bg-red-600 px-12 py-1 text-center text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                  Coming soon
                </span>
              </div>
            );
          }

          return (
            <Link
              key={c.title}
              href={c.href}
              className="card-surface squircle group flex items-center gap-3 p-4 sm:gap-4 sm:p-5"
            >
              {inner}
            </Link>
          );
        })}
      </div>

    </section>
  );
}
