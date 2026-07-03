import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  CalendarClock,
  CircleDollarSign,
  GraduationCap,
  MapPin,
  Tags,
  type LucideIcon,
} from "lucide-react";
import type { Listing } from "@/lib/data";
import { deriveInitials, deriveLogoStyle } from "@/lib/visual";

type Props = {
  item: Listing;
  hrefBase: string;
};

const costTint: Record<string, string> = {
  Free: "bg-[#A3E4D7]/90 text-[#0B4650]",
  Paid: "bg-[#FFE4C4]/95 text-[#B4532A]",
  Stipend: "bg-[#E0F2F1]/95 text-[#0B4650]",
};

const categoryLabel: Record<string, string> = {
  academic: "Academic",
  professional: "Professional",
  competition: "Competition",
  opportunity: "Opportunity",
};

export function ExtracurricularCard({ item, hrefBase }: Props) {
  const gradesLabel = formatGrades(item.grades);
  const detailHref = `${hrefBase}#${item.id}`;
  const eventHref = item.eventUrl?.trim();
  const logo = deriveLogoStyle(item.id);
  const primaryLabel = item.type ?? categoryLabel[item.category] ?? item.badge;
  const deadlineLabel = item.deadline ?? "Rolling deadline";
  const actionLabel = eventHref ? "Visit site" : "View details";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/85 bg-white/82 backdrop-blur-xl transition-colors hover:border-[#0B4650]/18">
      <div className="relative aspect-video w-full overflow-hidden bg-[#E0F2F1]">
        {item.image ? (
          <Image
            src={item.image}
            alt={`${item.title} event image`}
            width={900}
            height={506}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center ${logo.tint} ${logo.text} font-display text-3xl font-extrabold`}
          >
            {deriveInitials(item.org)}
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#062E35]/55 via-transparent to-[#062E35]/12" />

        <div className="absolute left-4 top-4 flex max-w-[calc(100%-2rem)] flex-wrap gap-2">
          <span className="rounded-full bg-white/92 px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-[#0B4650] backdrop-blur-md">
            {primaryLabel}
          </span>
          {item.cost ? (
            <span
              className={`rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-wider backdrop-blur-md ${
                costTint[item.cost] ?? "bg-white/92 text-[#0B4650]"
              }`}
            >
              {item.cost}
            </span>
          ) : null}
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <p className="min-w-0 truncate text-sm font-bold text-white drop-shadow-sm">
            {item.org}
          </p>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#0B4650]/88 px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-white backdrop-blur-md">
            <CalendarClock
              className="h-3.5 w
-3.5 text-[#FFD3B6]"
              aria-hidden
            />
            {deadlineLabel}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-extrabold leading-snug text-[#0B4650] transition-colors group-hover:text-[#B4532A]">
          <Link href={detailHref}>{item.title}</Link>
        </h3>
        <p className="mt-2 flex min-w-0 items-center gap-1.5 text-sm font-bold text-[#0B4650]/58">
          <Building2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="truncate">{item.org}</span>
        </p>

        <p className="mt-4 line-clamp-3 text-sm font-semibold leading-relaxed text-[#0B4650]/72">
          {item.description}
        </p>

        <dl className="mt-5 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <InfoItem
            icon={CalendarClock}
            label="Deadline"
            value={deadlineLabel}
          />
          <InfoItem icon={MapPin} label="Location" value={item.location} />
          {gradesLabel ? (
            <InfoItem
              icon={GraduationCap}
              label="Eligibility"
              value={gradesLabel}
            />
          ) : null}
          {item.cost ? (
            <InfoItem icon={CircleDollarSign} label="Cost" value={item.cost} />
          ) : null}
        </dl>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {(item.tags ?? []).slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-[#0B4650]/6 px-2.5 py-1 text-[11px] font-bold text-[#0B4650]/68"
            >
              <Tags className="h-3 w-3" aria-hidden />
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#0B4650]/10 pt-4">
          <span className="min-w-0 truncate text-xs font-bold text-[#0B4650]/52">
            {item.footer}
          </span>
          {eventHref ? (
            <a
              href={eventHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${item.title} event page`}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#0B4650] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#062E35] focus:outline-none focus:ring-2 focus:ring-[#0B4650]/30"
            >
              {actionLabel}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          ) : (
            <Link
              href={detailHref}
              aria-label={`View ${item.title}`}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#0B4650] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#062E35] focus:outline-none focus:ring-2 focus:ring-[#0B4650]/30"
            >
              {actionLabel}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-2xl bg-[#F9F8F6]/80 px-3 py-2 ring-1 ring-[#0B4650]/8">
      <Icon className="h-4 w-4 shrink-0 text-[#F28F6B]" aria-hidden />
      <div className="min-w-0">
        <dt className="text-[10px] font-black uppercase tracking-wider text-[#0B4650]/42">
          {label}
        </dt>
        <dd className="truncate text-xs font-bold text-[#0B4650]/76">
          {value}
        </dd>
      </div>
    </div>
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
