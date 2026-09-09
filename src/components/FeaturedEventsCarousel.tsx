"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Compass, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { OpportunityCard } from "@/components/OpportunityCard";
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
  const railRef = useRef<HTMLDivElement | null>(null);
  const hasMultiple = items.length > 1;

  useEffect(() => {
    if (!hasMultiple || paused) return;

    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % items.length);
    }, 4200);

    return () => window.clearInterval(interval);
  }, [hasMultiple, items.length, paused]);

  useEffect(() => {
    const rail = railRef.current;
    const activeCard = rail?.querySelector<HTMLElement>(
      `[data-featured-index="${active}"]`,
    );
    if (!rail || !activeCard) return;

    rail.scrollTo({
      left: activeCard.offsetLeft,
      behavior: "smooth",
    });
  }, [active]);

  if (items.length === 0) return null;

  const goPrevious = () => {
    setActive((current) => (current === 0 ? items.length - 1 : current - 1));
  };

  const goNext = () => {
    setActive((current) => (current + 1) % items.length);
  };

  return (
    <section
      className="relative overflow-hidden pb-14 pt-0 sm:pb-16"
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
              A rotating set of highlighted programs from the admin-curated
              catalog.
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
          ref={railRef}
          className="hide-scroll overflow-x-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="flex gap-4 pb-1" aria-live="polite">
            {items.map((item, index) => (
              <div
                key={item.id}
                data-featured-index={index}
                className="w-[min(78vw,18rem)] shrink-0 sm:w-72 lg:w-76"
              >
                <OpportunityCard
                  item={item}
                  hrefBase={hrefForCategory(item.category)}
                />
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

      <div className="pointer-events-none absolute inset-y-0 right-0 z-5 w-8 bg-linear-to-l from-[#F9F8F6] to-transparent md:w-16" />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-5 w-6 bg-linear-to-r from-[#F9F8F6] to-transparent md:w-10" />
    </section>
  );
}
