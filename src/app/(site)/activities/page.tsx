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

type Props = {
  searchParams: Promise<RawSearchParams>;
};

export default async function ActivitiesPage({ searchParams }: Props) {
  const raw = await searchParams;
  const filters = parseListingsFilters(raw);
  const params = filtersToListParams(filters, "all", { limit: 200 });

  const [result, metaResult] = await Promise.all([
    safeFetch(() => getListings(params), "activities"),
    safeFetch(() => getMeta(), "meta"),
  ]);
  const items = result.ok ? result.data.data : [];
  const total = result.ok ? result.data.meta.total : 0;
  const filterOptions = mergeListingFilterOptions(
    metaResult.ok ? metaResult.data : null,
    items,
  );

  return (
    <div className="relative min-h-screen bg-[#F9F8F6]">
      <MeshBackground />
      <main className="relative z-10 mx-auto max-w-[1440px] px-4 pb-24 pt-36 sm:px-6 md:pt-32 lg:pt-40">
        <PageHero
          eyebrow="Browse"
          title="Browse every opportunity in one place."
          description="Competitions, research mentorships, internships, and programs from across the country. Filter by grade, cost, region, and category to find the ones that actually fit."
        />
        <ExtracurricularsExplorer
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
