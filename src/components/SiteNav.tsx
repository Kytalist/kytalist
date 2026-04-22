import Link from "next/link";
import { Sparkles } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/activities", label: "Extracurriculars" },
  { href: "/camps", label: "Summer camps" },
  { href: "/internships", label: "Internships" },
];

export function SiteNav() {
  return (
    <nav className="fixed top-0 left-0 z-50 w-full px-4 py-4 sm:px-6">
      <div className="glass-nav mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 rounded-[1.75rem] px-4 py-3 sm:rounded-full sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2 text-[#0B4650]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B4650] text-white shadow-sm transition-transform duration-300 group-hover:rotate-12">
            <Sparkles className="h-4 w-4" aria-hidden />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">
            Kytalist
            <span className="text-[#F28F6B]">.</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-[#0B4650]/80 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-[#0B4650]"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            className="hidden text-sm font-semibold text-[#0B4650]/80 transition-colors hover:text-[#0B4650] sm:block"
          >
            Sign in
          </button>
          <Link
            href="/internships"
            className="rounded-full bg-[#0B4650] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#062E35] hover:shadow-lg active:scale-[0.98] sm:px-6"
          >
            Explore
          </Link>
        </div>

        <div className="flex w-full basis-full flex-wrap justify-center gap-x-6 gap-y-2 border-t border-[#0B4650]/10 pt-3 text-sm font-medium text-[#0B4650]/80 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-[#0B4650]"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
