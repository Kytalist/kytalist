import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarClock, MapPin } from "lucide-react";
import type { Listing } from "@/lib/data";

type Props = {
  item: Listing;
  hrefBase: string;
};

const costTint: Record<string, string> = {
  Free: "bg-[#A3E4D7]/40 text-[#0B4650]",
  Paid: "bg-[#FFE4C4]/80 text-[#B4532A]",
  Stipend: "bg-[#E0F2F1] text-[#0B4650]",
};

export function ExtracurricularCard({ item, hrefBase }: Props) {
  const gradesLabel = formatGrades(item.grades);
  const detailHref = `${hrefBase}#${item.id}`;
  const eventHref = item.eventUrl?.trim();

  return (
    <article className="card-surface squircle group relative flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-white">
        <div className="flex h-full w-full items-center justify-center p-6">
          <Image
            src={item.image}
            alt={item.title}
            width={600}
            height={375}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="max-h-full max-w-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
          {item.type ? (
            <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#0B4650] backdrop-blur-sm">
              {item.type}
            </span>
          ) : (
            <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#0B4650] backdrop-blur-sm">
              {item.badge}
            </span>
          )}
          {item.cost ? (
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide backdrop-blur-sm ${
                costTint[item.cost] ?? "bg-white/90 text-[#0B4650]"
              }`}
            >
              {item.cost}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-6 py-6">
        <div className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-[#0B4650]/60">
          <span>{item.org}</span>
        </div>
        <h3 className="font-display mb-3 text-lg font-bold leading-snug text-[#0B4650] transition-colors group-hover:text-[#F28F6B]">
          <Link href={detailHref}>{item.title}</Link>
        </h3>
        <p className="mb-5 line-clamp-2 text-sm font-medium leading-relaxed text-[#0B4650]/70">
          {item.description}
        </p>

        <div className="mb-5 flex flex-wrap gap-1.5">
          {gradesLabel ? (
            <span className="rounded-full border border-[#0B4650]/10 bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-[#0B4650]/70">
              {gradesLabel}
            </span>
          ) : null}
          {(item.tags ?? []).slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#0B4650]/10 bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-[#0B4650]/70"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-[#0B4650]/10 pt-4">
          <div className="flex min-w-0 flex-col gap-1.5 text-[12.5px] font-semibold text-[#0B4650]/70">
            <span className="flex items-center gap-1.5">
              <MapPin
                className="h-3.5 w-3.5 shrink-0 text-[#F28F6B]"
                aria-hidden
              />
              <span className="truncate">{item.location}</span>
            </span>
            {item.deadline ? (
              <span className="flex items-center gap-1.5">
                <CalendarClock
                  className="h-3.5 w-3.5 shrink-0 text-[#0B4650]/50"
                  aria-hidden
                />
                <span className="truncate">{item.deadline}</span>
              </span>
            ) : null}
          </div>
          {eventHref ? (
            <a
              href={eventHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${item.title} event page`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F9F8F6] text-[#0B4650] transition-all duration-300 group-hover:-rotate-45 group-hover:bg-[#0B4650] group-hover:text-white focus:outline-none focus:ring-2 focus:ring-[#0B4650]/30"
            >
              <ArrowUpRight className="h-5 w-5" aria-hidden />
            </a>
          ) : (
            <Link
              href={detailHref}
              aria-label={`View ${item.title}`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F9F8F6] text-[#0B4650] transition-all duration-300 group-hover:-rotate-45 group-hover:bg-[#0B4650] group-hover:text-white focus:outline-none focus:ring-2 focus:ring-[#0B4650]/30"
            >
              <ArrowUpRight className="h-5 w-5" aria-hidden />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

function formatGrades(grades?: number[]): string | null {
  if (!grades || grades.length === 0) return null;
  const sorted = [...grades].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  if (min === max) return `Grade ${min}`;
  const contiguous = sorted.every((g, i) => i === 0 || g === sorted[i - 1] + 1);
  return contiguous ? `Grades ${min}–${max}` : `Grades ${sorted.join(", ")}`;
}
