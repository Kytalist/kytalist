"use client";

import { useMemo, useState } from "react";
import { OpportunityCard } from "@/components/OpportunityCard";
import type { Listing } from "@/lib/data";
import { regions } from "@/lib/data";

type Props = {
  items: Listing[];
  hrefBase: string;
  showRegionFilter?: boolean;
};

export function ListingGrid({
  items,
  hrefBase,
  showRegionFilter = true,
}: Props) {
  const [region, setRegion] = useState<string>("All regions");

  const filtered = useMemo(() => {
    if (!showRegionFilter || region === "All regions") return items;
    return items.filter((i) => i.region === region);
  }, [items, region, showRegionFilter]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {showRegionFilter &&
          regions.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRegion(r)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                region === r
                  ? "bg-[#0B4650] text-white shadow-sm"
                  : "bg-white/70 text-[#0B4650]/70 hover:bg-white hover:text-[#0B4650]"
              } `}
            >
              {r}
            </button>
          ))}
      </div>
      {filtered.length === 0 ? (
        <p className="text-center text-[#0B4650]/60">
          No listings in this region yet. Try &ldquo;All regions&rdquo; or
          another area.
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <div key={item.id} id={item.id} className="scroll-mt-36">
              <OpportunityCard item={item} hrefBase={hrefBase} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
