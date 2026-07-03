import Link from "next/link";
import { ArrowRight, BookOpen, Compass, Briefcase, Trophy } from "lucide-react";
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
        <section className="mx-auto max-w-[1440px] px-4 pb-16 pt-44 sm:px-6 md:pt-40 lg:pb-20 lg:pt-48">
          <div className="flex flex-col gap-14 lg:flex-row lg:items-start lg:gap-16">
            <div className="flex w-full flex-col lg:max-w-xl lg:flex-1 xl:max-w-2xl">
              <p className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-[#0B4650]/10 bg-white/50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0B4650] shadow-sm backdrop-blur-md">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F28F6B] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F28F6B]" />
                </span>
                Curated for students
              </p>
              <h1 className="font-display mb-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0B4650] text-balance sm:text-5xl lg:text-[3.25rem] lg:leading-[1.06] xl:text-6xl xl:leading-[1.05]">
                The best extracurriculars,{" "}
                <span className="text-gradient">all in one place.</span>
              </h1>
              <p className="mb-10 max-w-xl text-base font-medium leading-relaxed text-[#0B4650]/70 text-pretty sm:text-lg">
                Summer programs, research, competitions &amp; internships —
                vetted and organized so you don&rsquo;t have to Google for
                hours.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <Link
                  href="/activities"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0B4650] px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-[#062E35] hover:shadow-lg active:scale-[0.99] sm:min-h-0 sm:py-4"
                >
                  Start exploring
                  <Compass className="h-5 w-5 shrink-0" aria-hidden />
                </Link>
                <Link
                  href="/activities"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#0B4650]/15 bg-white/70 px-8 py-3.5 text-base font-semibold text-[#0B4650] shadow-sm backdrop-blur-xl transition-colors hover:border-[#0B4650]/25 hover:bg-white sm:min-h-0 sm:py-4"
                >
                  Browse activities
                  <ArrowRight className="h-5 w-5 shrink-0" aria-hidden />
                </Link>
              </div>
            </div>

            <div className="relative w-full shrink-0 lg:mt-2 lg:min-w-0 lg:flex-1 lg:pl-6 xl:pl-10">
              <div
                className="relative mx-auto aspect-[5/6] w-full max-w-[320px] md:max-w-[360px] lg:hidden"
                aria-hidden
              >
                <div className="absolute inset-[3%]">
                  <HeroCardStack size="sm" />
                </div>
              </div>
              <div
                className="relative mx-auto hidden min-h-[28rem] w-full max-w-xl lg:mx-0 lg:ml-auto lg:block xl:max-w-2xl xl:min-h-[32rem]"
                aria-hidden
              >
                <div className="absolute inset-0 translate-x-2 xl:translate-x-4">
                  <HeroCardStack size="lg" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <CategoryGrid />

        <TrendingPrograms items={trending} />

        <section className="mx-auto max-w-[1440px] px-4 pb-16 pt-2 sm:px-6">
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
            <div className="mx-auto mb-8 max-w-[1440px] px-4 sm:px-6">
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
                    className="w-[min(100vw-2rem,400px)] shrink-0 snap-start sm:w-[400px]"
                  >
                    <OpportunityCard
                      item={item}
                      hrefBase={hrefForCategory(item.category)}
                    />
                  </div>
                ))}
                <Link
                  href="/activities"
                  className="card-surface squircle flex w-[200px] shrink-0 snap-start flex-col items-center justify-center p-6 text-center"
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
            <div className="pointer-events-none absolute inset-y-0 right-0 z-[5] w-12 bg-linear-to-l from-[#F9F8F6] to-transparent md:w-24" />
            <div className="pointer-events-none absolute inset-y-0 left-0 z-[5] w-8 bg-linear-to-r from-[#F9F8F6] to-transparent md:w-12" />
          </section>
        ) : null}

        <Testimonials />

        <FinalCta />

        <NewsletterBanner />
      </main>
    </div>
  );
}
