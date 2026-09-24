"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Compass,
  MapPin,
  Pause,
  Play,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Listing } from "@/lib/api/types";

type Props = {
  items: Listing[];
};

function hrefForCategory(category: string): string {
  if (category === "academic") return "/academic";
  if (category === "professional") return "/professional";
  if (category === "competition") return "/competition";
  if (category === "opportunity") return "/opportunities";
  return "/activities";
}

export function FeaturedEventsCarousel({ items }: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const hasMultiple = items.length > 1;

  useEffect(() => {
    if (!hasMultiple || paused) return;

    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % items.length);
    }, 5200);

    return () => window.clearInterval(interval);
  }, [hasMultiple, items.length, paused]);

  if (items.length === 0) return null;

  const goPrevious = () => {
    setActive((current) => (current === 0 ? items.length - 1 : current - 1));
  };

  const goNext = () => {
    setActive((current) => (current + 1) % items.length);
  };

  return (
    <section
      className="relative pb-14 pt-0 sm:pb-16"
      aria-labelledby="featured-events-title"
    >
      <div className="mx-auto max-w-360 px-4 sm:px-6">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 inline-flex rounded-full bg-[#F28F6B]/16 px-3 py-1 text-xs font-black uppercase tracking-wide text-[#B4532A]">
              Featured event
            </p>
            <h2
              id="featured-events-title"
              className="font-display text-xl font-bold text-[#0B4650] sm:text-2xl"
            >
              Handpicked opportunities worth a closer look.
            </h2>
            <p className="mt-1.5 max-w-lg text-sm font-semibold leading-relaxed text-[#0B4650]/65">
              A rotating spotlight from the admin-curated catalog.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {hasMultiple ? (
              <>
                <button
                  type="button"
                  onClick={goPrevious}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0B4650]/12 bg-white/72 text-[#0B4650] transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B4650]/20"
                  aria-label="Previous featured event"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => setPaused((value) => !value)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0B4650]/12 bg-white/72 text-[#0B4650] transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B4650]/20"
                  aria-label={
                    paused
                      ? "Play featured event slideshow"
                      : "Pause featured event slideshow"
                  }
                >
                  {paused ? (
                    <Play className="h-4 w-4" aria-hidden />
                  ) : (
                    <Pause className="h-4 w-4" aria-hidden />
                  )}
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0B4650]/12 bg-white/72 text-[#0B4650] transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B4650]/20"
                  aria-label="Next featured event"
                >
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
              </>
            ) : null}
            <Link
              href="/activities"
              className="inline-flex h-9 items-center gap-2 rounded-full bg-[#0B4650] px-4 text-sm font-bold text-white transition-colors hover:bg-[#062E35] focus:outline-none focus:ring-2 focus:ring-[#0B4650]/25"
            >
              See all
              <Compass className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-[2rem]"
          role="group"
          aria-roledescription="carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${active * 100}%)` }}
            aria-live="polite"
          >
            {items.map((item, index) => (
              <div
                key={item.id}
                className="w-full shrink-0"
                aria-hidden={index !== active}
              >
                <FeaturedEventCard item={item} />
              </div>
            ))}
          </div>
        </div>

        {hasMultiple ? (
          <div className="mt-6 flex justify-center gap-2">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(index)}
                className={`h-2.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[#0B4650]/25 ${
                  index === active
                    ? "w-8 bg-[#0B4650]"
                    : "w-2.5 bg-[#0B4650]/18 hover:bg-[#0B4650]/35"
                }`}
                aria-label={`Show featured event ${index + 1}`}
                aria-current={index === active}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function FeaturedEventCard({ item }: { item: Listing }) {
  const eventHref = item.eventUrl?.trim();
  const detailHref = `${hrefForCategory(item.category)}#${item.id}`;

  return (
    <article className="card-surface squircle group relative grid w-full grid-cols-1 overflow-hidden md:aspect-[16/4] md:min-h-[340px] md:grid-cols-[1.05fr_0.95fr]">
      <div className="relative z-10 order-2 flex flex-col justify-center gap-3.5 p-6 sm:p-7 md:order-1 md:py-8 md:pl-9 md:pr-7 lg:pl-12">
        <div className="flex flex-wrap items-center gap-2">
          {item.types?.map((t) => (
            <span
              key={t}
              className="rounded-full bg-[#0B4650]/6 px-3 py-1 text-[11px] font-bold text-[#0B4650]/70"
            >
              {t}
            </span>
          ))}
          {item.cost ? (
            <span className="rounded-full bg-[#A3E4D7]/45 px-3 py-1 text-[11px] font-bold text-[#0B4650]">
              {item.cost}
            </span>
          ) : null}
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#0B4650]/50">
            {item.org}
          </p>
          <h3 className="font-display mt-1 line-clamp-2 text-2xl font-extrabold leading-[1.08] tracking-[-0.02em] text-[#0B4650] sm:text-3xl lg:text-4xl">
            <Link
              href={detailHref}
              className="transition-colors hover:text-[#F28F6B]"
            >
              {item.title}
            </Link>
          </h3>
        </div>

        <p className="line-clamp-2 max-w-xl text-sm font-semibold leading-relaxed text-[#0B4650]/65 sm:text-base">
          {item.description}
        </p>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm font-semibold text-[#0B4650]/70">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0 text-[#F28F6B]" aria-hidden />
            {item.location}
          </span>
          {item.deadline ? (
            <span className="inline-flex items-center gap-1.5 text-[#B4532A]">
              <CalendarClock className="h-4 w-4 shrink-0" aria-hidden />
              {item.deadline}
            </span>
          ) : null}
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-3">
          <Link
            href={detailHref}
            className="inline-flex items-center gap-2 rounded-full bg-[#0B4650] px-5 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#062E35] active:scale-[0.99]"
          >
            View details
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          {eventHref ? (
            <a
              href={eventHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#0B4650]/15 bg-white/70 px-5 py-2.5 text-sm font-bold text-[#0B4650] transition-colors hover:border-[#0B4650]/30 hover:bg-white"
            >
              Visit site
            </a>
          ) : null}
        </div>
      </div>

      <div className="relative order-1 min-h-[210px] overflow-hidden bg-[#F1F3F2] md:order-2 md:min-h-0">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-contain p-8 sm:p-10"
          sizes="(max-width: 768px) 100vw, 45vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#0B4650]/35 via-transparent to-transparent md:bg-linear-to-r md:from-[#F9F8F6]/85 md:via-transparent md:to-transparent" />
      </div>
    </article>
  );
}
