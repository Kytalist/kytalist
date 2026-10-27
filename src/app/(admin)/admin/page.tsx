"use client";

import Link from "next/link";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BarChart3,
  CalendarDays,
  Eye,
  FileText,
  Heart,
  ListOrdered,
  Mail,
  MessageSquare,
  MousePointerClick,
  Plus,
  RotateCcw,
  ScrollText,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import {
  adminGetStats,
  adminListAuditLogs,
  adminListListings,
  adminListSubscribers,
  adminListTestimonials,
} from "@/lib/api/adminApi";
import type {
  AdminListing,
  AdminStats,
  AuditLogRow,
  TestimonialAdmin,
} from "@/lib/api/adminTypes";
import { ApiError } from "@/lib/api/client";
import { getSupabaseAccessToken } from "@/lib/supabase/client";

type DashboardData = {
  stats: AdminStats | null;
  recentListings: AdminListing[];
  topListings: AdminListing[];
  subscribers: {
    confirmed: number;
    pending: number;
    unsubscribed: number;
  };
  testimonials: TestimonialAdmin[];
  auditLogs: AuditLogRow[];
};

const EMPTY: DashboardData = {
  stats: null,
  recentListings: [],
  topListings: [],
  subscribers: { confirmed: 0, pending: 0, unsubscribed: 0 },
  testimonials: [],
  auditLogs: [],
};

const panelClass =
  "rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#0B4650]/8";

const actionLabels: Record<string, string> = {
  "listing.create": "Listing created",
  "listing.update": "Listing updated",
  "listing.delete": "Listing deleted",
  "listing.published": "Listing published",
  "listing.draft": "Listing moved to draft",
  "listing.featured": "Featured flag changed",
  "user.create": "User created",
  "user.update": "User updated",
  "user.delete": "User deleted",
  "user.password_set": "Password changed",
  "user.supabase_delete_failed": "User delete failed",
};

function formatAction(action: string): string {
  return (
    actionLabels[action] ?? action.replace(/[._]/g, " ").replace(/^\w/, (c) => c.toUpperCase())
  );
}

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function popularity(listing: AdminListing): number {
  return (
    (listing.clickCount ?? 0) +
    (listing.viewCount ?? 0) +
    (listing.saveCount ?? 0) * 3 +
    (listing.applicationCount ?? 0) * 5
  );
}

