import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  CalendarClock,
  Compass,
  Search,
  Sparkles,
  Trophy,
} from "lucide-react";
import { CategoryGrid } from "@/components/CategoryGrid";
import { FeaturedEventsCarousel } from "@/components/FeaturedEventsCarousel";
import { FinalCta } from "@/components/FinalCta";
import { HeroCardStack } from "@/components/HeroCardStack";
import { MeshBackground } from "@/components/MeshBackground";
import { NewsletterBanner } from "@/components/NewsletterBanner";
import { Testimonials } from "@/components/Testimonials";
import { TrendingPrograms } from "@/components/TrendingPrograms";
import { getFeatured, getTrending } from "@/lib/api/listings";
import { safeFetch } from "@/lib/api/safeFetch";
import type { Listing } from "@/lib/api/types";

const pillars = [
  {
    href: "/academic",
    title: "Academic",
    blurb: "Olympiads, research, quizzes & debate.",
    icon: BookOpen,
    tint: "bg-[#E0F2F1]",
  },
  {
    href: "/professional",
    title: "Professional",
    blurb: "Internships & mentorships.",
    icon: Briefcase,
    tint: "bg-[#FFE4C4]/80",
  },
  {
    href: "/competition",
    title: "Competition",
    blurb: "Hackathons, tech contests & startup challenges.",
    icon: Trophy,
    tint: "bg-[#A3E4D7]/40",
  },
  {
    href: "/opportunities",
    title: "Opportunities",
    blurb: "Exchange programs, conferences & MUN.",
    icon: Compass,
    tint: "bg-[#FFF3C9]",
  },
];

const dummyFeaturedEvents: Listing[] = [
  {
    id: "dummy-featured-olympiad",
    title: "National Science Olympiad Prep Sprint",
    org: "Kytalist Picks",
    location: "Online",
    region: "Nationwide",
    description:
      "A focused preparation track for students building confidence before major science olympiad rounds.",
    image: "/images/placeholder.svg",
    eventUrl: "https://example.com/science-olympiad",
    category: "academic",
    badge: "Olympiad",
    footer: "Grades 9-12",
    deadline: "Applications due soon",
    type: "Olympiad",
    cost: "Free",
    grades: [9, 10, 11, 12],
    tags: ["STEM", "Olympiad", "Online"],
    featured: true,
  },
  {
    id: "dummy-featured-tech-contest",
    title: "Code Challenge Weekend",
    org: "Kytalist Picks",
    location: "Online",
    region: "Nationwide",
    description:
      "A beginner-friendly programming contest with timed problems, team practice, and post-round editorials.",
    image: "/images/codeforces.svg",
    eventUrl: "https://example.com/code-challenge",
    category: "competition",
    badge: "Tech contest",
    footer: "Online contest",
    deadline: "Registration open",
    type: "TechContest",
    cost: "Free",
    grades: [9, 10, 11, 12],
    tags: ["Programming", "Contest", "STEM"],
    featured: true,
  },
  {
    id: "dummy-featured-conference",
    title: "Global Student Leadership Forum",
    org: "Kytalist Picks",
    location: "Hybrid",
    region: "International",
    description:
      "A student conference for leadership, public speaking, and cross-cultural collaboration.",
    image: "/images/Kytalist_profile_light.png",
    eventUrl: "https://example.com/student-leadership-forum",
    category: "opportunity",
    badge: "Conference",
    footer: "Scholarships available",
    deadline: "Priority deadline next month",
    type: "Conference",
    cost: "Paid",
    grades: [10, 11, 12],
    tags: ["Leadership", "Conference", "Global"],
    featured: true,
  },
];

