import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bookmark, MapPin } from "lucide-react";
import type { Listing } from "@/lib/data";

type Props = {
  item: Listing;
  hrefBase: string;
};

export function OpportunityCard({ item, hrefBase }: Props) {
  const detailHref = `${hrefBase}#${item.id}`;
  const eventHref = item.eventUrl?.trim();

  return (
    <article className="card-surface squircle group relative flex w-full flex-col overflow-hidden p-3">
      <div className="squircle relative mb-4 w-full shrink-0 overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          width={800}
          height={600}
          className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 400px"
        />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#0B4650] backdrop-blur-sm">
            {item.badge}
          </span>
          <span className="flex max-w-[150px] sm:max-w-[200px] items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
            <MapPin className="h-3 w-3 shrink-0 text-[#FFD3B6]" aria-hidden />
            <span className="truncate">{item.location}</span>
          </span>
        </div>
        <button
          type="button"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-[#0B4650]"
          aria-label="Save listing"
        >
          <Bookmark className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-grow flex-col px-3 pb-3">
        <div className="mb-3 flex items-center justify-between text-[13px] font-semibold text-[#0B4650]/60">
          <span>{item.org}</span>
          {item.deadline ? <span>{item.deadline}</span> : null}
        </div>
        <h3 className="font-display mb-2 text-xl font-bold leading-tight text-[#0B4650] transition-colors group-hover:text-[#F28F6B]">
          <Link href={detailHref}>{item.title}</Link>
        </h3>
        <p className="mb-6 line-clamp-2 text-sm font-medium leading-relaxed text-[#0B4650]/70">
          {item.description}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-[#0B4650]/10 pt-4">
          <span className="text-sm font-bold text-[#0B4650]">{item.footer}</span>
          {eventHref ? (
            <a
              href={eventHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${item.title} event page`}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F9F8F6] text-[#0B4650] transition-all duration-300 group-hover:-rotate-45 group-hover:bg-[#0B4650] group-hover:text-white focus:outline-none focus:ring-2 focus:ring-[#0B4650]/30"
            >
              <ArrowRight className="h-5 w-5" aria-hidden />
            </a>
          ) : (
            <Link
              href={detailHref}
              aria-label={`View ${item.title}`}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F9F8F6] text-[#0B4650] transition-all duration-300 group-hover:-rotate-45 group-hover:bg-[#0B4650] group-hover:text-white focus:outline-none focus:ring-2 focus:ring-[#0B4650]/30"
            >
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
