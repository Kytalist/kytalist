import Link from "next/link";
import { ArrowLeft, BookOpen, Briefcase, Compass, Trophy } from "lucide-react";
import { MeshBackground } from "@/components/MeshBackground";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";

const quickLinks = [
  { href: "/academic", label: "Academic", icon: BookOpen },
  { href: "/professional", label: "Professional", icon: Briefcase },
  { href: "/competition", label: "Competition", icon: Trophy },
  { href: "/opportunities", label: "Opportunities", icon: Compass },
];

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#F9F8F6]">
      <MeshBackground />
      <SiteNav />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-[1440px] flex-col items-center justify-center px-4 pb-32 pt-32 sm:px-6">
        {/* Watermark 404 */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none"
        >
          <span className="font-display block text-[30vw] font-extrabold leading-none tracking-tighter text-[#0B4650]/[0.04] sm:text-[20vw] lg:text-[16vw]">
            404
          </span>
        </div>

        {/* Content card */}
        <div className="card-surface relative mx-auto w-full max-w-xl rounded-[2rem] p-8 text-center sm:p-12">
          {/* Eyebrow */}
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#0B4650]/10 bg-white/60 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#0B4650]/70 shadow-sm backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F28F6B]" />
            404 — Page not found
          </p>

          {/* Headline */}
          <h1 className="font-display mb-4 text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0B4650] text-balance sm:text-5xl">
            Lost in the <span className="text-gradient">cosmos.</span>
          </h1>

          <p className="mb-10 text-base font-medium leading-relaxed text-[#0B4650]/65 text-pretty sm:text-lg">
            This page doesn&rsquo;t exist or may have moved. No
            worries&nbsp;&mdash; there&rsquo;s plenty worth exploring below.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0B4650] px-8 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#062E35] hover:shadow-lg active:scale-[0.98] sm:w-auto sm:min-h-0 sm:py-4"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
              Back to home
            </Link>
            <Link
              href="/activities"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[#0B4650]/15 bg-white/70 px-8 py-3.5 text-sm font-semibold text-[#0B4650] shadow-sm backdrop-blur-xl transition-colors hover:border-[#0B4650]/25 hover:bg-white sm:w-auto sm:min-h-0 sm:py-4"
            >
              <Compass
                className="h-4 w-4 shrink-0 text-[#F28F6B]"
                aria-hidden
              />
              Browse programs
            </Link>
          </div>

          {/* Quick links */}
          <div className="mt-10 border-t border-[#0B4650]/[0.07] pt-8">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-[#0B4650]/40">
              Or jump to
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {quickLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#0B4650]/10 bg-white/60 px-4 py-2 text-xs font-semibold text-[#0B4650]/75 backdrop-blur-sm transition-all hover:border-[#0B4650]/20 hover:bg-white hover:text-[#0B4650]"
                >
                  <Icon className="h-3.5 w-3.5 text-[#F28F6B]" aria-hidden />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
