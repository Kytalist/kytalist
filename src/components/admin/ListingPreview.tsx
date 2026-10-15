"use client";

import { ExtracurricularCard } from "@/components/ExtracurricularCard";
import type { AdminListing } from "@/lib/api/adminTypes";
import type { Listing } from "@/lib/api/types";

type Props = {
  item: Listing;
  status: AdminListing["status"];
  featured: boolean;
};

const statusTint: Record<AdminListing["status"], string> = {
  draft: "bg-[#FFE4C4] text-[#8C3F24]",
  published: "bg-[#A3E4D7] text-[#0B4650]",
};

export function ListingPreview({ item, status, featured }: Props) {
  const eventHref = item.eventUrl?.trim();
  const showDetail = Boolean(item.descriptionEnabled);
  const actionCaption = showDetail
    ? "View details → event page"
    : eventHref
      ? "Visit event → event link"
      : "No action button (no event link)";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#0B4650]/50">
          Live preview
        </h2>
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${statusTint[status]}`}
          >
            {status}
          </span>
          {featured ? (
            <span className="rounded-full bg-[#F28F6B]/18 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#8C3F24]">
              Featured
            </span>
          ) : null}
        </div>
      </div>

      <ExtracurricularCard item={item} preview />

      <p className="text-xs font-medium leading-relaxed text-[#0B4650]/50">
        Card action:{" "}
        <span className="font-bold text-[#0B4650]/70">{actionCaption}</span>
      </p>
    </div>
  );
}
