import { ExtracurricularsExplorer } from "@/components/ExtracurricularsExplorer";
import { MeshBackground } from "@/components/MeshBackground";
import { PageHero } from "@/components/PageHero";
import { getContests } from "@/lib/api/contests";
import { getListings } from "@/lib/api/listings";
import { getMeta } from "@/lib/api/meta";
import { safeFetch } from "@/lib/api/safeFetch";
import type { Listing } from "@/lib/api/types";
import {
  filtersToListParams,
  type ListingsFilters,
  parseListingsFilters,
  type RawSearchParams,
} from "@/lib/api/searchParams";
import { mergeListingFilterOptions } from "@/lib/data";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<RawSearchParams> };

/**
 * Fetch contest-backend data without crashing the page on failure.
 * The contest API is a third-party service — transient 500s are expected.
 * We log a warning instead of an error so they don't look like app crashes.
 */
async function fetchContestsSoft(q: string | undefined): Promise<Listing[]> {
  try {
    const res = await getContests({ limit: 100, q });
    return res.data;
  } catch (err) {
    console.warn(
      "[contests] Contest API unavailable (non-critical):",
      err instanceof Error ? err.message : err,
    );
    return [];
  }
}

function listingMatchesFilters(
  item: Listing,
  filters: ListingsFilters,
): boolean {
  if (filters.type !== "All" && item.type !== filters.type) return false;
  if (filters.cost !== "Any cost" && item.cost !== filters.cost) return false;
  if (filters.region !== "All regions" && item.region !== filters.region) {
    return false;
  }
  if (filters.grade !== "All" && !item.grades?.includes(filters.grade)) {
    return false;
  }
  return true;
}

export default async function CompetitionPage({ searchParams }: Props) {
  const raw = await searchParams;
  const filters = parseListingsFilters(raw);
  const params = filtersToListParams(filters, "competition", { limit: 200 });

  // The contest API returns TechContest items — include it when showing all
  // competitions or specifically filtering by TechContest.
  const includeContests =
    filters.type === "All" || filters.type === "TechContest";

  const [result, contests, metaResult] = await Promise.all([
    safeFetch(() => getListings(params), "competition"),
    includeContests
      ? fetchContestsSoft(filters.q || undefined)
      : Promise.resolve([] as Listing[]),
    safeFetch(() => getMeta(), "meta"),
  ]);

  const items = result.ok ? result.data.data : [];
  const contestItems = contests.filter((item) =>
    listingMatchesFilters(item, filters),
  );

  // Merge: main API items first, then contest backend items
  const allItems = [...items, ...contestItems];
  const total = (result.ok ? result.data.meta.total : 0) + contestItems.length;
  const filterOptions = mergeListingFilterOptions(
    metaResult.ok ? metaResult.data : null,
    allItems,
  );

  return (
    <div className="relative min-h-screen bg-[#F9F8F6]">
      <MeshBackground />
      <main className="relative z-10 mx-auto max-w-[1440px] px-4 pb-24 pt-36 sm:px-6 md:pt-32 lg:pt-40">
        <PageHero
          eyebrow="Competition"
          title="Tech contests, hackathons & startup challenges."
          description="Find competitions across every domain. Filter by type, region, grade, and cost to discover the ones worth your time."
        />
        <ExtracurricularsExplorer
          key={`competition:${JSON.stringify(filters)}`}
          items={allItems}
          total={total}
          initialFilters={filters}
          hrefBase="/competition"
          filterOptions={filterOptions}
          loadFailed={!result.ok}
        />
      </main>
    </div>
  );
}
