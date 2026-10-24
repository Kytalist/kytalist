"use client";

import {
  BadgeCheck,
  ShieldCheck,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { LottieIcon } from "@/components/LottieIcon";

type TrustPoint = {
  title: string;
  desc: string;
  animation: string;
  label: string;
  icon: LucideIcon;
  panel: string;
  /** The illustrations have different amounts of built-in padding. */
  scale: string;
};

const points: TrustPoint[] = [
  {
    title: "Free forever",
    desc: "No paywalls. Browse and save every opportunity at no cost.",
    animation: "/lottie/trust-free.json",
    label: "Two students studying together",
    icon: Tag,
    panel: "bg-linear-to-br from-[#E0F2F1] via-[#F7FBFA] to-white",
    scale: "scale-125",
  },
  {
    title: "Pre-vetted listings",
    desc: "We double-check each opportunity actually accepts students.",
    animation: "/lottie/trust-vetted.json",
    label: "A person checking items off a list",
    icon: BadgeCheck,
    panel: "bg-linear-to-br from-[#D6ECFB] via-[#F4FAFE] to-white",
    scale: "scale-110",
  },
  {
    title: "Data privacy",
    desc: "Your information stays yours. We never sell your data.",
    animation: "/lottie/trust-privacy.json",
    label: "A person working securely with private documents",
    icon: ShieldCheck,
    panel: "bg-linear-to-br from-[#FADCD0] via-[#FDF3EE] to-white",
    scale: "",
  },
];

export function TrustCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {points.map((point, index) => {
        const Fallback = point.icon;

        return (
          <article
            key={point.title}
            className="card-surface squircle group overflow-hidden"
          >
            <div
              className={`relative flex h-52 items-center justify-center overflow-hidden ${point.panel}`}
            >
              <span
                aria-hidden
                className="font-display pointer-events-none absolute right-4 top-1 text-6xl font-black leading-none text-[#0B4650]/5"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <LottieIcon
                src={point.animation}
                label={point.label}
                className={`h-52 w-52 ${point.scale}`}
                fallback={<Fallback className="h-8 w-8" aria-hidden />}
              />
            </div>

            <div className="p-5 sm:p-6">
              <h3 className="font-display text-lg font-bold text-[#0B4650]">
                {point.title}
              </h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-[#0B4650]/70">
                {point.desc}
              </p>
              <span
                aria-hidden
                className="mt-4 block h-1 w-8 rounded-full bg-[#F28F6B]/80 transition-all duration-500 ease-out group-hover:w-14"
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}
