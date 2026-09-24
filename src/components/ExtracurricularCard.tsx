import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarClock,
  GraduationCap,
  MapPin,
} from "lucide-react";
import type { Listing } from "@/lib/data";
import { formatDeadline, formatGrades } from "@/lib/format";
import { deriveInitials, deriveLogoStyle } from "@/lib/visual";

type Props = {
  item: Listing;
  /** Render as a static preview: titles and CTA are not interactive. */
  preview?: boolean;
};

const costTint: Record<string, string> = {
  Free: "bg-[#A3E4D7] text-[#0B4650]",
  Paid: "bg-[#FFE4C4] text-[#8C3F24]",
  Stipend: "bg-[#E0F2F1] text-[#0B4650]",
};

const categoryLabel: Record<string, string> = {
  academic: "Academic",
  professional: "Professional",
  competition: "Competition",
  opportunity: "Opportunity",
};

export function ExtracurricularCard({ item, preview = false }: Props) {
  const gradesLabel = formatGrades(item.grades);
  const eventHref = item.eventUrl?.trim();
  const detailHref = `/events/${item.id}`;
  const logo = deriveLogoStyle(item.id);
  const typeLabels = item.types?.length
    ? item.types
    : [categoryLabel[item.category] ?? item.category];
  const deadlineLabel = formatDeadline(item.deadline);
  const showDetail = Boolean(item.descriptionEnabled);
  const isExternal = !showDetail && Boolean(eventHref);
  const hasAction = showDetail || Boolean(eventHref);
  const actionLabel = showDetail ? "View details" : "Visit event";
  const href = isExternal ? (eventHref as string) : detailHref;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#0B4650]/10 bg-white transition-all duration-300 focus-within:border-[#0B4650]/25 hover:-translate-y-1 hover:border-[#0B4650]/20 hover:shadow-[0_20px_44px_-26px_rgba(11,70,80,0.45)]">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#EEF2F0]">
        {item.image ? (
          <>
            <Image
              src={item.image}
              alt=""
              aria-hidden
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="scale-110 object-cover blur-2xl"
            />
            <span className="absolute inset-0 bg-white/45" />
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          </>
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center ${logo.tint} ${logo.text} font-display text-3xl font-extrabold`}
          >
            {deriveInitials(item.org)}
          </div>
        )}

        <span className="absolute left-3 top-3 inline-flex max-w-[80%] items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-[#0B4650] shadow-sm backdrop-blur-sm">
          <CalendarClock
            className="h-3.5 w-3.5 shrink-0 text-[#F28F6B]"
            aria-hidden
          />
          <span className="truncate">{deadlineLabel}</span>
        </span>

        {item.cost ? (
          <span
            className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wide shadow-sm ${costTint[item.cost] ?? "bg-white/95 text-[#0B4650]"}`}
          >
            {item.cost}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-1.5">
          {typeLabels.map((label) => (
            <span
              key={label}
              className="rounded-full bg-[#0B4650]/8 px-2.5 py-1 text-[11px] font-bold text-[#0B4650]"
            >
              {label}
            </span>
          ))}
        </div>

        <h3 className="font-display mt-3 line-clamp-2 text-lg font-bold leading-snug text-[#0B4650] transition-colors group-hover:text-[#B4532A]">
          {item.title}
        </h3>

        <div className="mt-2.5 flex items-center gap-2">
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${logo.tint} ${logo.text} font-display text-[10px] font-bold`}
            aria-hidden
          >
            {deriveInitials(item.org, 1)}
          </span>
          <p className="truncate text-sm font-semibold text-[#0B4650]/75">
            {item.org}
          </p>
        </div>

        <dl className="mt-3.5 space-y-1.5 text-sm font-semibold text-[#0B4650]/75">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-[#F28F6B]" aria-hidden />
            <dd className="truncate">{item.location}</dd>
          </div>
          {gradesLabel ? (
            <div className="flex items-center gap-2">
              <GraduationCap
                className="h-4 w-4 shrink-0 text-[#F28F6B]"
                aria-hidden
              />
              <dd className="truncate">{gradesLabel}</dd>
            </div>
          ) : null}
        </dl>

        {hasAction ? (
          <div className="mt-auto flex items-center justify-end pt-4">
            <span className="inline-flex items-center gap-1 text-sm font-bold text-[#0B4650] transition-colors group-hover:text-[#B4532A]">
              {actionLabel}
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden
              />
            </span>
          </div>
        ) : null}
      </div>

      {!preview && hasAction ? (
        isExternal ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${item.title} event page`}
            className="absolute inset-0 z-10 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0B4650]/45"
          />
        ) : (
          <Link
            href={href}
            aria-label={`View ${item.title}`}
            className="absolute inset-0 z-10 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0B4650]/45"
          />
        )
      ) : null}
    </article>
  );
}

