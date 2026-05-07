"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminGetStats } from "@/lib/api/adminApi";
import type { AdminStats } from "@/lib/api/adminTypes";
import { ApiError } from "@/lib/api/client";
import { getSupabaseAccessToken } from "@/lib/supabase/client";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getSupabaseAccessToken();
        const res = await adminGetStats(token);
        if (!cancelled) setStats(res.data);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof ApiError ? e.message : "Failed to load stats");
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
      <p className="text-sm font-medium text-[#0B4650]/70">Loading dashboard…</p>
    );
  }

  if (error || !stats) {
    return (
      <p className="text-sm font-medium text-[#B4532A]" role="alert">
        {error ?? "No data"}
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#0B4650]">
          Dashboard
        </h1>
        <p className="mt-1 text-sm font-medium text-[#0B4650]/65">
          Overview of listings and users in the API database.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card-surface squircle p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-[#0B4650]/50">
            Listings
          </p>
          <p className="font-display mt-2 text-3xl font-bold text-[#0B4650]">
            {stats.listings.total}
          </p>
          <ul className="mt-3 space-y-1 text-xs font-medium text-[#0B4650]/70">
            {Object.entries(stats.listings.byStatus).map(([k, v]) => (
              <li key={k}>
                {k}: {v}
              </li>
            ))}
          </ul>
        </div>
        <div className="card-surface squircle p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-[#0B4650]/50">
            Users
          </p>
          <p className="font-display mt-2 text-3xl font-bold text-[#0B4650]">
            {stats.users.total}
          </p>
          <ul className="mt-3 space-y-1 text-xs font-medium text-[#0B4650]/70">
            {Object.entries(stats.users.byRole).map(([k, v]) => (
              <li key={k}>
                {k}: {v}
              </li>
            ))}
          </ul>
        </div>
        <div className="card-surface squircle flex flex-col justify-center p-6 sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-bold uppercase tracking-wider text-[#0B4650]/50">
            Quick links
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <Link
              href="/admin/listings/new"
              className="text-sm font-semibold text-[#F28F6B] hover:underline"
            >
              New listing
            </Link>
            <Link
              href="/admin/listings"
              className="text-sm font-semibold text-[#0B4650] hover:underline"
            >
              All listings
            </Link>
            <Link
              href="/admin/testimonials"
              className="text-sm font-semibold text-[#0B4650] hover:underline"
            >
              Testimonials
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
