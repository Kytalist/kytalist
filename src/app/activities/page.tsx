import { MeshBackground } from "@/components/MeshBackground";
import { PageHero } from "@/components/PageHero";
import { ListingGrid } from "@/components/ListingGrid";
import { extracurriculars } from "@/lib/data";

export default function ActivitiesPage() {
  return (
    <div className="relative min-h-screen bg-[#F9F8F6]">
      <MeshBackground />
      <main className="relative z-10 mx-auto max-w-[1440px] px-4 pb-24 pt-36 sm:px-6 md:pt-28 lg:pt-32">
        <PageHero
          eyebrow="Extracurriculars"
          title="Activities that go beyond the bell schedule"
          description="Clubs, teams, and programs that build skills beyond the classroom. Filter by region to find what is near you—or plan around a program worth traveling for."
        />
        <ListingGrid items={extracurriculars} hrefBase="/activities" />
      </main>
    </div>
  );
}
