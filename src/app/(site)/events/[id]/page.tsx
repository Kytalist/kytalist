import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarClock,
  GraduationCap,
  MapPin,
} from "lucide-react";
import { Markdown } from "@/components/Markdown";
import { MeshBackground } from "@/components/MeshBackground";
import { getListing } from "@/lib/api/listings";
import { safeFetch } from "@/lib/api/safeFetch";
import { formatGrades } from "@/lib/format";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

const categoryLabel: Record<string, string> = {
  academic: "Academic",
  professional: "Professional",
  competition: "Competition",
  opportunity: "Opportunity",
};

const costTint: Record<string, string> = {
  Free: "bg-[#A3E4D7] text-[#0B4650]",
  Paid: "bg-[#FFE4C4] text-[#8C3F24]",
  Stipend: "bg-[#E0F2F1] text-[#0B4650]",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const result = await safeFetch(() => getListing(id), "event");
  if (!result.ok) return { title: "Event — Kytalist" };
  return {
    title: `${result.data.title} — Kytalist`,
    description: result.data.description.replace(/[#*_>`]/g, "").slice(0, 160),
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const result = await safeFetch(() => getListing(id), "event");

  if (!result.ok) {
    if (result.error.status === 404) notFound();
    return (
      <div className="relative min-h-screen bg-[#F9F8F6]">
        <MeshBackground />
        <main className="relative z-10 mx-auto max-w-3xl px-4 pb-24 pt-36 text-center sm:px-6">
          <h1 className="font-display text-2xl font-bold text-[#0B4650]">
            Couldn&rsquo;t load this event
          </h1>
          <p className="mt-2 text-sm font-semibold text-[#0B4650]/65">
            The catalog service is temporarily unavailable. Please try again in
            a moment.
          </p>
          <Link
            href="/activities"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0B4650] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#062E35]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to activities
          </Link>
        </main>
      </div>
    );
  }

  const item = result.data;
  const eventHref = item.eventUrl?.trim();
  const gradesLabel = formatGrades(item.grades);
  const typeLabels = item.types?.length
    ? item.types
    : [categoryLabel[item.category] ?? item.category];
  const showDescription = Boolean(item.descriptionEnabled);
  const bannerImage = item.bannerImage?.trim();
  const showBanner = Boolean(item.bannerEnabled) && Boolean(bannerImage);

  return (
    <div className="relative min-h-screen bg-[#F9F8F6]">
      <MeshBackground />
      <main className="relative z-10 mx-auto max-w-4xl px-4 pb-24 pt-32 sm:px-6 lg:pt-40">
        <Link
          href="/activities"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#0B4650]/70 transition-colors hover:text-[#0B4650]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to activities
        </Link>

        <article className="card-surface squircle mt-6 overflow-hidden">
          <div className="relative aspect-16/8 w-full overflow-hidden bg-[#F1F3F2]">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
            />
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-2">
              {typeLabels.map((label) => (
                <span
                  key={label}
                  className="rounded-full bg-[#0B4650] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
                >
                  {label}
                </span>
              ))}
              <span className="rounded-full bg-[#0B4650]/6 px-3 py-1 text-[11px] font-bold text-[#0B4650]/70">
                {item.region}
              </span>
              {item.cost ? (
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${costTint[item.cost] ?? "bg-[#0B4650]/6 text-[#0B4650]"}`}
                >
                  {item.cost}
                </span>
              ) : null}
            </div>

            <h1 className="font-display mt-4 text-3xl font-extrabold leading-[1.1] tracking-[-0.02em] text-[#0B4650] text-balance sm:text-4xl">
              {item.title}
            </h1>
            <p className="mt-2 text-sm font-bold uppercase tracking-wide text-[#0B4650]/55">
              {item.org}
            </p>

            <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-[#0B4650]/75">
              {item.deadline ? (
                <div className="flex items-center gap-2">
                  <CalendarClock
                    className="h-4 w-4 shrink-0 text-[#F28F6B]"
                    aria-hidden
                  />
                  <dd>{item.deadline}</dd>
                </div>
              ) : null}
              <div className="flex items-center gap-2">
                <MapPin
                  className="h-4 w-4 shrink-0 text-[#F28F6B]"
                  aria-hidden
                />
                <dd>{item.location}</dd>
              </div>
              {gradesLabel ? (
                <div className="flex items-center gap-2">
                  <GraduationCap
                    className="h-4 w-4 shrink-0 text-[#F28F6B]"
                    aria-hidden
                  />
                  <dd>{gradesLabel}</dd>
                </div>
              ) : null}
            </dl>

            {eventHref ? (
              <a
                href={eventHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0B4650] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#062E35] focus:outline-none focus:ring-2 focus:ring-[#0B4650]/30"
              >
                Visit event site
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            ) : null}
          </div>
        </article>

        {showDescription || showBanner ? (
          <section className="mt-8 space-y-6 rounded-3xl border border-[#0B4650]/10 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
            {showBanner && bannerImage ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[#F1F3F2]">
                <Image
                  src={bannerImage}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 896px"
                />
              </div>
            ) : null}
            {showDescription ? <Markdown content={item.description} /> : null}
          </section>
        ) : null}
      </main>
    </div>
  );
}
