"use client";

import Image from "next/image";
import { Fragment, useCallback, useEffect, useState } from "react";
import {
  adminCreateTestimonial,
  adminDeleteTestimonial,
  adminListTestimonials,
  adminRequestTestimonialAvatarUpload,
  adminUpdateTestimonial,
  uploadToSignedUrl,
} from "@/lib/api/adminApi";
import type { TestimonialAdmin } from "@/lib/api/adminTypes";
import { ApiError } from "@/lib/api/client";
import { getSupabaseAccessToken } from "@/lib/supabase/client";
import { deriveInitials, deriveTestimonialStyle } from "@/lib/visual";

const AVATAR_ACCEPT =
  "image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif";

async function uploadAvatar(file: File): Promise<string> {
  const token = await getSupabaseAccessToken();
  const contentType = file.type || "image/jpeg";
  const { data } = await adminRequestTestimonialAvatarUpload(
    token,
    file.name,
    contentType,
  );
  await uploadToSignedUrl(data.uploadUrl, data.token, file, contentType);
  return data.publicUrl;
}

function AvatarPreview({
  src,
  name,
  seed,
  size = 48,
}: {
  src: string | null;
  name: string;
  seed?: string;
  size?: number;
}) {
  if (src) {
    return (
      <span
        className="relative shrink-0 overflow-hidden rounded-full border border-[#0B4650]/10 bg-[#0B4650]/5"
        style={{ width: size, height: size }}
      >
        <Image
          src={src}
          alt=""
          fill
          sizes={`${size}px`}
          className="object-cover"
          unoptimized={src.startsWith("http")}
        />
      </span>
    );
  }

  const initials = deriveInitials(name || "?", 2);
  const style = deriveTestimonialStyle(seed ?? name);
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full ${style.tint} font-display text-xs font-bold ${style.accent}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

function AvatarField({
  value,
  name,
  onChange,
  onError,
}: {
  value: string;
  name: string;
  onChange: (value: string) => void;
  onError: (message: string | null) => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function onPick(file: File | null) {
    if (!file) return;
    setUploading(true);
    onError(null);
    try {
      const url = await uploadAvatar(file);
      onChange(url);
    } catch (err) {
      onError(err instanceof ApiError ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-start gap-4">
      <AvatarPreview src={value.trim() || null} name={name} size={64} />
      <div className="flex min-w-[240px] flex-1 flex-col gap-2">
        <label className="flex flex-col gap-1 text-sm font-semibold text-[#0B4650]">
          Image link
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste an image URL (https://…)"
            className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-3 py-2 text-sm font-medium outline-none focus:border-[#0B4650]/30"
          />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-semibold text-[#0B4650]">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-[#0B4650]/50">
              Or upload
            </span>
            <input
              type="file"
              accept={AVATAR_ACCEPT}
              disabled={uploading}
              onChange={(e) => onPick(e.target.files?.[0] ?? null)}
              className="text-xs font-medium file:mr-3 file:rounded-full file:border-0 file:bg-[#0B4650] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white disabled:opacity-50"
            />
          </label>
          {value ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-xs font-semibold text-[#B4532A] hover:underline"
            >
              Remove image
            </button>
          ) : null}
          {uploading ? (
            <span className="text-xs text-[#0B4650]/60">Uploading…</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

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

  const [editingAvatarId, setEditingAvatarId] = useState<string | null>(null);
  const [avatarDraft, setAvatarDraft] = useState("");

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
      await adminCreateTestimonial(token, {
        name: newName.trim(),
        role: newRole.trim() || null,
        quote: newQuote.trim(),
        avatar: newAvatar.trim() || null,
        published: newPublished,
      });
      setNewName("");
      setNewRole("");
      setNewQuote("");
      setNewAvatar("");
      setNewPublished(false);
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

  function openAvatarEditor(row: TestimonialAdmin) {
    setEditingAvatarId((current) => (current === row.id ? null : row.id));
    setAvatarDraft(row.avatar ?? "");
  }

  async function saveAvatar(id: string) {
    await patchRow(id, { avatar: avatarDraft.trim() || null });
    setEditingAvatarId(null);
    setAvatarDraft("");
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
            Published items appear on the public site.
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
          <div className="md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-[#0B4650]">
              Avatar
            </span>
            <AvatarField
              value={newAvatar}
              name={newName || "New"}
              onChange={setNewAvatar}
              onError={setError}
            />
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold text-[#0B4650]">
            <input
              type="checkbox"
              checked={newPublished}
              onChange={(e) => setNewPublished(e.target.checked)}
            />
            Published
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
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#0B4650]/10 text-xs font-bold uppercase tracking-wider text-[#0B4650]/50">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Avatar</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3">Quote</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <Fragment key={row.id}>
                  <tr className="border-b border-[#0B4650]/5 align-top font-medium text-[#0B4650]/90">
                    <td className="px-4 py-3">
                      <div className="font-semibold">{row.name}</div>
                      {row.role ? (
                        <div className="text-xs text-[#0B4650]/60">
                          {row.role}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <AvatarPreview
                          src={row.avatar}
                          name={row.name}
                          seed={row.id}
                          size={40}
                        />
                        <button
                          type="button"
                          disabled={busyId === row.id}
                          onClick={() => openAvatarEditor(row)}
                          className="text-xs font-semibold text-[#0B4650] hover:underline disabled:opacity-50"
                        >
                          {editingAvatarId === row.id ? "Cancel" : "Change"}
                        </button>
                      </div>
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
                  {editingAvatarId === row.id ? (
                    <tr className="border-b border-[#0B4650]/5 bg-[#0B4650]/[0.02]">
                      <td colSpan={5} className="px-4 py-4">
                        <AvatarField
                          value={avatarDraft}
                          name={row.name}
                          onChange={setAvatarDraft}
                          onError={setError}
                        />
                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            disabled={busyId === row.id}
                            onClick={() => saveAvatar(row.id)}
                            className="rounded-full bg-[#F28F6B] px-4 py-2 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
                          >
                            {busyId === row.id ? "Saving…" : "Save avatar"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingAvatarId(null);
                              setAvatarDraft("");
                            }}
                            className="rounded-full border border-[#0B4650]/15 px-4 py-2 text-xs font-semibold text-[#0B4650]"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
