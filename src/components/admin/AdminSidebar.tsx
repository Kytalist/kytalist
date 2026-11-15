"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ExternalLink,
  LayoutDashboard,
  ListOrdered,
  Mail,
  PanelLeftClose,
  PanelLeftOpen,
  ScrollText,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useAdminRole } from "./AdminRoleContext";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/listings", label: "Listings", icon: ListOrdered },
  { href: "/admin/testimonials", label: "Testimonials", icon: Sparkles },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/audit", label: "Audit log", icon: ScrollText },
] as const;

type AdminSidebarProps = {
  /** Desktop: icon-only rail instead of the full sidebar. */
  collapsed: boolean;
  /** Mobile: slide-over drawer visibility. */
  mobileOpen: boolean;
  onToggleCollapsed: () => void;
  onCloseMobile: () => void;
};

export function AdminSidebar({
  collapsed,
  mobileOpen,
  onToggleCollapsed,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const role = useAdminRole();
  const visibleLinks =
    role === "staff"
      ? links.filter((link) => link.href === "/admin/listings")
      : links;

  return (
    <>
      {/* Mobile scrim */}
      <button
        type="button"
        aria-label="Close navigation"
        aria-hidden={!mobileOpen}
        tabIndex={mobileOpen ? 0 : -1}
        onClick={onCloseMobile}
        className={`fixed inset-0 z-40 cursor-default bg-[#0B4650]/25 backdrop-blur-[1px] transition-opacity duration-200 md:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        id="admin-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-[#0B4650]/10 bg-white/95 px-3 py-6 backdrop-blur-md transition-[width,transform,visibility] duration-200 ease-out md:static md:z-auto md:h-full md:translate-x-0 md:visible md:bg-white/80 ${
          collapsed ? "md:w-[72px]" : "md:w-64"
        } ${mobileOpen ? "translate-x-0 max-md:visible" : "-translate-x-full max-md:invisible"}`}
      >
        <div
          className={`mb-8 flex items-center justify-between gap-2 px-2 ${
            collapsed ? "md:flex-col md:items-center md:gap-3" : ""
          }`}
        >
          <Link
            href="/admin"
            onClick={onCloseMobile}
            className={`flex min-w-0 items-center gap-2.5 font-display text-lg font-bold text-[#0B4650] ${
              collapsed ? "md:justify-center" : ""
            }`}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0B4650] text-white">
              <Sparkles className="h-4 w-4" aria-hidden />
            </span>
            <span className={`truncate ${collapsed ? "md:hidden" : ""}`}>
              Kytalist Admin
            </span>
          </Link>

          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-controls="admin-sidebar"
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#0B4650]/55 transition-colors hover:bg-[#0B4650]/8 hover:text-[#0B4650] focus:outline-none focus:ring-2 focus:ring-[#0B4650]/20 md:flex"
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" aria-hidden />
            ) : (
              <PanelLeftClose className="h-4 w-4" aria-hidden />
            )}
          </button>

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#0B4650]/55 transition-colors hover:bg-[#0B4650]/8 hover:text-[#0B4650] focus:outline-none focus:ring-2 focus:ring-[#0B4650]/20 md:hidden"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {visibleLinks.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onCloseMobile}
                title={label}
                aria-label={collapsed ? label : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  collapsed ? "md:justify-center md:px-0" : ""
                } ${
                  active
                    ? "bg-[#0B4650] text-white shadow-sm"
                    : "text-[#0B4650]/75 hover:bg-white hover:text-[#0B4650]"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                <span className={`truncate ${collapsed ? "md:hidden" : ""}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        <Link
          href="/"
          onClick={onCloseMobile}
          title="View public site"
          aria-label={collapsed ? "View public site" : undefined}
          className={`mt-auto flex items-center gap-2 px-3 pt-8 text-xs font-semibold text-[#0B4650]/50 transition-colors hover:text-[#0B4650] ${
            collapsed ? "md:justify-center md:px-0" : ""
          }`}
        >
          <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className={`truncate ${collapsed ? "md:hidden" : ""}`}>
            View public site
          </span>
        </Link>
      </aside>
    </>
  );
}
