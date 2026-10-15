import { CheckCircle2, SlidersHorizontal } from "lucide-react";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <header className="relative mb-8 overflow-hidden rounded-3xl bg-white p-5 shadow-sm sm:p-7 md:mb-10">
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-[#0B4650] px-3.5 py-1.5 text-xs font-bold text-white">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#FFD3B6]" aria-hidden />
            {eyebrow}
          </p>
          <h1 className="font-display text-4xl font-extrabold leading-[1.06] tracking-[-0.03em] text-[#0B4650] text-balance sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base font-semibold leading-relaxed text-[#0B4650]/70 text-pretty sm:text-lg">
            {description}
          </p>
        </div>

        <div className="flex max-w-sm items-start gap-3 p-1 text-sm font-semibold text-[#0B4650]/70">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E0F2F1] text-[#0B4650]">
            <SlidersHorizontal className="h-5 w-5" aria-hidden />
          </span>
          <p className="pt-1.5">
            Use filters to compare deadlines, cost, region, grade, and category
            without leaving the list.
          </p>
        </div>
      </div>
    </header>
  );
}