function Panel({
  title,
  subtitle,
  icon: Icon,
  action,
  className = "",
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`${panelClass} ${className}`}>
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {Icon ? (
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0B4650]/6 text-[#0B4650]/75">
              <Icon className="h-4 w-4" aria-hidden />
            </span>
          ) : null}
          <div>
            <h2 className="font-display text-base font-bold text-[#0B4650]">
              {title}
            </h2>
            {subtitle ? (
              <p className="text-xs text-[#0B4650]/55">{subtitle}</p>
            ) : null}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-2xl bg-[#F9F8F6] px-4 py-8 text-center text-sm font-medium text-[#0B4650]/55">
      {children}
    </p>
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(
      new Date().toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    );
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const token = await getSupabaseAccessToken();
        const [
          statsRes,
          listingsRes,
          topListingsRes,
          confirmedRes,
          pendingRes,
          unsubRes,
          testimonialsRes,
          auditRes,
        ] = await Promise.all([
          adminGetStats(token),
          adminListListings(token, { limit: 6 }),
          adminListListings(token, { limit: 100 }),
          adminListSubscribers(token, { status: "confirmed", limit: 1 }),
          adminListSubscribers(token, { status: "pending", limit: 1 }),
          adminListSubscribers(token, { status: "unsubscribed", limit: 1 }),
          adminListTestimonials(token),
          adminListAuditLogs(token, { limit: 8 }),
        ]);

        if (cancelled) return;

        const topListings = [...topListingsRes.data]
          .sort((a, b) => popularity(b) - popularity(a))
          .slice(0, 5);

        setData({
          stats: statsRes.data,
          recentListings: listingsRes.data,
          topListings,
          subscribers: {
            confirmed: confirmedRes.meta?.total ?? 0,
            pending: pendingRes.meta?.total ?? 0,
            unsubscribed: unsubRes.meta?.total ?? 0,
          },
          testimonials: testimonialsRes.data,
          auditLogs: auditRes.data,
        });
      } catch (e) {
        if (!cancelled)
          setError(
            e instanceof ApiError ? e.message : "Failed to load dashboard",
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 w-full max-w-md animate-pulse rounded-2xl bg-[#0B4650]/5" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-3xl bg-[#0B4650]/5"
            />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="h-64 animate-pulse rounded-3xl bg-[#0B4650]/5" />
          <div className="h-64 animate-pulse rounded-3xl bg-[#0B4650]/5" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={panelClass}>
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FFE4C4] text-[#B4532A]">
            <AlertCircle className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-base font-bold text-[#0B4650]">
              Could not load the dashboard
            </h1>
            <p className="mt-1 text-sm text-[#0B4650]/65">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            className="inline-flex items-center gap-2 rounded-full bg-[#0B4650] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#062E35]"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = data.stats;
  const publishedListings = stats?.listings.byStatus?.published ?? 0;
  const draftListings = stats?.listings.byStatus?.draft ?? 0;
  const adminUsers = stats?.users.byRole?.admin ?? 0;
  const staffUsers = stats?.users.byRole?.staff ?? 0;
  const publishedTestimonials = data.testimonials.filter(
    (t) => t.published,
  ).length;
  const totalTestimonials = data.testimonials.length;

  const kpis: {
    label: string;
    value: number;
    sub: string;
    icon: LucideIcon;
    tint: string;
  }[] = [
    {
      label: "Listings",
      value: stats?.listings.total ?? 0,
      sub: `${publishedListings} published · ${draftListings} drafts`,
      icon: FileText,
      tint: "bg-[#D6ECFB] text-[#1F6FB2]",
    },
    {
      label: "Users",
      value: stats?.users.total ?? 0,
      sub: `${adminUsers} admins · ${staffUsers} staff`,
      icon: Users,
      tint: "bg-[#E4D7F4] text-[#5E3BB4]",
    },
    {
      label: "Subscribers",
      value: data.subscribers.confirmed,
      sub: `${data.subscribers.pending} pending · ${data.subscribers.unsubscribed} unsubscribed`,
      icon: Mail,
      tint: "bg-[#A3E4D7]/60 text-[#0B4650]",
    },
    {
      label: "Testimonials",
      value: publishedTestimonials,
      sub: `${totalTestimonials - publishedTestimonials} hidden · ${totalTestimonials} total`,
      icon: MessageSquare,
      tint: "bg-[#FFE4C4] text-[#B4532A]",
    },
  ];

  const engagement = [
    {
      label: "Views",
      value: stats?.engagement?.views ?? 0,
      icon: Eye,
      bar: "bg-[#1F6FB2]",
    },
    {
      label: "Clicks",
      value: stats?.engagement?.clicks ?? 0,
      icon: MousePointerClick,
      bar: "bg-[#B08D1A]",
    },
    {
      label: "Saves",
      value: stats?.engagement?.saves ?? 0,
      icon: Heart,
      bar: "bg-[#B4532A]",
    },
    {
      label: "Applications",
      value: stats?.engagement?.applications ?? 0,
      icon: FileText,
      bar: "bg-[#5E3BB4]",
    },
  ];
  const maxEngagement = Math.max(1, ...engagement.map((e) => e.value));

  const categoryEntries = Object.entries(stats?.listings.byCategory ?? {}).sort(
    (a, b) => b[1] - a[1],
  );
  const maxCategory = Math.max(1, ...categoryEntries.map(([, v]) => v));

  const topWithScore = data.topListings.map((l) => ({
    listing: l,
    score: popularity(l),
  }));
  const maxTopScore = Math.max(1, ...topWithScore.map((x) => x.score));

  const quickActions = [
    { href: "/admin/listings/new", label: "Create listing", icon: Plus },
    { href: "/admin/listings", label: "Manage listings", icon: ListOrdered },
    { href: "/admin/testimonials", label: "Testimonials", icon: Sparkles },
    { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/audit", label: "Audit log", icon: ScrollText },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#0B4650]/45">
            Overview
          </p>
          <h1 className="font-display text-2xl font-bold text-[#0B4650]">
            Dashboard
          </h1>
          <p className="mt-1 max-w-xl text-sm text-[#0B4650]/65">
            A quick read on listings, people, and engagement.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {today ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-[#0B4650]/70 ring-1 ring-[#0B4650]/10">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden />
              {today}
            </span>
          ) : null}
          <Link
            href="/admin/listings/new"
            className="inline-flex items-center gap-2 rounded-full bg-[#0B4650] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#062E35]"
          >
            <Plus className="h-4 w-4" aria-hidden />
            New listing
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map(({ label, value, sub, icon: Icon, tint }) => (
          <div
            key={label}
            className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-[#0B4650]/8"
          >
            <div className="flex items-center justify-between gap-3">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-2xl ${tint}`}
              >
                <Icon className="h-4.5 w-4.5" aria-hidden />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B4650]/45">
                {label}
              </span>
            </div>
            <p className="mt-4 font-display text-3xl font-bold leading-none text-[#0B4650]">
              {value}
            </p>
            <p className="mt-2 text-[11px] font-medium leading-relaxed text-[#0B4650]/55">
              {sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Panel
          title="Engagement"
          subtitle="All-time activity across listings"
          icon={BarChart3}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {engagement.map(({ label, value, icon: Icon, bar }) => (
              <div key={label} className="rounded-2xl bg-[#F9F8F6] p-4">
                <div className="flex items-center gap-2 text-[#0B4650]/55">
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    {label}
                  </span>
                </div>
                <p className="mt-2 font-display text-xl font-bold text-[#0B4650]">
                  {value}
                </p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#0B4650]/8">
                  <div
                    className={`h-full rounded-full ${bar}`}
                    style={{
                      width: `${Math.max(4, (value / maxEngagement) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Quick actions" subtitle="Common admin tasks">
          <ul className="space-y-1">
            {quickActions.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group flex items-center gap-3 rounded-xl px-2 py-2 text-sm font-semibold text-[#0B4650] transition-colors hover:bg-[#F9F8F6]"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0B4650]/6 text-[#0B4650]/70 transition-colors group-hover:bg-[#0B4650] group-hover:text-white">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="flex-1">{label}</span>
                  <ArrowRight
                    className="h-4 w-4 text-[#0B4650]/25 transition-colors group-hover:text-[#0B4650]/60"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Listings by category"
          subtitle={`${stats?.listings.total ?? 0} listings`}
          icon={BarChart3}
        >
          {categoryEntries.length === 0 ? (
            <Empty>No category data yet.</Empty>
          ) : (
            <ul className="space-y-4">
              {categoryEntries.map(([category, count]) => (
                <li key={category}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <span className="text-sm font-semibold capitalize text-[#0B4650]">
                      {category}
                    </span>
                    <span className="text-xs font-bold text-[#0B4650]/50">
                      {count}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#0B4650]/8">
                    <div
                      className="h-full rounded-full bg-[#0B4650]"
                      style={{
                        width: `${Math.max(4, (count / maxCategory) * 100)}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Top listings"
          subtitle="Ranked by engagement"
          icon={Sparkles}
        >
          {topWithScore.length === 0 ? (
            <Empty>No engagement data yet.</Empty>
          ) : (
            <ul className="space-y-4">
              {topWithScore.map(({ listing, score }, i) => (
                <li key={listing.id}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0B4650]/6 text-[11px] font-bold text-[#0B4650]/70">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-[#0B4650]">
                        {listing.title}
                      </p>
                      <p className="truncate text-xs text-[#0B4650]/55">
                        {listing.org}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-display text-sm font-bold text-[#0B4650]">
                        {score}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B4650]/40">
                        score
                      </p>
                    </div>
                  </div>
                  <div className="ml-10 mt-2 h-1.5 overflow-hidden rounded-full bg-[#0B4650]/8">
                    <div
                      className="h-full rounded-full bg-[#0B4650]"
                      style={{
                        width: `${Math.max(4, (score / maxTopScore) * 100)}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Recent listings"
          icon={ListOrdered}
          action={
            <Link
              href="/admin/listings"
              className="text-xs font-bold text-[#0B4650]/55 transition-colors hover:text-[#0B4650]"
            >
              View all
            </Link>
          }
        >
          {data.recentListings.length === 0 ? (
            <Empty>No listings yet.</Empty>
          ) : (
            <ul className="divide-y divide-[#0B4650]/6">
              {data.recentListings.map((listing) => {
                const published = listing.status === "published";
                return (
                  <li
                    key={listing.id}
                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        published ? "bg-[#0B8A6B]" : "bg-[#B08D1A]"
                      }`}
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#0B4650]">
                        {listing.title}
                      </p>
                      <p className="truncate text-xs text-[#0B4650]/55">
                        {listing.org} · {listing.category}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        published
                          ? "bg-[#A3E4D7]/45 text-[#0B8A6B]"
                          : "bg-[#FFF3C9] text-[#B08D1A]"
                      }`}
                    >
                      {listing.status}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        <Panel
          title="Recent activity"
          icon={Activity}
          action={
            <Link
              href="/admin/audit"
              className="text-xs font-bold text-[#0B4650]/55 transition-colors hover:text-[#0B4650]"
            >
              View all
            </Link>
          }
        >
          {data.auditLogs.length === 0 ? (
            <Empty>No activity yet.</Empty>
          ) : (
            <ul className="space-y-4">
              {data.auditLogs.map((log) => (
                <li key={log.id} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0B4650]/6 text-[#0B4650]/70">
                    <Activity className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#0B4650]">
                      {formatAction(log.action)}
                    </p>
                    <p className="truncate text-xs text-[#0B4650]/55">
                      {log.entityType} · {log.entityId.slice(0, 8)}
                    </p>
                  </div>
                  <time className="shrink-0 text-[11px] font-medium text-[#0B4650]/40">
                    {formatWhen(log.createdAt)}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
