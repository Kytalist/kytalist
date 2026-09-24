import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarClock,
  GraduationCap,
  MapPin,
} from "lucide-react";
import type { Listing } from "@/lib/data";
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
  const deadlineLabel = item.deadline ?? "Rolling deadline";
  const showDetail = Boolean(item.descriptionEnabled);
  const actionLabel = showDetail ? "View details" : "Visit event";
  const titleExternal = !showDetail && Boolean(eventHref);
  const actionClassName =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0B4650] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#062E35] focus:outline-none focus:ring-2 focus:ring-[#0B4650]/30";
  const actionContent = (
    <>
      {actionLabel}
      <ArrowUpRight className="h-4 w-4" aria-hidden />
    </>
  );

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#0B4650]/10 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F1F3F2]">
        {item.image ? (
          <>
            <Image
              src={item.image}
              alt=""
              aria-hidden
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="scale-110 object-cover blur-2xl"
            />
            <span className="absolute inset-0 bg-white/55" />
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-contain"
            />
          </>
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center ${logo.tint} ${logo.text} font-display text-3xl font-extrabold`}
          >
            {deriveInitials(item.org)}
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {typeLabels.map((label) => (
            <span
              key={label}
              className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-[#0B4650] ring-1 ring-black/5"
            >
              {label}
            </span>
          ))}
        </div>

        {item.cost ? (
          <span
            className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wide ${costTint[item.cost] ?? "bg-white/95 text-[#0B4650]"}`}
          >
            {item.cost}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg font-bold leading-snug text-[#0B4650] transition-colors group-hover:text-[#B4532A]">
          {preview || (!showDetail && !eventHref) ? (
            item.title
          ) : titleExternal ? (
            <a href={eventHref} target="_blank" rel="noopener noreferrer">
              {item.title}
            </a>
          ) : (
            <Link href={detailHref}>{item.title}</Link>
          )}
        </h3>

        <p className="mt-1 truncate text-sm font-semibold text-[#0B4650]/60">
          {item.org}
        </p>

        <dl className="mt-3 space-y-1.5 text-sm font-semibold text-[#0B4650]/75">
          <div className="flex items-center gap-2">
            <CalendarClock
              className="h-4 w-4 shrink-0 text-[#F28F6B]"
              aria-hidden
            />
            <dd className="truncate">{deadlineLabel}</dd>
          </div>
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

        <div className="mt-auto pt-4">
          {showDetail ? (
            preview ? (
              <span className={actionClassName}>{actionContent}</span>
            ) : (
              <Link
                href={detailHref}
                aria-label={`View ${item.title}`}
                className={actionClassName}
              >
                {actionContent}
              </Link>
            )
          ) : eventHref ? (
            preview ? (
              <span className={actionClassName}>{actionContent}</span>
            ) : (
              <a
                href={eventHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${item.title} event page`}
                className={actionClassName}
              >
                {actionContent}
              </a>
            )
          ) : null}
        </div>
      </div>
    </article>
  );
}

function formatGrades(grades?: string[]): string | null {
  if (!grades || grades.length === 0) return null;
  return grades.join(" · ");
}