export default async function Home() {
  const [featuredResult, trendingResult] = await Promise.all([
    safeFetch(() => getFeatured(), "featured"),
    safeFetch(() => getTrending(), "trending"),
  ]);

  const apiFeatured = featuredResult.ok ? featuredResult.data : [];
  const featured = apiFeatured.length > 0 ? apiFeatured : dummyFeaturedEvents;
  const trending = trendingResult.ok ? trendingResult.data : [];

  return (
    <div className="relative min-h-screen bg-[#F9F8F6]">
      <MeshBackground />

      <main className="relative z-10">
        <section className="mx-auto max-w-360 px-4 pb-14 pt-24 sm:px-6 sm:pt-28 lg:pb-20 lg:pt-30">
          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(420px,0.98fr)] lg:items-center xl:gap-14">
            <div className="pointer-events-none absolute -left-20 top-6 h-56 w-56 rounded-full bg-[#A3E4D7]/30 blur-3xl" />
            <div className="pointer-events-none absolute right-0 top-24 h-64 w-64 rounded-full bg-[#F28F6B]/14 blur-3xl lg:right-[32%]" />

            <div className="relative max-w-3xl">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#0B4650] px-4 py-2 text-xs font-bold text-white shadow-sm">
                  <Sparkles
                    className="h-3.5 w-3.5 text-[#FFD3B6]"
                    aria-hidden
                  />
                  Curated for students
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#0B4650]/10 bg-white/65 px-4 py-2 text-xs font-bold text-[#0B4650]/75 backdrop-blur-md">
                  <CalendarClock
                    className="h-3.5 w-3.5 text-[#F28F6B]"
                    aria-hidden
                  />
                  Deadline-aware catalog
                </span>
              </div>

              <h1 className="font-display text-[clamp(2.75rem,7vw,5.7rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-[#0B4650] text-balance">
                Every student opportunity, sorted before the deadline.
              </h1>

              <p className="mt-6 max-w-2xl text-base font-semibold leading-relaxed text-[#0B4650]/72 text-pretty sm:text-lg lg:text-xl">
                Kytalist gathers programs, competitions, internships, research
                calls, and global opportunities into one calm place to browse by
                fit, cost, grade, region, and urgency.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <Link
                  href="/activities"
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0B4650] px-7 py-3.5 text-base font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#062E35] active:scale-[0.99] sm:min-h-0 sm:py-4"
                >
                  Explore all events
                  <Compass
                    className="h-5 w-5 shrink-0 transition-transform group-hover:rotate-12"
                    aria-hidden
                  />
                </Link>
                <Link
                  href="/activities?sort=deadline"
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#0B4650]/15 bg-white/70 px-7 py-3.5 text-base font-bold text-[#0B4650] backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-[#0B4650]/25 hover:bg-white active:scale-[0.99] sm:min-h-0 sm:py-4"
                >
                  See deadlines soon
                  <ArrowRight
                    className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </div>

              <div className="mt-8 grid max-w-2xl gap-2 sm:grid-cols-3">
                {[
                  {
                    label: "Scan",
                    detail: "all live listings",
                    icon: Search,
                    tint: "bg-[#D6ECFB]",
                  },
                  {
                    label: "Compare",
                    detail: "cost, grade, region",
                    icon: BookOpen,
                    tint: "bg-[#FFE4C4]/80",
                  },
                  {
                    label: "Act",
                    detail: "before deadlines",
                    icon: Trophy,
                    tint: "bg-[#A3E4D7]/45",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-2xl border border-[#0B4650]/10 bg-white/55 p-3 backdrop-blur-md"
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.tint} text-[#0B4650]`}
                    >
                      <item.icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-sm font-extrabold text-[#0B4650]">
                        {item.label}
                      </span>
                      <span className="block truncate text-xs font-bold text-[#0B4650]/55">
                        {item.detail}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative w-full shrink-0 lg:min-w-0">
              <div
                className="relative mx-auto aspect-5/6 w-full max-w-90 md:max-w-100 lg:hidden"
                aria-hidden
              >
                <HeroCardStack size="sm" />
              </div>
              <div
                className="relative mx-auto hidden min-h-120 w-full max-w-2xl lg:block xl:min-h-132"
                aria-hidden
              >
                <HeroCardStack size="lg" />
              </div>
            </div>
          </div>
        </section>

        <FeaturedEventsCarousel items={featured} />

        <CategoryGrid />

        <TrendingPrograms items={trending} />

        <section className="mx-auto max-w-360 px-4 pb-16 pt-2 sm:px-6">
          <h2 className="font-display mb-8 text-2xl font-bold text-[#0B4650]">
            Explore by path
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="card-surface squircle group flex flex-col p-8"
              >
                <div
                  className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${p.tint} text-[#0B4650]`}
                >
                  <p.icon className="h-7 w-7" aria-hidden />
                </div>
                <h3 className="font-display mb-2 text-xl font-bold text-[#0B4650] group-hover:text-[#F28F6B]">
                  {p.title}
                </h3>
                <p className="text-sm font-medium leading-relaxed text-[#0B4650]/70">
                  {p.blurb}
                </p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#0B4650]">
                  Open list
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <Testimonials />

        <FinalCta />

        <NewsletterBanner />
      </main>
    </div>
  );
}
