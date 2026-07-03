import { ListingGrid } from "@/components/ListingGrid";
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

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<RawSearchParams>;
};

export default async function InternshipsPage({ searchParams }: Props) {
  const raw = await searchParams;
  const filters = parseListingsFilters(raw);
  const params = filtersToListParams(filters, "professional", { limit: 200 });
  const [result, metaResult] = await Promise.all([
    safeFetch(() => getListings(params), "professional"),
    safeFetch(() => getMeta(), "meta"),
  ]);
  const items = result.ok ? result.data.data : [];
  const filterOptions = mergeListingFilterOptions(
    metaResult.ok ? metaResult.data : null,
    items,
  );

  return (
    <div className="relative min-h-screen bg-[#F9F8F6]">
      <MeshBackground />
      <main className="relative z-10 mx-auto max-w-[1440px] px-4 pb-24 pt-36 sm:px-6 md:pt-28 lg:pt-32">
        <PageHero
          eyebrow="Careers"
          title="Internships and research roles across the country"
          description="Paid roles, research posts, and hybrid teams from coast to coast. Use region chips to narrow the list, then confirm deadlines and eligibility on each organization’s site."
        />
        <ListingGrid
          key={`internships:${JSON.stringify(filters)}`}
          items={items}
          hrefBase="/internships"
          initialRegion={filters.region}
          filterOptions={filterOptions}
          showRegionFilter={false}
          loadFailed={!result.ok}
        />
      </main>
    </div>
  );
}
