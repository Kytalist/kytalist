"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ListOrdered,
  Mail,
  ScrollText,
  Sparkles,
  Users,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/listings", label: "Listings", icon: ListOrdered },
  { href: "/admin/testimonials", label: "Testimonials", icon: Sparkles },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/audit", label: "Audit log", icon: ScrollText },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-[#0B4650]/10 bg-white/80 px-3 py-6 backdrop-blur-md md:w-64">
      <Link
        href="/admin"
        className="mb-8 flex items-center gap-2 px-3 font-display text-lg font-bold text-[#0B4650]"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B4650] text-white">
          <Sparkles className="h-4 w-4" aria-hidden />
        </span>
        Kytalist Admin
      </Link>
      <nav className="flex flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? "bg-[#0B4650] text-white shadow-sm"
                  : "text-[#0B4650]/75 hover:bg-white hover:text-[#0B4650]"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
      <Link
        href="/"
        className="mt-auto px-3 pt-8 text-xs font-semibold text-[#0B4650]/50 hover:text-[#0B4650]"
      >
        View public site
      </Link>
    </aside>
  );
}
