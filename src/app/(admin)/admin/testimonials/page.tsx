"use client";

import { useCallback, useEffect, useState } from "react";
import {
  adminCreateTestimonial,
  adminDeleteTestimonial,
  adminListTestimonials,
  adminUpdateTestimonial,
} from "@/lib/api/adminApi";
import type { TestimonialAdmin } from "@/lib/api/adminTypes";
import { ApiError } from "@/lib/api/client";
import { getSupabaseAccessToken } from "@/lib/supabase/client";

export default function AdminTestimonialsPage() {
  const [rows, setRows] = useState<TestimonialAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newQuote, setNewQuote] = useState("");
  const [newAvatar, setNewAvatar] = useState("");
  const [newPublished, setNewPublished] = useState(false);
  const [newOrder, setNewOrder] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getSupabaseAccessToken();
      const res = await adminListTestimonials(token);
      setRows(res.data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setBusyId("__new__");
    setError(null);
    try {
      const token = await getSupabaseAccessToken();
      const order = newOrder.trim() === "" ? null : Number(newOrder);
      await adminCreateTestimonial(token, {
        name: newName.trim(),
        role: newRole.trim() || null,
        quote: newQuote.trim(),
        avatar: newAvatar.trim() || null,
        published: newPublished,
        order: Number.isFinite(order as number) ? order : null,
      });
      setNewName("");
      setNewRole("");
      setNewQuote("");
      setNewAvatar("");
      setNewPublished(false);
      setNewOrder("");
      setShowAdd(false);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Create failed");
    } finally {
      setBusyId(null);
    }
  }

  async function patchRow(id: string, body: Record<string, unknown>) {
    setBusyId(id);
    setError(null);
    try {
      const token = await getSupabaseAccessToken();
      await adminUpdateTestimonial(token, id, body);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  async function removeRow(id: string) {
    if (!globalThis.confirm("Delete this testimonial?")) return;
    setBusyId(id);
    setError(null);
    try {
      const token = await getSupabaseAccessToken();
      await adminDeleteTestimonial(token, id);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0B4650]">
            Testimonials
          </h1>
          <p className="mt-1 text-sm text-[#0B4650]/65">
            Published items can appear on the public site (when wired to the
            API).
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd((v) => !v)}
          className="rounded-full bg-[#0B4650] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#062E35]"
        >
          {showAdd ? "Close form" : "Add testimonial"}
        </button>
      </div>

      {error ? (
        <p className="text-sm font-medium text-[#B4532A]" role="alert">
          {error}
        </p>
      ) : null}

      {showAdd ? (
        <form
          onSubmit={onCreate}
          className="card-surface squircle grid gap-4 p-6 md:grid-cols-2"
        >
          <label className="flex flex-col gap-1 text-sm font-semibold text-[#0B4650] md:col-span-2">
            Name
            <input
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-3 py-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold text-[#0B4650]">
            Role / school
            <input
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-3 py-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold text-[#0B4650]">
            Avatar URL
            <input
              value={newAvatar}
              onChange={(e) => setNewAvatar(e.target.value)}
              placeholder="https://…"
              className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-3 py-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold text-[#0B4650] md:col-span-2">
            Quote
            <textarea
              required
              rows={3}
              value={newQuote}
              onChange={(e) => setNewQuote(e.target.value)}
              className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-3 py-2 text-sm"
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-[#0B4650]">
            <input
              type="checkbox"
              checked={newPublished}
              onChange={(e) => setNewPublished(e.target.checked)}
            />
            Published
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold text-[#0B4650]">
            Sort order (optional)
            <input
              value={newOrder}
              onChange={(e) => setNewOrder(e.target.value)}
              inputMode="numeric"
              className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-3 py-2 text-sm"
            />
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={busyId === "__new__"}
              className="rounded-full bg-[#F28F6B] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              {busyId === "__new__" ? "Saving…" : "Create"}
            </button>
          </div>
        </form>
      ) : null}

      {loading ? (
        <p className="text-sm text-[#0B4650]/70">Loading…</p>
      ) : (
        <div className="card-surface squircle overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#0B4650]/10 text-xs font-bold uppercase tracking-wider text-[#0B4650]/50">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Quote</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[#0B4650]/5 align-top font-medium text-[#0B4650]/90"
                >
                  <td className="px-4 py-3">
                    <div className="font-semibold">{row.name}</div>
                    {row.role ? (
                      <div className="text-xs text-[#0B4650]/60">{row.role}</div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={row.published}
                      disabled={busyId === row.id}
                      onChange={(e) =>
                        patchRow(row.id, { published: e.target.checked })
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      defaultValue={row.order ?? ""}
                      key={`${row.id}-${row.order}`}
                      className="w-16 rounded border border-[#0B4650]/15 bg-white/80 px-2 py-1 text-xs"
                      onBlur={(e) => {
                        const v = e.target.value.trim();
                        const n = v === "" ? null : Number(v);
                        if (v !== "" && !Number.isFinite(n)) return;
                        if ((row.order ?? null) !== (n ?? null)) {
                          patchRow(row.id, { order: n });
                        }
                      }}
                    />
                  </td>
                  <td className="max-w-xs px-4 py-3">
                    <p className="line-clamp-3 text-xs leading-relaxed">
                      {row.quote}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <button
                      type="button"
                      disabled={busyId === row.id}
                      onClick={() => removeRow(row.id)}
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
    </div>
  );
}
