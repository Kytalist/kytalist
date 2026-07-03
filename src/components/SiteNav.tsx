"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  ChevronDown,
  Compass,
  Globe2,
  Menu,
  Trophy,
  X,
  type LucideIcon,
} from "lucide-react";

type NavCategory = {
  label: string;
  href: string;
  description: string;
  icon: LucideIcon;
  tint: string;
  items: Array<{ label: string; href: string }>;
};

const navCategories: NavCategory[] = [
  {
    label: "Academic",
    href: "/academic",
    description: "Olympiads, research, writing, debate",
    icon: BookOpen,
    tint: "bg-[#D6ECFB] text-[#1F6FB2]",
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
    href: "/professional",
    description: "Internships and mentorships",
    icon: Briefcase,
    tint: "bg-[#FFE4C4]/90 text-[#B4532A]",
    items: [
      { label: "Internship", href: "/professional?type=Internship" },
      { label: "Mentorship", href: "/professional?type=Mentorship" },
    ],
  },
  {
    label: "Competition",
    href: "/competition",
    description: "Hackathons, startup cases, tech contests",
    icon: Trophy,
    tint: "bg-[#A3E4D7]/45 text-[#0B4650]",
    items: [
      { label: "Tech Contest", href: "/competition?type=TechContest" },
      { label: "Hackathon", href: "/competition?type=Hackathon" },
      { label: "Startup & Case Solving", href: "/competition?type=Startup" },
      { label: "Film and Art", href: "/competition?type=FilmArt" },
    ],
  },
  {
    label: "Opportunities",
    href: "/opportunities",
    description: "Exchange, conferences, MUN",
    icon: Globe2,
    tint: "bg-[#E4D7F4] text-[#5E3BB4]",
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
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    if (!activeDropdown) return;

    const handleClose = () => setActiveDropdown(null);
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveDropdown(null);
    };

    document.addEventListener("click", handleClose);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("click", handleClose);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [activeDropdown]);

  const closeMenus = () => {
    setMobileOpen(false);
    setActiveDropdown(null);
  };

  return (
    <nav className="fixed left-0 top-0 z-50 w-full px-3 py-3 sm:px-6 sm:py-4">
      <div className="glass-nav mx-auto flex max-w-360 items-center justify-between gap-2 rounded-full px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5">
        <Link
          href="/"
          onClick={closeMenus}
          className="group flex shrink-0 items-center gap-2 rounded-full pr-1 focus:outline-none focus:ring-2 focus:ring-[#0B4650]/20"
        >
          <Image
            src="/images/Kytalist_profile_light.png"
            alt="Kytalist Logo"
            width={40}
            height={40}
            className="h-8 w-8 rounded-[20%] transition-transform duration-200 group-hover:scale-105 sm:h-10 sm:w-10"
          />
          <span className="font-display text-base font-extrabold tracking-tight text-[#0B4650] sm:text-lg lg:text-xl">
            Kytalist<span className="text-[#F28F6B]">.</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full bg-white/34 p-1 ring-1 ring-white/70 md:flex">
          {navCategories.map((cat) => {
            const active = isActiveCategory(pathname, cat.href);
            const dropdownOpen = activeDropdown === cat.label;

            return (
              <div key={cat.label} className="group relative">
                <button
                  type="button"
                  aria-expanded={dropdownOpen}
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveDropdown((prev) =>
                      prev === cat.label ? null : cat.label,
                    );
                  }}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B4650]/20 lg:px-3.5 ${
                    active || dropdownOpen
                      ? "bg-[#0B4650] text-white"
                      : "text-[#0B4650]/76 hover:bg-white/75 hover:text-[#0B4650]"
                  }`}
                >
                  <cat.icon
                    className={`h-4 w-4 ${
                      active || dropdownOpen
                        ? "text-[#FFD3B6]"
                        : "text-[#0B4650]/45"
                    }`}
                    aria-hidden
                  />
                  <span>{cat.label}</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 md:group-hover:rotate-180 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                    strokeWidth={2.5}
                    aria-hidden
                  />
                </button>

                <div
                  className={`absolute left-1/2 top-full -translate-x-1/2 pt-3 transition-all duration-200 ease-out md:group-hover:pointer-events-auto md:group-hover:translate-y-0 md:group-hover:opacity-100 ${
                    dropdownOpen
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none translate-y-1 opacity-0"
                  }`}
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="mx-auto -mb-px h-0 w-0 border-b-8 border-l-[7px] border-r-[7px] border-b-white/88 border-l-transparent border-r-transparent" />

                  <div className="w-[18rem] overflow-hidden rounded-3xl bg-white/92 p-2 shadow-[0_18px_28px_-22px_rgba(11,70,80,0.5)] ring-1 ring-white/90 backdrop-blur-2xl">
                    <Link
                      href={cat.href}
                      onClick={closeMenus}
                      className="group/view flex items-start gap-3 rounded-2xl bg-[#F9F8F6]/85 p-3 transition-colors hover:bg-[#E0F2F1]/70 focus:outline-none focus:ring-2 focus:ring-[#0B4650]/20"
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cat.tint}`}
                      >
                        <cat.icon className="h-5 w-5" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-sm font-extrabold text-[#0B4650]">
                          View all {cat.label}
                        </span>
                        <span className="mt-0.5 block text-xs font-semibold leading-snug text-[#0B4650]/58">
                          {cat.description}
                        </span>
                      </span>
                      <ArrowRight
                        className="mt-1 h-4 w-4 shrink-0 text-[#0B4650]/35 transition-transform group-hover/view:translate-x-0.5"
                        aria-hidden
                      />
                    </Link>

                    <div className="mt-1 grid gap-1">
                      {cat.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMenus}
                          className="flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-[#0B4650]/72 transition-colors hover:bg-[#0B4650]/4.5 hover:text-[#0B4650] focus:outline-none focus:ring-2 focus:ring-[#0B4650]/20"
                        >
                          <span className="flex min-w-0 items-center gap-2.5">
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#F28F6B]" />
                            <span className="truncate">{item.label}</span>
                          </span>
                          <ArrowRight
                            className="h-3.5 w-3.5 shrink-0 text-[#0B4650]/28"
                            aria-hidden
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Link
            href="/activities"
            onClick={closeMenus}
            className={`hidden rounded-full px-4 py-2 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B4650]/25 sm:inline-flex lg:px-5 lg:py-2.5 ${
              pathname === "/activities"
                ? "bg-[#F28F6B] text-[#0B4650]"
                : "bg-[#0B4650] text-white hover:bg-[#062E35]"
            }`}
          >
            Explore all
          </Link>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/48 text-[#0B4650] ring-1 ring-[#0B4650]/8 transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B4650]/20 md:hidden"
          >
            {mobileOpen ? (
              <X size={18} strokeWidth={2.5} />
            ) : (
              <Menu size={18} strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>

      <div
        className={`mx-auto mt-2 max-w-360 rounded-3xl border border-white/85 bg-white/96 shadow-[0_18px_30px_-24px_rgba(11,70,80,0.45)] backdrop-blur-xl transition-all duration-250 ease-out md:hidden ${
          mobileOpen
            ? "max-h-[calc(100vh-6.5rem)] overflow-y-auto opacity-100"
            : "max-h-0 overflow-hidden opacity-0"
        }`}
      >
        <div className="p-3">
          <Link
            href="/activities"
            onClick={closeMenus}
            className="mb-2 flex items-center justify-between gap-3 rounded-2xl bg-[#0B4650] p-4 text-white focus:outline-none focus:ring-2 focus:ring-[#0B4650]/25"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/12 text-[#FFD3B6]">
                <Compass className="h-5 w-5" aria-hidden />
              </span>
              <span>
                <span className="block font-display text-base font-extrabold">
                  Explore all events
                </span>
                <span className="mt-0.5 block text-xs font-semibold text-white/62">
                  Browse the full deadline-aware catalog
                </span>
              </span>
            </span>
            <ArrowRight
              className="h-5 w-5 shrink-0 text-white/70"
              aria-hidden
            />
          </Link>

          {navCategories.map((cat) => {
            const expanded = openCategory === cat.label;
            const active = isActiveCategory(pathname, cat.href);

            return (
              <div
                key={cat.label}
                className="border-t border-[#0B4650]/8 first:border-t-0"
              >
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() =>
                    setOpenCategory((prev) =>
                      prev === cat.label ? null : cat.label,
                    )
                  }
                  className={`flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B4650]/20 ${
                    active ? "bg-[#E0F2F1]/70" : "hover:bg-[#0B4650]/4"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cat.tint}`}
                    >
                      <cat.icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-sm font-extrabold text-[#0B4650]">
                        {cat.label}
                      </span>
                      <span className="block truncate text-xs font-semibold text-[#0B4650]/58">
                        {cat.description}
                      </span>
                    </span>
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-[#0B4650]/48 transition-transform duration-200 ${
                      expanded ? "rotate-180" : ""
                    }`}
                    strokeWidth={2.5}
                    aria-hidden
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-200 ease-out ${
                    expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-2 pb-3">
                    <Link
                      href={cat.href}
                      onClick={closeMenus}
                      className="mb-1 flex items-center justify-between rounded-xl bg-[#F9F8F6] px-3 py-2.5 text-sm font-bold text-[#0B4650]"
                    >
                      View all {cat.label}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                    <div className="grid gap-1">
                      {cat.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMenus}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#0B4650]/76 transition-colors hover:bg-[#0B4650]/4.5 hover:text-[#0B4650]"
                        >
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#F28F6B]" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function isActiveCategory(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
