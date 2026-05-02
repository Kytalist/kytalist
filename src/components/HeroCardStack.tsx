import Image from "next/image";
import { Briefcase } from "lucide-react";

const HERO_PREVIEW_IMAGE =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80";

type HeroCardStackProps = {
  size: "sm" | "lg";
};

export function HeroCardStack({ size }: HeroCardStackProps) {
  const isLg = size === "lg";

  return (
    <div className="relative h-full w-full">
      {/* Back panel */}
      <div
        className={
          isLg
            ? "absolute left-0 top-[6%] h-[88%] w-[56%] rotate-[8deg] overflow-hidden squircle border border-white/80 shadow-2xl xl:top-[4%] xl:h-[90%] xl:w-[52%]"
            : "absolute left-[2%] top-[6%] h-[88%] w-[76%] rotate-6 overflow-hidden squircle border border-white/80 shadow-lg"
        }
      >
        <Image
          src={HERO_PREVIEW_IMAGE}
          alt=""
          width={900}
          height={1100}
          className="h-full w-full object-cover opacity-45"
          sizes={isLg ? "(min-width: 1280px) 520px, 420px" : "280px"}
        />
        <div className="absolute inset-0 bg-white/45 backdrop-blur-2xl" />
      </div>

      {/* Front card */}
      <div
        className={
          isLg
            ? "absolute bottom-[4%] right-0 flex w-[64%] -rotate-[2deg] flex-col overflow-hidden squircle border border-white/80 bg-white/95 shadow-[0_32px_64px_-16px_rgba(11,70,80,0.18)] backdrop-blur-xl xl:bottom-[5%] xl:w-[60%]"
            : "absolute bottom-[4%] right-[2%] flex w-[88%] -rotate-2 flex-col overflow-hidden squircle border border-white/70 bg-white/90 shadow-xl backdrop-blur-2xl"
        }
      >
        <div
          className={
            isLg
              ? "flex shrink-0 items-start justify-between gap-3 p-7 pb-0 xl:p-8 xl:pb-0"
              : "flex shrink-0 items-start justify-between gap-2 p-5 pb-0 sm:p-6 sm:pb-0"
          }
        >
          <div
            className={
              isLg
                ? "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#0B4650]/5 text-[#0B4650] xl:h-16 xl:w-16"
                : "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0B4650]/5 text-[#0B4650] sm:h-12 sm:w-12"
            }
          >
            <Briefcase
              className={isLg ? "h-7 w-7 xl:h-8 xl:w-8" : "h-5 w-5 sm:h-6 sm:w-6"}
              aria-hidden
            />
          </div>
          <span
            className={
              isLg
                ? "shrink-0 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#0B4650] ring-1 ring-[#0B4650]/8"
                : "shrink-0 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#0B4650] ring-1 ring-[#0B4650]/5"
            }
          >
            Live board
          </span>
        </div>

        <div
          className={
            isLg
              ? "relative mt-4 w-full shrink-0 px-7 xl:mt-5 xl:px-8"
              : "relative mt-3 w-full shrink-0 px-5 sm:px-6"
          }
        >
          <div
            className={
              isLg
                ? "relative aspect-[5/3] w-full overflow-hidden squircle bg-[#0B4650]/5 xl:aspect-[16/9]"
                : "relative aspect-[16/10] w-full overflow-hidden squircle bg-[#0B4650]/5"
            }
          >
            <Image
              src={HERO_PREVIEW_IMAGE}
              alt="Students collaborating on campus"
              width={960}
              height={576}
              className="h-full w-full object-cover"
              sizes={
                isLg
                  ? "(min-width: 1280px) 560px, (min-width: 1024px) 480px, 320px"
                  : "(max-width: 400px) 85vw, 320px"
              }
              priority={isLg}
            />
          </div>
        </div>

        <div
          className={
            isLg
              ? "flex flex-col p-7 pt-5 xl:p-8 xl:pt-6"
              : "flex flex-col p-5 pt-4 sm:p-6 sm:pt-4"
          }
        >
          <p
            className={
              isLg
                ? "font-display text-2xl font-bold leading-snug text-[#0B4650] xl:text-[1.65rem]"
                : "font-display text-lg font-bold leading-snug text-[#0B4650] sm:text-xl"
            }
          >
            Opportunities in every region
          </p>
          <p
            className={
              isLg
                ? "mt-3 max-w-md text-sm font-medium leading-relaxed text-[#0B4650]/65 xl:text-base"
                : "mt-2 text-xs font-medium leading-relaxed text-[#0B4650]/60 sm:text-sm"
            }
          >
            Camps, clubs, and internships—organized so you scan faster and decide
            with confidence.
          </p>
          <div
            className={
              isLg
                ? "mt-6 h-2 overflow-hidden rounded-full bg-[#0B4650]/10"
                : "mt-4 h-1.5 overflow-hidden rounded-full bg-[#0B4650]/10"
            }
          >
            <div className="h-full w-3/4 rounded-full bg-[#0B4650]" />
          </div>
        </div>
      </div>
    </div>
  );
}
