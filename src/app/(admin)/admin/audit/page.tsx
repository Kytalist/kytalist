"use client";

import { useCallback, useEffect, useState } from "react";
import { adminListAuditLogs } from "@/lib/api/adminApi";
import type { AuditLogRow } from "@/lib/api/adminTypes";
import { ApiError } from "@/lib/api/client";
import { getSupabaseAccessToken } from "@/lib/supabase/client";

const limit = 50;

function toIsoOrEmpty(local: string): string | undefined {
  const t = local.trim();
  if (!t) return undefined;
  const d = new Date(t);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

export default function AdminAuditPage() {
  const [rows, setRows] = useState<AuditLogRow[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [entityType, setEntityType] = useState("");
  const [entityId, setEntityId] = useState("");
  const [actorId, setActorId] = useState("");
  const [fromLocal, setFromLocal] = useState("");
  const [toLocal, setToLocal] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getSupabaseAccessToken();
      const from = toIsoOrEmpty(fromLocal);
      const to = toIsoOrEmpty(toLocal);
      const res = await adminListAuditLogs(token, {
        ...(entityType.trim() ? { entityType: entityType.trim() } : {}),
        ...(entityId.trim() ? { entityId: entityId.trim() } : {}),
        ...(actorId.trim() ? { actorId: actorId.trim() } : {}),
        ...(from ? { from } : {}),
        ...(to ? { to } : {}),
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
  }, [entityType, entityId, actorId, fromLocal, toLocal, offset]);

  useEffect(() => {
    load();
  }, [load]);

  function onFilterSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOffset(0);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#0B4650]">
          Audit log
        </h1>
        <p className="mt-1 text-sm text-[#0B4650]/65">
          Read-only history of admin actions (API must expose rows).
        </p>
      </div>

      <form
        onSubmit={onFilterSubmit}
        className="card-surface squircle grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3"
      >
        <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wider text-[#0B4650]/50">
          Entity type
          <input
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            placeholder="e.g. listing"
            className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-3 py-2 text-sm font-medium text-[#0B4650]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wider text-[#0B4650]/50">
          Entity id
          <input
            value={entityId}
            onChange={(e) => setEntityId(e.target.value)}
            className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-3 py-2 text-sm font-medium text-[#0B4650]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wider text-[#0B4650]/50">
          Actor id
          <input
            value={actorId}
            onChange={(e) => setActorId(e.target.value)}
            className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-3 py-2 text-sm font-medium text-[#0B4650]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wider text-[#0B4650]/50">
          From (local)
          <input
            type="datetime-local"
            value={fromLocal}
            onChange={(e) => setFromLocal(e.target.value)}
            className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-3 py-2 text-sm font-medium text-[#0B4650]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wider text-[#0B4650]/50">
          To (local)
          <input
            type="datetime-local"
            value={toLocal}
            onChange={(e) => setToLocal(e.target.value)}
            className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-3 py-2 text-sm font-medium text-[#0B4650]"
          />
        </label>
        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="rounded-full bg-[#0B4650] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#062E35]"
          >
            Apply filters
          </button>
          <button
            type="button"
            onClick={() => {
              setEntityType("");
              setEntityId("");
              setActorId("");
              setFromLocal("");
              setToLocal("");
              setOffset(0);
            }}
            className="rounded-full border border-[#0B4650]/15 px-4 py-2.5 text-sm font-semibold text-[#0B4650]"
          >
            Clear
          </button>
        </div>
      </form>

      {error ? (
        <p className="text-sm font-medium text-[#B4532A]" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-[#0B4650]/70">Loading…</p>
      ) : (
        <div className="card-surface squircle overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#0B4650]/10 text-xs font-bold uppercase tracking-wider text-[#0B4650]/50">
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Entity</th>
                <th className="px-4 py-3">Actor</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[#0B4650]/5 align-top font-medium text-[#0B4650]/90"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-[#0B4650]/65">
                    {new Date(row.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-xs">{row.action}</td>
                  <td className="px-4 py-3 text-xs">
                    <span className="font-semibold">{row.entityType}</span>
                    <br />
                    <code className="text-[10px] text-[#0B4650]/70">
                      {row.entityId}
                    </code>
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-xs">
                    {row.actorId ?? "—"}
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
