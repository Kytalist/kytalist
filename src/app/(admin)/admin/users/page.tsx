"use client";

import { useCallback, useEffect, useState } from "react";
import {
  adminDeleteUser,
  adminListUsers,
  adminUpdateUser,
} from "@/lib/api/adminApi";
import type { AdminUser } from "@/lib/api/adminTypes";
import { ApiError } from "@/lib/api/client";
import { getSupabaseAccessToken } from "@/lib/supabase/client";

const limit = 25;

export default function AdminUsersPage() {
  const [rows, setRows] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [role, setRole] = useState("");
  const [q, setQ] = useState("");
  const [qDraft, setQDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getSupabaseAccessToken();
      const res = await adminListUsers(token, {
        ...(role ? { role } : {}),
        ...(q.trim() ? { q: q.trim() } : {}),
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
  }, [role, q, offset]);

  useEffect(() => {
    load();
  }, [load]);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    setOffset(0);
    setQ(qDraft);
  }

  async function saveRole(id: string, nextRole: "user" | "admin") {
    setBusyId(id);
    setError(null);
    try {
      const token = await getSupabaseAccessToken();
      await adminUpdateUser(token, id, { role: nextRole });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  async function removeUser(id: string, email: string) {
    if (
      !globalThis.confirm(
        `Permanently delete user ${email}? This cannot be undone.`,
      )
    ) {
      return;
    }
    setBusyId(id);
    setError(null);
    try {
      const token = await getSupabaseAccessToken();
      await adminDeleteUser(token, id);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#0B4650]">
          Users
        </h1>
        <p className="mt-1 text-sm text-[#0B4650]/65">
          Change roles or remove accounts. At least one admin should remain in
          the database.
        </p>
      </div>

      <div className="card-surface squircle flex flex-wrap items-end gap-4 p-4 md:p-5">
        <form onSubmit={onSearch} className="flex flex-1 flex-wrap gap-3">
          <input
            value={qDraft}
            onChange={(e) => setQDraft(e.target.value)}
            placeholder="Search email or name…"
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
          Role
          <select
            value={role}
            onChange={(e) => {
              setOffset(0);
              setRole(e.target.value);
            }}
            className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-3 py-2 text-sm font-semibold text-[#0B4650]"
          >
            <option value="">All</option>
            <option value="user">user</option>
            <option value="admin">admin</option>
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
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Verified</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[#0B4650]/5 font-medium text-[#0B4650]/90"
                >
                  <td className="px-4 py-3">{row.email}</td>
                  <td className="max-w-[160px] truncate px-4 py-3 text-xs">
                    {row.name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={row.role}
                      disabled={busyId === row.id}
                      onChange={(e) =>
                        saveRole(row.id, e.target.value as "user" | "admin")
                      }
                      className="rounded-lg border border-[#0B4650]/15 bg-white/80 px-2 py-1 text-xs font-semibold"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {row.emailVerified ? "yes" : "no"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      disabled={busyId === row.id}
                      onClick={() => removeUser(row.id, row.email)}
                      className="text-xs font-semibold text-[#B4532A] hover:underline disabled:opacity-50"
                    >
                      Delete
                    </button>
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
