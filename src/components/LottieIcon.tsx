"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { AnimationItem } from "lottie-web";

type LottieIconProps = {
  /** Path to a Lottie JSON file in `public/`. */
  src: string;
  /** Accessible description for the animation. */
  label: string;
  className?: string;
  /** Shown until the animation has rendered (e.g. before hydration). */
  fallback?: ReactNode;
  /** Loop the animation while it is on screen. Defaults to true. */
  loop?: boolean;
};

/**
 * Plays a locally bundled Lottie animation with the light build of lottie-web.
 *
 * The animation is loaded on the client only and only runs while it is in the
 * viewport. Visitors who prefer reduced motion get a still frame instead.
 * Keeping the files local avoids a third-party request on page load.
 */
export function LottieIcon({
  src,
  label,
  className = "",
  fallback,
  loop = true,
}: LottieIconProps) {
  const hostRef = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let animation: AnimationItem | undefined;
    let observer: IntersectionObserver | undefined;
    let cancelled = false;

    void (async () => {
      const lottie = (await import("lottie-web/build/player/lottie_light"))
        .default;
      if (cancelled) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const instance = lottie.loadAnimation({
        container: host,
        renderer: "svg",
        loop: loop && !reduceMotion,
        autoplay: false,
        path: src,
        rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
      });
      animation = instance;

      instance.addEventListener("DOMLoaded", () => {
        if (cancelled) return;
        setReady(true);

        if (reduceMotion) {
          instance.goToAndStop(instance.totalFrames * 0.8, true);
          return;
        }

        observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) instance.play();
              else instance.pause();
            }
          },
          { threshold: 0.25 },
        );
        observer.observe(host);
      });
    })();

    return () => {
      cancelled = true;
      observer?.disconnect();
      animation?.destroy();
    };
  }, [src, loop]);

  return (
    <span className={`relative block ${className}`}>
      {fallback && !ready ? (
        <span
          aria-hidden
          className="absolute inset-0 grid place-items-center text-[#0B4650]/25"
        >
          {fallback}
        </span>
      ) : null}
      <span
        ref={hostRef}
        role="img"
        aria-label={label}
        className="absolute inset-0"
      />
    </span>
  );
}
