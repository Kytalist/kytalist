"use client";

import { useEffect, useRef, useState } from "react";
import type { Listing } from "@/lib/api/types";
import { ExtracurricularCard } from "@/components/ExtracurricularCard";

function isClosingSoon(item: Listing, now: number): boolean {
  if (!item.deadline) return false;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(item.deadline.trim());
  if (!m) return false;
  const d = new Date(item.deadline);
  const diff = (d.getTime() - now) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= 7;
}

/** Deterministic shuffle so server and client render the same order. */
function seededShuffle<T>(list: T[], seed: number): T[] {
  let state = seed >>> 0;
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function UpcomingDeadlinesRail({
  items,
  now,
}: {
  items: Listing[];
  /** Request timestamp from the server, so SSR and hydration agree. */
  now: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const [shuffled] = useState(() => seededShuffle(items, now));

  const loopItems = [...shuffled, ...shuffled];

  // Auto-scroll infinitely; pauses on hover/drag.
  useEffect(() => {
    const el = trackRef.current;
    if (!el || shuffled.length === 0) return;

    let raf = 0;
    const step = () => {
      if (!pausedRef.current) {
        el.scrollLeft += 0.6;
        const half = el.scrollWidth / 2;
        if (el.scrollLeft >= half) {
          el.scrollLeft -= half;
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    const pause = () => {
      pausedRef.current = true;
    };
    const resume = () => {
      pausedRef.current = false;
    };

    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
    };
  }, [shuffled.length]);

  // Drag / swipe support without locking clicks.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let isDown = false;
    let isDragging = false;
    let startX = 0;
    let scrollStart = 0;

    const onDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      isDown = true;
      isDragging = false;
      startX = e.pageX;
      scrollStart = el.scrollLeft;
    };

    const onMove = (e: MouseEvent) => {
      if (!isDown) return;
      const dx = e.pageX - startX;
      if (!isDragging && Math.abs(dx) > 6) {
        isDragging = true;
        el.style.cursor = "grabbing";
        pausedRef.current = true;
      }
      if (isDragging) {
        e.preventDefault();
        el.scrollLeft = scrollStart - dx;
      }
    };

    const onUp = () => {
      if (!isDown) return;
      isDown = false;
      if (isDragging) {
        // Suppress the click that follows a drag.
        const suppress = (ev: MouseEvent) => {
          ev.stopPropagation();
          ev.preventDefault();
        };
        el.addEventListener("click", suppress, { capture: true, once: true });
        window.setTimeout(() => {
          pausedRef.current = false;
          el.style.cursor = "grab";
        }, 250);
      } else {
        el.style.cursor = "grab";
      }
      isDragging = false;
    };

    const onMouseLeave = () => {
      if (isDown) onUp();
    };

    el.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  if (shuffled.length === 0) return null;

  return (
    <div
      ref={trackRef}
      className="flex cursor-grab gap-4 overflow-x-auto pb-2 hide-scroll"
      style={{ scrollBehavior: "auto", userSelect: "none" }}
      onDragStart={(e) => e.preventDefault()}
    >
      {loopItems.map((item, idx) => (
        <div
          key={`${item.id}-${idx}`}
          className="flex w-full shrink-0 flex-col sm:w-1/2 lg:w-1/4"
        >
          {isClosingSoon(item, now) ? (
            <span className="mb-2 inline-flex w-fit rounded-full bg-red-600 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white">
              Closing soon
            </span>
          ) : null}
          <ExtracurricularCard item={item} />
        </div>
      ))}
    </div>
  );
}