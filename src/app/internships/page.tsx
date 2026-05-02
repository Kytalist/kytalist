import { MeshBackground } from "@/components/MeshBackground";
import { PageHero } from "@/components/PageHero";
import { ListingGrid } from "@/components/ListingGrid";
import { internships } from "@/lib/data";

export default function InternshipsPage() {
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
          items={internships}
          hrefBase="/internships"
          showRegionFilter={false}
        />
      </main>
    </div>
  );
}
