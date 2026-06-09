"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

const navCategories = [
  {
    label: "Academic",
    items: [
      { label: "Olympiad", href: "/academic?type=Olympiad" },
      { label: "Quiz", href: "/academic?type=Quiz" },
      { label: "Local Fairs", href: "/academic?type=LocalFairs" },
      { label: "Research", href: "/academic?type=Research" },
      {
        label: "Writing Competition",
        href: "/academic?type=WritingCompetition",
      },
      { label: "Debate & Public Speaking", href: "/academic?type=Debate" },
    ],
  },
  {
    label: "Professional",
    items: [
      { label: "Internship", href: "/professional?type=Internship" },
      { label: "Mentorship", href: "/professional?type=Mentorship" },
    ],
  },
  {
    label: "Competition",
    items: [
      { label: "Tech Contest", href: "/competition?type=TechContest" },
      { label: "Hackathon", href: "/competition?type=Hackathon" },
      { label: "Startup & Case Solving", href: "/competition?type=Startup" },
      { label: "Film and Art", href: "/competition?type=FilmArt" },
    ],
  },
  {
    label: "Opportunities",
    items: [
      {
        label: "Exchange Program",
        href: "/opportunities?type=ExchangeProgram",
      },
      { label: "Conferences", href: "/opportunities?type=Conference" },
      { label: "MUN", href: "/opportunities?type=MUN" },
    ],
  },
];

export function SiteNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  return (
    <nav className="fixed top-0 left-0 z-50 w-full px-4 py-4 sm:px-6">
      {/* ── Main pill ── */}
      <div className="glass-nav mx-auto flex max-w-[1440px] items-center justify-between gap-4 rounded-full px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="group flex shrink-0 items-center gap-2">
          <Image
            src="/images/Kytalist_profile_light.png"
            alt="Kytalist Logo"
            width={40}
            height={40}
            className="rounded-[20%] transition-transform duration-300 group-hover:scale-110"
          />
          <span className="font-display text-xl font-bold tracking-tight text-[#0B4650]">
            Kytalist<span className="text-[#F28F6B]">.</span>
          </span>
        </Link>

        {/* ── Desktop dropdown nav ── */}
        <div className="hidden items-center gap-0.5 md:flex">
          {navCategories.map((cat) => (
            <div key={cat.label} className="group relative">
              {/* Trigger */}
              <button
                type="button"
                className="flex cursor-pointer items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-[#0B4650]/75 transition-all duration-150 hover:bg-[#0B4650]/[0.06] hover:text-[#0B4650]"
              >
                {cat.label}
                <ChevronDown
                  size={13}
                  strokeWidth={2.5}
                  className="mt-px text-[#0B4650]/40 transition-transform duration-200 group-hover:rotate-180 group-hover:text-[#0B4650]/70"
                />
              </button>

              {/* Dropdown panel */}
              <div className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 translate-y-1 opacity-0 pt-2.5 transition-all duration-200 ease-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                {/* Arrow tip */}
                <div className="mx-auto mb-[-1px] h-0 w-0 border-b-[7px] border-l-[6px] border-r-[6px] border-b-white/75 border-l-transparent border-r-transparent" />

                <div className="min-w-[210px] overflow-hidden rounded-2xl border border-white/80 bg-white/70 shadow-xl shadow-[#0B4650]/[0.09] backdrop-blur-2xl">
                  <div className="p-1.5">
                    {cat.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="group/item flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm text-[#0B4650]/70 transition-all duration-150 hover:bg-[#0B4650]/[0.05] hover:text-[#0B4650]"
                      >
                        <span className="h-1 w-1 shrink-0 rounded-full bg-[#F28F6B]/50 transition-colors group-hover/item:bg-[#F28F6B]" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right side */}
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/academic"
            className="hidden rounded-full bg-[#0B4650] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#062E35] hover:shadow-lg active:scale-[0.98] sm:block"
          >
            Explore
          </Link>

          {/* Hamburger — mobile only */}
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#0B4650] transition-colors hover:bg-[#0B4650]/[0.07] md:hidden"
          >
            {mobileOpen ? (
              <X size={18} strokeWidth={2.5} />
            ) : (
              <Menu size={18} strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <div
        className={`glass-nav mx-auto mt-2 max-w-[1440px] overflow-hidden rounded-[1.75rem] transition-all duration-300 ease-out md:hidden ${
          mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-3 py-3">
          {navCategories.map((cat, i) => (
            <div key={cat.label}>
              {/* Accordion trigger */}
              <button
                type="button"
                onClick={() =>
                  setOpenCategory((prev) =>
                    prev === cat.label ? null : cat.label,
                  )
                }
                className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-[#0B4650] transition-colors hover:bg-[#0B4650]/[0.05]"
              >
                {cat.label}
                <ChevronDown
                  size={14}
                  strokeWidth={2.5}
                  className={`text-[#0B4650]/40 transition-transform duration-200 ${
                    openCategory === cat.label
                      ? "rotate-180 text-[#0B4650]/70"
                      : ""
                  }`}
                />
              </button>

              {/* Accordion body */}
              <div
                className={`overflow-hidden transition-all duration-200 ease-out ${
                  openCategory === cat.label
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="pb-1 pl-2">
                  {cat.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm text-[#0B4650]/65 transition-colors hover:bg-[#0B4650]/[0.05] hover:text-[#0B4650]"
                    >
                      <span className="h-1 w-1 shrink-0 rounded-full bg-[#F28F6B]/60" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Divider between categories (not after last) */}
              {i < navCategories.length - 1 && (
                <div className="mx-3 h-px bg-[#0B4650]/[0.06]" />
              )}
            </div>
          ))}

          {/* CTA */}
          <div className="mt-3 px-1 pb-1">
            <Link
              href="/academic"
              onClick={() => setMobileOpen(false)}
              className="block w-full rounded-full bg-[#0B4650] py-3 text-center text-sm font-semibold text-white shadow-md transition-all hover:bg-[#062E35] active:scale-[0.98]"
            >
              Explore
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
