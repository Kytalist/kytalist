"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { OpportunityCard } from "@/components/OpportunityCard";
import type { Listing } from "@/lib/api/types";
import { regions } from "@/lib/data";

type Props = {
  items: Listing[];
  hrefBase: string;
  initialRegion: string;
  showRegionFilter?: boolean;
  loadFailed?: boolean;
};

export function ListingGrid({
  items,
  hrefBase,
  initialRegion,
  showRegionFilter = true,
  loadFailed = false,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [region, setRegion] = useState<string>(initialRegion);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setRegion(initialRegion);
  }, [initialRegion]);

  const onPickRegion = (r: string) => {
    setRegion(r);
    const qs = new URLSearchParams();
    if (r !== "All regions") qs.set("region", r);
    const url = qs.toString() ? `${pathname}?${qs.toString()}` : pathname;
    startTransition(() => {
      router.replace(url, { scroll: false });
    });
  };

  return (
    <div className="space-y-8">
      {showRegionFilter ? (
        <div className="flex flex-wrap items-center gap-2">
          {regions.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onPickRegion(r)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                region === r
                  ? "bg-[#0B4650] text-white shadow-sm"
                  : "bg-white/70 text-[#0B4650]/70 hover:bg-white hover:text-[#0B4650]"
              } `}
            >
              {r}
            </button>
          ))}
          {isPending ? (
            <span className="ml-1 text-xs font-medium text-[#0B4650]/40">
              Updating…
            </span>
          ) : null}
        </div>
      ) : null}

      {loadFailed ? (
        <p className="text-center text-[#0B4650]/60">
          Couldn&rsquo;t load programs right now. Please refresh or try again
          shortly.
        </p>
      ) : items.length === 0 ? (
        <p className="text-center text-[#0B4650]/60">
          No listings in this region yet. Try &ldquo;All regions&rdquo; or
          another area.
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} id={item.id} className="scroll-mt-36">
              <OpportunityCard item={item} hrefBase={hrefBase} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
