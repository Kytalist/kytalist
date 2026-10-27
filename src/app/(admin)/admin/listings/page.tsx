"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  Archive,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  Globe,
  Heart,
  MousePointerClick,
  Pencil,
  Plus,
  Search,
  Star,
  X,
} from "lucide-react";
import { adminListListings, adminUpdateListing } from "@/lib/api/adminApi";
import type { AdminListing } from "@/lib/api/adminTypes";
import { ApiError } from "@/lib/api/client";
import { getSupabaseAccessToken } from "@/lib/supabase/client";
import { deriveInitials, deriveLogoStyle } from "@/lib/visual";

const limit = 25;

const categoryTint: Record<string, string> = {
  academic: "bg-[#D6ECFB] text-[#1F6FB2]",
  professional: "bg-[#E4D7F4] text-[#5E3BB4]",
  competition: "bg-[#FFF3C9] text-[#B08D1A]",
  opportunity: "bg-[#A3E4D7]/50 text-[#0B4650]",
};

const statusFilters = [
  { value: "", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
];

const categories = [
  { value: "", label: "All categories" },
  { value: "academic", label: "Academic" },
  { value: "professional", label: "Professional" },
  { value: "competition", label: "Competition" },
  { value: "opportunity", label: "Opportunity" },
];

const inputClass =
  "rounded-xl border border-[#0B4650]/15 bg-white px-3.5 py-2.5 text-sm font-medium text-[#0B4650] outline-none transition-colors placeholder:text-[#0B4650]/35 focus:border-[#0B4650]/35 focus:ring-4 focus:ring-[#0B4650]/5";

function compact(value: number): string {
  if (value >= 1000) {
    const n = value / 1000;
    return `${n >= 10 ? Math.round(n) : n.toFixed(1)}k`;
  }
  return String(value);
}

function formatUpdated(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ListingThumb({
  src,
  title,
  seed,
}: {
  src: string | null;
  title: string;
  seed: string;
}) {
  const [failed, setFailed] = useState(false);
  const style = deriveLogoStyle(seed);

  if (!src || failed) {
    return (
      <span
        aria-hidden
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-display text-xs font-bold ${style.tint} ${style.text}`}
      >
        {deriveInitials(title, 2)}
      </span>
    );
  }

  return (
    <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl bg-[#0B4650]/5">
      <Image
        src={src}
        alt=""
        fill
        sizes="44px"
        className="object-cover"
        unoptimized
        onError={() => setFailed(true)}
      />
    </span>
  );
}

export default function AdminListingsPage() {
  const [items, setItems] = useState<AdminListing[]>([]);
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState({ total: 0, published: 0, draft: 0 });
  const [offset, setOffset] = useState(0);
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [q, setQ] = useState("");
  const [qDraft, setQDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getSupabaseAccessToken();
      const res = await adminListListings(token, {
        ...(status ? { status } : {}),
        ...(category ? { category } : {}),
        ...(q.trim() ? { q: q.trim() } : {}),
        limit,
        offset,
      });
      setItems(res.data);
      setTotal(res.meta.total);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load listings");
    } finally {
      setLoading(false);
    }
  }, [status, category, q, offset]);

  const loadCounts = useCallback(async () => {
    try {
      const token = await getSupabaseAccessToken();
      const [all, published, draft] = await Promise.all([
        adminListListings(token, { limit: 1 }),
        adminListListings(token, { status: "published", limit: 1 }),
        adminListListings(token, { status: "draft", limit: 1 }),
      ]);
      setCounts({
        total: all.meta.total,
        published: published.meta.total,
        draft: draft.meta.total,
      });
    } catch {
      // Counts are decorative; a failure here should not block the table.
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    loadCounts();
  }, [loadCounts]);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    setOffset(0);
    setQ(qDraft);
  }

  function clearFilters() {
    setQDraft("");
    setQ("");
    setStatus("");
    setCategory("");
    setOffset(0);
  }

  async function toggleFeatured(row: AdminListing) {
    setBusyId(row.id);
    setError(null);
    setNotice(null);
    try {
      const token = await getSupabaseAccessToken();
      const res = await adminUpdateListing(token, row.id, {
        featured: !row.featured,
      });
      setItems((prev) =>
        prev.map((item) => (item.id === row.id ? res.data : item)),
      );
      setNotice(
        res.data.featured
          ? `“${row.title}” is now featured.`
          : `“${row.title}” was removed from featured.`,
      );
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to update featured",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function toggleStatus(row: AdminListing) {
    const nextStatus = row.status === "published" ? "draft" : "published";
    setBusyId(row.id);
    setError(null);
    setNotice(null);
    try {
      const token = await getSupabaseAccessToken();
      const res = await adminUpdateListing(token, row.id, {
        status: nextStatus,
      });
      setItems((prev) =>
        prev.map((item) => (item.id === row.id ? res.data : item)),
      );
      setNotice(
        nextStatus === "published"
          ? `“${row.title}” is now published.`
          : `“${row.title}” moved to drafts.`,
      );
      await loadCounts();
      if (status) await load();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to update status",
      );
    } finally {
      setBusyId(null);
    }
  }

  const filtersActive = Boolean(q || status || category);
  const stats = [
    {
      label: "Total",
      value: counts.total,
      icon: FileText,
      tint: "bg-[#0B4650] text-white",
    },
    {
      label: "Published",
      value: counts.published,
      icon: Globe,
      tint: "bg-[#A3E4D7]/50 text-[#0B4650]",
    },
    {
      label: "Drafts",
      value: counts.draft,
      icon: Archive,
      tint: "bg-[#FFF3C9] text-[#B08D1A]",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#0B4650]/45">
            Content
          </p>
          <h1 className="font-display text-2xl font-bold text-[#0B4650]">
            Listings
          </h1>
          <p className="mt-1 max-w-xl text-sm text-[#0B4650]/65">
            Create, publish, and feature the opportunities shown on the site.
          </p>
        </div>
        <Link
          href="/admin/listings/new"
          className="inline-flex items-center gap-2 rounded-full bg-[#0B4650] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#062E35]"
        >
          <Plus className="h-4 w-4" aria-hidden />
          New listing
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map(({ label, value, icon: Icon, tint }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-[#0B4650]/8"
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${tint}`}
            >
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-[#0B4650]/55">
                {label}
              </p>
              <p className="font-display text-lg font-bold leading-tight text-[#0B4650]">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-[#0B4650]/8 md:p-5">
        <div className="flex flex-wrap items-center gap-3">
          <form
            onSubmit={onSearch}
            className="relative flex min-w-[220px] flex-1 items-center"
          >
            <Search
              className="pointer-events-none absolute left-4 h-4 w-4 text-[#0B4650]/40"
              aria-hidden
            />
            <input
              value={qDraft}
              onChange={(e) => setQDraft(e.target.value)}
              placeholder="Search title or organisation"
              aria-label="Search listings"
              className={`${inputClass} w-full rounded-full py-2.5 pl-11 pr-4`}
            />
          </form>

          <div
            role="group"
            aria-label="Filter by status"
            className="flex items-center gap-1 rounded-full bg-[#F9F8F6] p-1 ring-1 ring-[#0B4650]/10"
          >
            {statusFilters.map((f) => {
              const active = status === f.value;
              return (
                <button
                  key={f.label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setOffset(0);
                    setStatus(f.value);
                  }}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                    active
                      ? "bg-[#0B4650] text-white shadow-sm"
                      : "text-[#0B4650]/70 hover:bg-white hover:text-[#0B4650]"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <label className="sr-only" htmlFor="listing-category">
            Filter by category
          </label>
          <select
            id="listing-category"
            value={category}
            onChange={(e) => {
              setOffset(0);
              setCategory(e.target.value);
            }}
            className={`${inputClass} cursor-pointer rounded-full py-2.5`}
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          {filtersActive ? (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-[#0B4650]/60 transition-colors hover:bg-[#0B4650]/8 hover:text-[#0B4650]"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
              Clear
            </button>
          ) : null}
        </div>
      </div>

      {notice ? (
        <div
          role="status"
          className="flex items-center gap-2 rounded-2xl bg-[#A3E4D7]/35 px-4 py-3 text-sm font-semibold text-[#0B4650]"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0B8A6B]" aria-hidden />
          {notice}
        </div>
      ) : null}
      {error ? (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-2xl bg-[#FFE4C4]/70 px-4 py-3 text-sm font-semibold text-[#8C3F24]"
        >
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-[#0B4650]/8">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#0B4650]/8 bg-[#F9F8F6]/70 text-[11px] font-bold uppercase tracking-wider text-[#0B4650]/50">
                <th scope="col" className="px-5 py-3.5">Listing</th>
                <th scope="col" className="px-5 py-3.5">Category</th>
                <th scope="col" className="px-5 py-3.5">Status</th>
                <th scope="col" className="px-5 py-3.5">Engagement</th>
                <th scope="col" className="px-5 py-3.5">Featured</th>
                <th scope="col" className="px-5 py-3.5">Updated</th>
                <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr
                      key={`skeleton-${i}`}
                      className="border-b border-[#0B4650]/5"
                    >
                      <td colSpan={7} className="px-5 py-3">
                        <div className="h-10 animate-pulse rounded-xl bg-[#0B4650]/5" />
                      </td>
                    </tr>
                  ))
                : null}

              {!loading && items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center">
                    <FileText
                      className="mx-auto h-8 w-8 text-[#0B4650]/25"
                      aria-hidden
                    />
                    <p className="mt-3 text-sm font-semibold text-[#0B4650]/70">
                      {filtersActive
                        ? "No listings match these filters."
                        : "No listings yet."}
                    </p>
                    <p className="mt-1 text-xs text-[#0B4650]/50">
                      {filtersActive
                        ? "Try a different search or clear the filters."
                        : "Create the first listing to get started."}
                    </p>
                    {filtersActive ? (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-4 rounded-full bg-[#0B4650]/8 px-4 py-2 text-xs font-semibold text-[#0B4650] transition-colors hover:bg-[#0B4650]/12"
                      >
                        Clear filters
                      </button>
                    ) : (
                      <Link
                        href="/admin/listings/new"
                        className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#0B4650] px-4 py-2 text-xs font-semibold text-white"
                      >
                        <Plus className="h-3.5 w-3.5" aria-hidden />
                        New listing
                      </Link>
                    )}
                  </td>
                </tr>
              ) : null}

              {!loading
                ? items.map((row) => {
                    const busy = busyId === row.id;
                    const published = row.status === "published";
                    return (
                      <tr
                        key={row.id}
                        className="border-b border-[#0B4650]/5 transition-colors last:border-0 hover:bg-[#F9F8F6]/60"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <ListingThumb
                              src={row.image || null}
                              title={row.title}
                              seed={row.id}
                            />
                            <div className="min-w-0">
                              <p className="max-w-[260px] truncate font-semibold text-[#0B4650]">
                                {row.title}
                              </p>
                              <p className="max-w-[260px] truncate text-xs text-[#0B4650]/55">
                                {row.org}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${
                              categoryTint[row.category] ??
                              "bg-[#0B4650]/6 text-[#0B4650]/60"
                            }`}
                          >
                            {row.category}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                              published
                                ? "bg-[#A3E4D7]/45 text-[#0B8A6B]"
                                : "bg-[#FFF3C9] text-[#B08D1A]"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                published ? "bg-[#0B8A6B]" : "bg-[#B08D1A]"
                              }`}
                              aria-hidden
                            />
                            {published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-[#0B4650]/55">
                            <span
                              className="inline-flex items-center gap-1"
                              title={`${row.viewCount ?? 0} views`}
                              aria-label={`${row.viewCount ?? 0} views`}
                            >
                              <Eye className="h-3.5 w-3.5" aria-hidden />
                              {compact(row.viewCount ?? 0)}
                            </span>
                            <span
                              className="inline-flex items-center gap-1"
                              title={`${row.clickCount ?? 0} clicks`}
                              aria-label={`${row.clickCount ?? 0} clicks`}
                            >
                              <MousePointerClick
                                className="h-3.5 w-3.5"
                                aria-hidden
                              />
                              {compact(row.clickCount ?? 0)}
                            </span>
                            <span
                              className="inline-flex items-center gap-1"
                              title={`${row.saveCount ?? 0} saves`}
                              aria-label={`${row.saveCount ?? 0} saves`}
                            >
                              <Heart className="h-3.5 w-3.5" aria-hidden />
                              {compact(row.saveCount ?? 0)}
                            </span>
                            <span
                              className="inline-flex items-center gap-1"
                              title={`${row.applicationCount ?? 0} applications`}
                              aria-label={`${row.applicationCount ?? 0} applications`}
                            >
                              <FileText className="h-3.5 w-3.5" aria-hidden />
                              {compact(row.applicationCount ?? 0)}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => toggleFeatured(row)}
                            aria-pressed={row.featured}
                            aria-label={
                              row.featured
                                ? "Remove from featured"
                                : "Mark as featured"
                            }
                            title={
                              row.featured
                                ? "Remove from featured"
                                : "Mark as featured"
                            }
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold transition-colors disabled:opacity-50 ${
                              row.featured
                                ? "bg-[#F28F6B]/18 text-[#B4532A]"
                                : "bg-[#0B4650]/6 text-[#0B4650]/55 hover:bg-[#0B4650]/10 hover:text-[#0B4650]"
                            }`}
                          >
                            <Star
                              className={`h-3.5 w-3.5 ${
                                row.featured ? "fill-current" : ""
                              }`}
                              aria-hidden
                            />
                            {row.featured ? "Featured" : "Feature"}
                          </button>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-xs font-medium text-[#0B4650]/55">
                          {formatUpdated(row.updatedAt)}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => toggleStatus(row)}
                              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-[#0B4650]/70 transition-colors hover:bg-[#0B4650]/8 hover:text-[#0B4650] disabled:opacity-50"
                            >
                              {published ? (
                                <EyeOff className="h-3.5 w-3.5" aria-hidden />
                              ) : (
                                <CheckCircle2
                                  className="h-3.5 w-3.5"
                                  aria-hidden
                                />
                              )}
                              {published ? "Unpublish" : "Publish"}
                            </button>
                            <Link
                              href={`/admin/listings/${row.id}`}
                              className="inline-flex items-center gap-1.5 rounded-full bg-[#0B4650] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#062E35]"
                            >
                              <Pencil className="h-3.5 w-3.5" aria-hidden />
                              Edit
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </table>
        </div>
      </div>

      {total > limit ? (
        <div className="flex items-center justify-between gap-4 text-sm font-semibold text-[#0B4650]">
          <button
            type="button"
            disabled={offset === 0}
            onClick={() => setOffset((o) => Math.max(0, o - limit))}
            className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-[#0B4650]/10 transition-colors hover:bg-[#F9F8F6] disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-[#0B4650]/60">
            {offset + 1}–{Math.min(offset + limit, total)} of {total}
          </span>
          <button
            type="button"
            disabled={offset + limit >= total}
            onClick={() => setOffset((o) => o + limit)}
            className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-[#0B4650]/10 transition-colors hover:bg-[#F9F8F6] disabled:opacity-40"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
