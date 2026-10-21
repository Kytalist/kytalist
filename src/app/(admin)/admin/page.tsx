"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  Mail,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  adminGetStats,
  adminListAuditLogs,
  adminListListings,
  adminListSubscribers,
  adminListTestimonials,
  adminListUsers,
} from "@/lib/api/adminApi";
import type {
  AdminListing,
  AdminStats,
  AdminUser,
  AuditLogRow,
  SubscriberRow,
  TestimonialAdmin,
} from "@/lib/api/adminTypes";
import { ApiError } from "@/lib/api/client";
import { getSupabaseAccessToken } from "@/lib/supabase/client";

type DashboardData = {
  stats: AdminStats | null;
  recentListings: AdminListing[];
  recentUsers: AdminUser[];
  subscribers: {
    total: number;
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
  recentUsers: [],
  subscribers: { total: 0, confirmed: 0, pending: 0, unsubscribed: 0 },
  testimonials: [],
  auditLogs: [],
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getSupabaseAccessToken();
        const [
          statsRes,
          listingsRes,
          usersRes,
          confirmedRes,
          pendingRes,
          unsubRes,
          testimonialsRes,
          auditRes,
        ] = await Promise.all([
          adminGetStats(token),
          adminListListings(token, { limit: 6 }),
          adminListUsers(token, { limit: 5 }),
          adminListSubscribers(token, { status: "confirmed", limit: 1 }),
          adminListSubscribers(token, { status: "pending", limit: 1 }),
          adminListSubscribers(token, { status: "unsubscribed", limit: 1 }),
          adminListTestimonials(token),
          adminListAuditLogs(token, { limit: 8 }),
        ]);

        if (cancelled) return;

        const confirmed = confirmedRes.meta?.total ?? 0;
        const pending = pendingRes.meta?.total ?? 0;
        const unsubscribed = unsubRes.meta?.total ?? 0;

        setData({
          stats: statsRes.data,
          recentListings: listingsRes.data,
          recentUsers: usersRes.data,
          subscribers: {
            total: confirmed + pending + unsubscribed,
            confirmed,
            pending,
            unsubscribed,
          },
          testimonials: testimonialsRes.data,
          auditLogs: auditRes.data,
        });
      } catch (e) {
        if (!cancelled)
          setError(e instanceof ApiError ? e.message : "Failed to load dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-[#0B4650]/10" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl bg-[#0B4650]/8"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm font-medium text-[#B4532A]" role="alert">
        {error}
      </p>
    );
  }

  const stats = data.stats;
  const publishedListings =
    stats?.listings.byStatus?.published ?? 0;
  const draftListings = stats?.listings.byStatus?.draft ?? 0;
  const adminUsers =
    stats?.users.byRole?.admin ?? 0;
  const regularUsers =
    stats?.users.byRole?.user ?? 0;
  const publishedTestimonials = data.testimonials.filter(
    (t) => t.published,
  ).length;

  const kpis = [
    {
      label: "Total listings",
      value: stats?.listings.total ?? 0,
      icon: FileText,
      tint: "bg-[#D6ECFB] text-[#1F6FB2]",
    },
    {
      label: "Published",
      value: publishedListings,
      icon: CheckCircle2,
      tint: "bg-[#A3E4D7]/40 text-[#0B8A6B]",
    },
    {
      label: "Drafts",
      value: draftListings,
      icon: FileText,
      tint: "bg-[#FFF3C9] text-[#B08D1A]",
    },
    {
      label: "Users",
      value: stats?.users.total ?? 0,
      icon: Users,
      tint: "bg-[#E4D7F4] text-[#5E3BB4]",
    },
    {
      label: "Admins",
      value: adminUsers,
      icon: ShieldCheck,
      tint: "bg-[#FADCD0] text-[#B4532A]",
    },
    {
      label: "Subscribers",
      value: data.subscribers.total,
      icon: Mail,
      tint: "bg-[#FFE4C4]/80 text-[#B4532A]",
    },
    {
      label: "Confirmed subs",
      value: data.subscribers.confirmed,
      icon: Mail,
      tint: "bg-[#A3E4D7]/40 text-[#0B8A6B]",
    },
    {
      label: "Testimonials",
      value: publishedTestimonials,
      icon: MessageSquare,
      tint: "bg-[#D6ECFB] text-[#1F6FB2]",
    },
  ];

  const categoryEntries = Object.entries(stats?.listings.byCategory ?? {}).sort(
    (a, b) => b[1] - a[1],
  );
  const maxCategory = Math.max(1, ...categoryEntries.map(([, v]) => v));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0B4650]">
            Dashboard
          </h1>
          <p className="mt-1 text-sm font-medium text-[#0B4650]/65">
            Overview of listings, users, subscribers, and recent activity.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-[#E0F2F1] px-3 py-1.5 text-xs font-bold text-[#0B4650]">
          <Sparkles className="h-3.5 w-3.5 text-[#F28F6B]" aria-hidden />
          {new Date().toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="card-surface squircle flex items-center gap-4 p-5"
          >
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${k.tint}`}
            >
              <k.icon className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-[#0B4650]/50">
                {k.label}
              </p>
              <p className="font-display text-2xl font-bold text-[#0B4650]">
                {k.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Category breakdown + Quick actions */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="card-surface squircle p-6">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#0B4650]" aria-hidden />
            <h2 className="font-display text-lg font-bold text-[#0B4650]">
              Listings by category
            </h2>
          </div>
          {categoryEntries.length === 0 ? (
            <p className="text-sm font-medium text-[#0B4650]/60">
              No category data yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {categoryEntries.map(([cat, count]) => (
                <li key={cat}>
                  <div className="mb-1 flex items-center justify-between text-sm font-semibold text-[#0B4650]">
                    <span className="capitalize">{cat}</span>
                    <span className="text-[#0B4650]/60">{count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#0B4650]/8">
                    <div
                      className="h-full rounded-full bg-[#0B4650] transition-all"
                      style={{
                        width: `${Math.max(6, (count / maxCategory) * 100)}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card-surface squircle p-6">
          <h2 className="font-display text-lg font-bold text-[#0B4650]">
            Quick actions
          </h2>
          <div className="mt-4 grid gap-2">
            {[
              { href: "/admin/listings/new", label: "Create new listing" },
              { href: "/admin/listings", label: "Manage listings" },
              { href: "/admin/testimonials", label: "Manage testimonials" },
              { href: "/admin/newsletter", label: "Newsletter & broadcast" },
              { href: "/admin/users", label: "Manage users" },
              { href: "/admin/audit", label: "Audit logs" },
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="flex items-center justify-between rounded-xl border border-[#0B4650]/10 bg-white/60 px-4 py-2.5 text-sm font-semibold text-[#0B4650] transition-colors hover:bg-[#0B4650]/5"
              >
                {a.label}
                <ArrowRight className="h-4 w-4 text-[#0B4650]/40" aria-hidden />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent listings + Recent activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-surface squircle p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-[#0B4650]">
              Recent listings
            </h2>
            <Link
              href="/admin/listings"
              className="text-xs font-bold text-[#0B4650]/60 hover:text-[#0B4650]"
            >
              View all
            </Link>
          </div>
          {data.recentListings.length === 0 ? (
            <p className="text-sm font-medium text-[#0B4650]/60">
              No listings yet.
            </p>
          ) : (
            <ul className="divide-y divide-[#0B4650]/8">
              {data.recentListings.map((l) => (
                <li
                  key={l.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#0B4650]">
                      {l.title}
                    </p>
                    <p className="truncate text-xs font-medium text-[#0B4650]/60">
                      {l.org} · {l.category}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      l.status === "published"
                        ? "bg-[#A3E4D7]/40 text-[#0B8A6B]"
                        : "bg-[#FFF3C9] text-[#B08D1A]"
                    }`}
                  >
                    {l.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card-surface squircle p-6">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-[#0B4650]" aria-hidden />
            <h2 className="font-display text-lg font-bold text-[#0B4650]">
              Recent activity
            </h2>
          </div>
          {data.auditLogs.length === 0 ? (
            <p className="text-sm font-medium text-[#0B4650]/60">
              No activity yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {data.auditLogs.map((log) => (
                <li
                  key={log.id}
                  className="flex items-start gap-3 border-b border-[#0B4650]/6 pb-3 last:border-0 last:pb-0"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0B4650]/8 text-[#0B4650]">
                    <Activity className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#0B4650]">
                      {log.action}
                    </p>
                    <p className="truncate text-xs font-medium text-[#0B4650]/60">
                      {log.entityType} · {log.entityId}
                    </p>
                    <p className="text-[11px] font-medium text-[#0B4650]/45">
                      {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Subscriber breakdown */}
      <div className="card-surface squircle p-6">
        <h2 className="mb-4 font-display text-lg font-bold text-[#0B4650]">
          Newsletter subscribers
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Confirmed",
              value: data.subscribers.confirmed,
              tint: "bg-[#A3E4D7]/40 text-[#0B8A6B]",
            },
            {
              label: "Pending",
              value: data.subscribers.pending,
              tint: "bg-[#FFF3C9] text-[#B08D1A]",
            },
            {
              label: "Unsubscribed",
              value: data.subscribers.unsubscribed,
              tint: "bg-[#FADCD0] text-[#B4532A]",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-3 rounded-xl border border-[#0B4650]/8 bg-white/60 p-4"
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.tint}`}
              >
                <Mail className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#0B4650]/50">
                  {s.label}
                </p>
                <p className="font-display text-xl font-bold text-[#0B4650]">
                  {s.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}