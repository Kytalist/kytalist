import { ExtracurricularsExplorer } from "@/components/ExtracurricularsExplorer";
import { MeshBackground } from "@/components/MeshBackground";
import { PageHero } from "@/components/PageHero";
import { getListings } from "@/lib/api/listings";
import { getMeta } from "@/lib/api/meta";
import { safeFetch } from "@/lib/api/safeFetch";
import {
  filtersToListParams,
  parseListingsFilters,
  type RawSearchParams,
} from "@/lib/api/searchParams";
import { mergeListingFilterOptions } from "@/lib/data";


/**
 * TechContest listings are auto-synced programming contests and belong to the
 * Competition section. Keep them out of the catch-all activities catalog.
 */
const HIDDEN_TYPE = "TechContest" as const;

type Props = {
  searchParams: Promise<RawSearchParams>;
};

export default async function ActivitiesPage({ searchParams }: Props) {
  const raw = await searchParams;
  const parsed = parseListingsFilters(raw);
  // A stale `?type=TechContest` link has nothing to show here; fall back to the
  // unfiltered catalog instead of rendering a dead filter chip.
  const filters =
    parsed.type === HIDDEN_TYPE ? { ...parsed, type: "All" as const } : parsed;
  const params = filtersToListParams(filters, "all", { limit: 200 });

  const [result, metaResult] = await Promise.all([
    safeFetch(() => getListings(params), "activities"),
    safeFetch(() => getMeta(), "meta"),
  ]);
  const fetched = result.ok ? result.data.data : [];
  const items = fetched.filter((item) => !item.types?.includes(HIDDEN_TYPE));
  const hidden = fetched.length - items.length;
  const total = result.ok ? Math.max(0, result.data.meta.total - hidden) : 0;
  const mergedOptions = mergeListingFilterOptions(
    metaResult.ok ? metaResult.data : null,
    items,
  );
  const filterOptions = {
    ...mergedOptions,
    extracurricularTypes: mergedOptions.extracurricularTypes.filter(
      (type) => type !== HIDDEN_TYPE,
    ),
  };

  return (
    <div className="relative min-h-screen bg-[#F9F8F6]">
      <MeshBackground />
      <main className="relative z-10 mx-auto max-w-[1440px] px-4 pb-24 pt-36 sm:px-6 md:pt-32 lg:pt-40">
        <PageHero
          eyebrow="Browse"
          title="Browse every opportunity in one place."
          showFilterHint={false}
        />
        <ExtracurricularsExplorer
          key={`activities:${JSON.stringify(filters)}`}
          items={items}
          total={total}
          initialFilters={filters}
          hrefBase="/activities"
          filterOptions={filterOptions}
          loadFailed={!result.ok}
        />
      </main>
    </div>
  );
}
