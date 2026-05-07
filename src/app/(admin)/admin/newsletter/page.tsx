"use client";

import { useCallback, useEffect, useState } from "react";
import {
  adminBroadcastNewsletter,
  adminListSubscribers,
} from "@/lib/api/adminApi";
import type { SubscriberRow } from "@/lib/api/adminTypes";
import { ApiError } from "@/lib/api/client";
import { getSupabaseAccessToken } from "@/lib/supabase/client";

const limit = 50;

export default function AdminNewsletterPage() {
  const [rows, setRows] = useState<SubscriberRow[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [broadcastMsg, setBroadcastMsg] = useState<string | null>(null);
  const [broadcasting, setBroadcasting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getSupabaseAccessToken();
      const res = await adminListSubscribers(token, {
        ...(status ? { status } : {}),
        limit,
        offset,
      });
      setRows(res.data);
      setTotal(res.meta.total);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [status, offset]);

  useEffect(() => {
    load();
  }, [load]);

  async function onBroadcast(e: React.FormEvent) {
    e.preventDefault();
    setBroadcasting(true);
    setBroadcastMsg(null);
    setError(null);
    try {
      const token = await getSupabaseAccessToken();
      await adminBroadcastNewsletter(token, subject.trim(), html);
      setBroadcastMsg(
        "Broadcast queued (HTTP 202). Delivery runs asynchronously on the API.",
      );
      setSubject("");
      setHtml("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Broadcast failed");
    } finally {
      setBroadcasting(false);
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#0B4650]">
          Newsletter
        </h1>
        <p className="mt-1 text-sm text-[#0B4650]/65">
          Subscribers and broadcast (queued on the server).
        </p>
      </div>

      {error ? (
        <p className="text-sm font-medium text-[#B4532A]" role="alert">
          {error}
        </p>
      ) : null}

      <section className="card-surface squircle p-6 md:p-8">
        <h2 className="font-display text-lg font-bold text-[#0B4650]">
          Broadcast
        </h2>
        <p className="mt-2 text-sm text-[#0B4650]/65">
          The API responds with <strong>202 Accepted</strong> and processes the
          send in the background. Double-check recipients and content before
          sending.
        </p>
        <form onSubmit={onBroadcast} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-semibold text-[#0B4650]">
            Subject
            <input
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-3 py-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold text-[#0B4650]">
            HTML body
            <textarea
              required
              rows={8}
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-3 py-2 font-mono text-xs"
            />
          </label>
          {broadcastMsg ? (
            <p className="text-sm font-medium text-[#0B4650]" role="status">
              {broadcastMsg}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={broadcasting}
            className="w-fit rounded-full bg-[#F28F6B] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {broadcasting ? "Sending…" : "Queue broadcast"}
          </button>
        </form>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-lg font-bold text-[#0B4650]">
            Subscribers
          </h2>
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
              <option value="pending">pending</option>
              <option value="confirmed">confirmed</option>
              <option value="unsubscribed">unsubscribed</option>
            </select>
          </label>
        </div>

        {loading ? (
          <p className="text-sm text-[#0B4650]/70">Loading…</p>
        ) : (
          <div className="card-surface squircle overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#0B4650]/10 text-xs font-bold uppercase tracking-wider text-[#0B4650]/50">
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Confirmed</th>
                  <th className="px-4 py-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-[#0B4650]/5 font-medium text-[#0B4650]/90"
                  >
                    <td className="px-4 py-3">{row.email}</td>
                    <td className="px-4 py-3">{row.status}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-[#0B4650]/65">
                      {row.confirmedAt
                        ? new Date(row.confirmedAt).toLocaleString()
                        : "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-[#0B4650]/65">
                      {new Date(row.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {total > limit ? (
          <div className="mt-4 flex items-center justify-between gap-4 text-sm font-semibold text-[#0B4650]">
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
      </section>
    </div>
  );
}
