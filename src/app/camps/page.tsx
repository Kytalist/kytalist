import { MeshBackground } from "@/components/MeshBackground";
import { PageHero } from "@/components/PageHero";
import { ListingGrid } from "@/components/ListingGrid";
import { summerCamps } from "@/lib/data";

export default function CampsPage() {
  return (
    <div className="relative min-h-screen bg-[#F9F8F6]">
      <MeshBackground />
      <main className="relative z-10 mx-auto max-w-[1440px] px-4 pb-24 pt-36 sm:px-6 md:pt-28 lg:pt-32">
        <PageHero
          eyebrow="Summer"
          title="Camps designed for deep focus and real adventure"
          description="Residential and day programs across the country—from labs and studios to trails and newsrooms. Deadlines, ages, and stipends are highlighted on each card so you can compare quickly."
        />
        <ListingGrid items={summerCamps} hrefBase="/camps" />
      </main>
    </div>
  );
}
