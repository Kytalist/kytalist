import { CheckCircle2, SlidersHorizontal } from "lucide-react";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  showFilterHint?: boolean;
};

export function PageHero({
  eyebrow,
  title,
  description,
  showFilterHint = true,
}: PageHeroProps) {
  const compact = !description && !showFilterHint;

  if (compact) {
    return (
      <header className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-white via-[#F9F8F6] to-[#E0F2F1]/70 p-6 text-center shadow-sm ring-1 ring-[#0B4650]/5 sm:p-10 md:mb-8">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-6 text-[#0B4650]/[0.06]"
        >
          <SlidersHorizontal className="h-40 w-40" />
        </span>
        <p className="relative mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-[#0B4650] px-3.5 py-1.5 text-xs font-bold text-white">
          <CheckCircle2 className="h-3.5 w-3.5 text-[#FFD3B6]" aria-hidden />
          {eyebrow}
        </p>
        <h1 className="relative font-display text-4xl font-extrabold leading-[1.06] tracking-[-0.03em] text-[#0B4650] text-balance sm:text-5xl">
          {title}
        </h1>
      </header>
    );
  }

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
          {description ? (
            <p className="mt-4 max-w-2xl text-base font-semibold leading-relaxed text-[#0B4650]/70 text-pretty sm:text-lg">
              {description}
            </p>
          ) : null}
        </div>

        {showFilterHint ? (
          <div className="flex max-w-sm items-start gap-3 p-1 text-sm font-semibold text-[#0B4650]/70">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E0F2F1] text-[#0B4650]">
              <SlidersHorizontal className="h-5 w-5" aria-hidden />
            </span>
            <p className="pt-1.5">
              Use filters to compare deadlines, cost, region, grade, and category
              without leaving the list.
            </p>
          </div>
        ) : null}
      </div>
    </header>
  );
}
