import { ExtracurricularsExplorer } from "@/components/ExtracurricularsExplorer";
import { MeshBackground } from "@/components/MeshBackground";
import { PageHero } from "@/components/PageHero";
import { getListings } from "@/lib/api/listings";
import { safeFetch } from "@/lib/api/safeFetch";
import { filtersToListParams, parseListingsFilters, type RawSearchParams } from "@/lib/api/searchParams";

type Props = { searchParams: Promise<RawSearchParams> };

export default async function OpportunitiesPage({ searchParams }: Props) {
  const raw = await searchParams;
  const filters = parseListingsFilters(raw);
  const params = filtersToListParams(filters, "opportunity", { limit: 200 });
  const result = await safeFetch(() => getListings(params), "opportunity");
  const items = result.ok ? result.data.data : [];
  const total = result.ok ? result.data.meta.total : 0;

  return (
    <div className="relative min-h-screen bg-[#F9F8F6]">
      <MeshBackground />
      <main className="relative z-10 mx-auto max-w-[1440px] px-4 pb-24 pt-36 sm:px-6 md:pt-32 lg:pt-40">
        <PageHero
          eyebrow="Opportunities"
          title="Exchange programs, conferences & MUN worldwide."
          description="Find global opportunities across every format. Filter by type, region, grade, and cost to discover the ones worth your time."
        />
        <ExtracurricularsExplorer
          items={items}
          total={total}
          initialFilters={filters}
          hrefBase="/opportunities"
          loadFailed={!result.ok}
        />
      </main>
    </div>
  );
}
