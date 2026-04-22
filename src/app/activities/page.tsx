import { MeshBackground } from "@/components/MeshBackground";
import { PageHero } from "@/components/PageHero";
import { ExtracurricularsExplorer } from "@/components/ExtracurricularsExplorer";
import { extracurriculars } from "@/lib/data";

export default function ActivitiesPage() {
  return (
    <div className="relative min-h-screen bg-[#F9F8F6]">
      <MeshBackground />
      <main className="relative z-10 mx-auto max-w-[1440px] px-4 pb-24 pt-36 sm:px-6 md:pt-32 lg:pt-40">
        <PageHero
          eyebrow="Extracurriculars"
          title="Every extracurricular worth your time — in one searchable list."
          description="Competitions, research mentorships, clubs, and volunteer programs from across the country. Filter by grade, cost, region, and category to find the ones that actually fit."
        />
        <ExtracurricularsExplorer
          items={extracurriculars}
          hrefBase="/activities"
        />
      </main>
    </div>
  );
}
