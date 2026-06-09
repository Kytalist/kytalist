"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { adminListListings } from "@/lib/api/adminApi";
import type { AdminListing } from "@/lib/api/adminTypes";
import { ApiError } from "@/lib/api/client";
import { getSupabaseAccessToken } from "@/lib/supabase/client";

export default function AdminListingsPage() {
  const [items, setItems] = useState<AdminListing[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const limit = 25;
  const [status, setStatus] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [q, setQ] = useState("");
  const [qDraft, setQDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setError(e instanceof ApiError ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [status, category, q, offset]);

  useEffect(() => {
    load();
  }, [load]);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    setOffset(0);
    setQ(qDraft);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0B4650]">
            Listings
          </h1>
          <p className="mt-1 text-sm text-[#0B4650]/65">
            {total} total · draft and published
          </p>
        </div>
        <Link
          href="/admin/listings/new"
          className="rounded-full bg-[#0B4650] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#062E35]"
        >
          New listing
        </Link>
      </div>

      <div className="card-surface squircle flex flex-wrap items-end gap-4 p-4 md:p-5">
        <form onSubmit={onSearch} className="flex flex-1 flex-wrap gap-3">
          <input
            value={qDraft}
            onChange={(e) => setQDraft(e.target.value)}
            placeholder="Search title, org, keywords…"
            className="min-w-[200px] flex-1 rounded-full border border-[#0B4650]/15 bg-white/80 px-4 py-2.5 text-sm outline-none focus:border-[#0B4650]/30"
          />
          <button
            type="submit"
            className="rounded-full bg-[#0B4650]/10 px-5 py-2.5 text-sm font-semibold text-[#0B4650] hover:bg-[#0B4650]/15"
          >
            Search
          </button>
        </form>
        <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wider text-[#0B4650]/50">
          Status
          <select
            value={status}
            onChange={(e) => {
              setOffset(0);
              setStatus(e.target.value);
            }}
            className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-3 py-2 text-sm font-semibold text-[#0B4650]"
          >
            <option value="">All</option>
            <option value="draft">draft</option>
            <option value="published">published</option>
            <option value="archived">archived</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wider text-[#0B4650]/50">
          Category
          <select
            value={category}
            onChange={(e) => {
              setOffset(0);
              setCategory(e.target.value);
            }}
            className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-3 py-2 text-sm font-semibold text-[#0B4650]"
          >
            <option value="">All</option>
            <option value="academic">academic</option>
            <option value="professional">professional</option>
            <option value="competition">competition</option>
            <option value="opportunity">opportunity</option>
          </select>
        </label>
      </div>

      {error ? (
        <p className="text-sm font-medium text-[#B4532A]" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-[#0B4650]/70">Loading…</p>
      ) : (
        <div className="card-surface squircle overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#0B4650]/10 text-xs font-bold uppercase tracking-wider text-[#0B4650]/50">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[#0B4650]/5 font-medium text-[#0B4650]/90"
                >
                  <td className="max-w-[220px] truncate px-4 py-3">
                    {row.title}
                  </td>
                  <td className="px-4 py-3">{row.category}</td>
                  <td className="px-4 py-3">{row.status}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-[#0B4650]/65">
                    {new Date(row.updatedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/listings/${row.id}`}
                      className="font-semibold text-[#F28F6B] hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {total > limit ? (
        <div className="flex items-center justify-between gap-4 text-sm font-semibold text-[#0B4650]">
          <button
            type="button"
            disabled={offset === 0}
            onClick={() => setOffset((o) => Math.max(0, o - limit))}
            className="rounded-full border border-[#0B4650]/15 px-4 py-2 disabled:opacity-40"
          >
            Previous
          </button>
          <span>
            {offset + 1}–{Math.min(offset + limit, total)} of {total}
          </span>
          <button
            type="button"
            disabled={offset + limit >= total}
            onClick={() => setOffset((o) => o + limit)}
            className="rounded-full border border-[#0B4650]/15 px-4 py-2 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
