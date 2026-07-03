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
import { FinalCta } from "@/components/FinalCta";
import { HeroCardStack } from "@/components/HeroCardStack";
import { MeshBackground } from "@/components/MeshBackground";
import { NewsletterBanner } from "@/components/NewsletterBanner";
import { OpportunityCard } from "@/components/OpportunityCard";
import { Testimonials } from "@/components/Testimonials";
import { TrendingPrograms } from "@/components/TrendingPrograms";
import { getFeatured, getTrending } from "@/lib/api/listings";
import { safeFetch } from "@/lib/api/safeFetch";

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

function hrefForCategory(category: string): string {
  if (category === "academic") return "/academic";
  if (category === "professional") return "/professional";
  if (category === "competition") return "/competition";
  if (category === "opportunity") return "/opportunities";
  return "/academic";
}

export default async function Home() {
  const [featuredResult, trendingResult] = await Promise.all([
    safeFetch(() => getFeatured(), "featured"),
    safeFetch(() => getTrending(), "trending"),
  ]);

  const featured = featuredResult.ok ? featuredResult.data : [];
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

        {featured.length > 0 ? (
          <section className="relative pb-24">
            <div className="mx-auto mb-8 max-w-360 px-4 sm:px-6">
              <h2 className="font-display text-2xl font-bold text-[#0B4650]">
                Featured picks
              </h2>
              <p className="mt-2 max-w-lg text-[#0B4650]/65">
                A rotating mix of camps, clubs, and roles across the country.
              </p>
            </div>
            <div className="overflow-x-auto hide-scroll snap-x snap-mandatory px-4 pb-4 sm:px-6 md:px-12">
              <div className="mx-auto flex w-max gap-6 md:mx-0">
                {featured.map((item) => (
                  <div
                    key={item.id}
                    className="w-[min(100vw-2rem,400px)] shrink-0 snap-start sm:w-100"
                  >
                    <OpportunityCard
                      item={item}
                      hrefBase={hrefForCategory(item.category)}
                    />
                  </div>
                ))}
                <Link
                  href="/activities"
                  className="card-surface squircle flex w-50 shrink-0 snap-start flex-col items-center justify-center p-6 text-center"
                >
                  <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#0B4650]/5 text-[#0B4650]">
                    <Compass className="h-8 w-8" />
                  </span>
                  <span className="font-display text-lg font-bold text-[#0B4650]">
                    See everything
                  </span>
                </Link>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 z-5 w-12 bg-linear-to-l from-[#F9F8F6] to-transparent md:w-24" />
            <div className="pointer-events-none absolute inset-y-0 left-0 z-5 w-8 bg-linear-to-r from-[#F9F8F6] to-transparent md:w-12" />
          </section>
        ) : null}

        <Testimonials />

        <FinalCta />

        <NewsletterBanner />
      </main>
    </div>
  );
}
