"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Archive,
  CheckCircle2,
  Globe,
  MessageSquare,
  Pencil,
  Plus,
  Quote,
  Search,
  Trash2,
  X,
} from "lucide-react";
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

const inputClass =
  "rounded-xl border border-[#0B4650]/15 bg-white px-3.5 py-2.5 text-sm font-medium text-[#0B4650] outline-none transition-colors placeholder:text-[#0B4650]/35 focus:border-[#0B4650]/35 focus:ring-4 focus:ring-[#0B4650]/5";

const textareaClass =
  "min-h-[96px] resize-y rounded-xl border border-[#0B4650]/15 bg-white px-3.5 py-2.5 text-sm font-medium leading-relaxed text-[#0B4650] outline-none transition-colors placeholder:text-[#0B4650]/35 focus:border-[#0B4650]/35 focus:ring-4 focus:ring-[#0B4650]/5";

const filterOptions = [
  { value: "", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
];

const emptyForm = {
  name: "",
  role: "",
  quote: "",
  avatar: "",
  published: false,
};

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
    <div className="flex flex-wrap items-start gap-4 rounded-2xl bg-[#F9F8F6] p-4">
      <AvatarPreview src={value.trim() || null} name={name} size={56} />
      <div className="flex min-w-[220px] flex-1 flex-col gap-2.5">
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#0B4650]/70">
          Image link
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste an image URL (https://…)"
            className={inputClass}
          />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-xs font-semibold text-[#0B4650]/70">
            <span className="mb-1.5 block">Or upload</span>
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
              className="mt-4 text-xs font-semibold text-[#B4532A] hover:underline"
            >
              Remove image
            </button>
          ) : null}
          {uploading ? (
            <span className="mt-4 text-xs text-[#0B4650]/60">Uploading…</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
        checked ? "bg-[#0B8A6B]" : "bg-[#0B4650]/15"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}

function formatUpdated(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminTestimonialsPage() {
  const [rows, setRows] = useState<TestimonialAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const token = await getSupabaseAccessToken();
        const res = await adminListTestimonials(token);
        if (!cancelled) setRows(res.data);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof ApiError ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setBusyId("__new__");
    setError(null);
    setNotice(null);
    try {
      const token = await getSupabaseAccessToken();
      const res = await adminCreateTestimonial(token, {
        name: form.name.trim(),
        role: form.role.trim() || null,
        quote: form.quote.trim(),
        avatar: form.avatar.trim() || null,
        published: form.published,
      });
      setRows((prev) => [res.data, ...prev]);
      setNotice(`Added a testimonial from ${res.data.name}.`);
      setForm(emptyForm);
      setShowAdd(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Create failed");
    } finally {
      setBusyId(null);
    }
  }

  function startEdit(row: TestimonialAdmin) {
    setEditingId(row.id);
    setEditForm({
      name: row.name,
      role: row.role ?? "",
      quote: row.quote,
      avatar: row.avatar ?? "",
      published: row.published,
    });
    setError(null);
    setNotice(null);
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    const name = editForm.name.trim();
    const quote = editForm.quote.trim();
    if (!name || !quote) {
      setError("Name and quote are required.");
      return;
    }

    setBusyId(editingId);
    setError(null);
    setNotice(null);
    try {
      const token = await getSupabaseAccessToken();
      const res = await adminUpdateTestimonial(token, editingId, {
        name,
        role: editForm.role.trim() || null,
        quote,
        avatar: editForm.avatar.trim() || null,
        published: editForm.published,
      });
      setRows((prev) =>
        prev.map((row) => (row.id === editingId ? res.data : row)),
      );
      setNotice(`Updated ${name}.`);
      setEditingId(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  async function togglePublished(row: TestimonialAdmin) {
    setBusyId(row.id);
    setError(null);
    setNotice(null);
    try {
      const token = await getSupabaseAccessToken();
      const res = await adminUpdateTestimonial(token, row.id, {
        published: !row.published,
      });
      setRows((prev) =>
        prev.map((item) => (item.id === row.id ? res.data : item)),
      );
      setNotice(
        res.data.published
          ? `${row.name} is now published.`
          : `${row.name} moved to drafts.`,
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  async function removeRow(row: TestimonialAdmin) {
    if (
      !globalThis.confirm(
        `Delete the testimonial from ${row.name}? This cannot be undone.`,
      )
    ) {
      return;
    }
    setBusyId(row.id);
    setError(null);
    setNotice(null);
    try {
      const token = await getSupabaseAccessToken();
      await adminDeleteTestimonial(token, row.id);
      setRows((prev) => prev.filter((item) => item.id !== row.id));
      setNotice(`Deleted the testimonial from ${row.name}.`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  const total = rows.length;
  const publishedCount = rows.filter((row) => row.published).length;
  const draftCount = total - publishedCount;

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter((row) => {
      if (filter === "published" && !row.published) return false;
      if (filter === "draft" && row.published) return false;
      if (!term) return true;
      return `${row.name} ${row.role ?? ""} ${row.quote}`
        .toLowerCase()
        .includes(term);
    });
  }, [rows, filter, q]);

  const stats = [
    {
      label: "Total",
      value: total,
      icon: MessageSquare,
      tint: "bg-[#0B4650] text-white",
    },
    {
      label: "Published",
      value: publishedCount,
      icon: Globe,
      tint: "bg-[#A3E4D7]/50 text-[#0B4650]",
    },
    {
      label: "Drafts",
      value: draftCount,
      icon: Archive,
      tint: "bg-[#FFF3C9] text-[#B08D1A]",
    },
  ];

  const filtersActive = Boolean(q || filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#0B4650]/45">
            Content
          </p>
          <h1 className="font-display text-2xl font-bold text-[#0B4650]">
            Testimonials
          </h1>
          <p className="mt-1 max-w-xl text-sm text-[#0B4650]/65">
            Quotes shown on the public site. Publish or hide them at any time.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowAdd((v) => !v);
            setError(null);
          }}
          className="inline-flex items-center gap-2 rounded-full bg-[#0B4650] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#062E35]"
        >
          {showAdd ? (
            <X className="h-4 w-4" aria-hidden />
          ) : (
            <Plus className="h-4 w-4" aria-hidden />
          )}
          {showAdd ? "Close" : "Add testimonial"}
        </button>
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

      {showAdd ? (
        <form
          onSubmit={onCreate}
          className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-[#0B4650]/8 md:p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-base font-bold text-[#0B4650]">
              New testimonial
            </h2>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              aria-label="Close form"
              className="rounded-full p-1.5 text-[#0B4650]/50 transition-colors hover:bg-[#0B4650]/8 hover:text-[#0B4650]"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#0B4650]/70">
              Name
              <input
                required
                maxLength={200}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#0B4650]/70">
              Role or school{" "}
              <span className="font-medium text-[#0B4650]/45">(optional)</span>
              <input
                maxLength={200}
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#0B4650]/70 md:col-span-2">
              Quote
              <textarea
                required
                maxLength={2000}
                rows={4}
                value={form.quote}
                onChange={(e) => setForm({ ...form, quote: e.target.value })}
                className={textareaClass}
              />
            </label>
            <div className="md:col-span-2">
              <span className="mb-2 block text-xs font-semibold text-[#0B4650]/70">
                Avatar
              </span>
              <AvatarField
                value={form.avatar}
                name={form.name || "New"}
                onChange={(avatar) => setForm({ ...form, avatar })}
                onError={setError}
              />
            </div>
            <div className="flex items-center gap-3">
              <Toggle
                checked={form.published}
                onChange={() =>
                  setForm({ ...form, published: !form.published })
                }
                label="Publish this testimonial"
              />
              <span className="text-sm font-semibold text-[#0B4650]">
                Publish immediately
              </span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="rounded-full px-4 py-2.5 text-sm font-semibold text-[#0B4650]/70 transition-colors hover:bg-[#0B4650]/8 hover:text-[#0B4650]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busyId === "__new__"}
                className="rounded-full bg-[#0B4650] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#062E35] disabled:opacity-60"
              >
                {busyId === "__new__" ? "Saving…" : "Create testimonial"}
              </button>
            </div>
          </div>
        </form>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex min-w-[220px] flex-1 items-center">
          <Search
            className="pointer-events-none absolute left-4 h-4 w-4 text-[#0B4650]/40"
            aria-hidden
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, role, or quote"
            aria-label="Search testimonials"
            className={`${inputClass} w-full rounded-full py-2.5 pl-11 pr-4`}
          />
        </div>
        <div
          role="group"
          aria-label="Filter testimonials"
          className="flex items-center gap-1 rounded-full bg-white/80 p-1 ring-1 ring-[#0B4650]/10"
        >
          {filterOptions.map((option) => {
            const active = filter === option.value;
            return (
              <button
                key={option.label}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(option.value)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                  active
                    ? "bg-[#0B4650] text-white shadow-sm"
                    : "text-[#0B4650]/70 hover:bg-white hover:text-[#0B4650]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        {filtersActive ? (
          <button
            type="button"
            onClick={() => {
              setQ("");
              setFilter("");
            }}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-[#0B4650]/60 transition-colors hover:bg-[#0B4650]/8 hover:text-[#0B4650]"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
            Clear
          </button>
        ) : null}
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

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-3xl bg-[#0B4650]/5"
            />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-[#0B4650]/8">
          <MessageSquare
            className="mx-auto h-8 w-8 text-[#0B4650]/25"
            aria-hidden
          />
          <p className="mt-3 text-sm font-semibold text-[#0B4650]/70">
            No testimonials yet.
          </p>
          <p className="mt-1 text-xs text-[#0B4650]/50">
            Add a quote to show it on the public site.
          </p>
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#0B4650] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#062E35]"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Add testimonial
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl bg-white px-6 py-14 text-center shadow-sm ring-1 ring-[#0B4650]/8">
          <Search
            className="mx-auto h-8 w-8 text-[#0B4650]/25"
            aria-hidden
          />
          <p className="mt-3 text-sm font-semibold text-[#0B4650]/70">
            No testimonials match these filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setQ("");
              setFilter("");
            }}
            className="mt-4 rounded-full bg-[#0B4650]/8 px-4 py-2 text-xs font-semibold text-[#0B4650] transition-colors hover:bg-[#0B4650]/12"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((row) => {
            const busy = busyId === row.id;

            if (editingId === row.id) {
              return (
                <article
                  key={row.id}
                  className="rounded-3xl bg-white p-5 shadow-sm ring-2 ring-[#0B4650]/15 md:col-span-2 xl:col-span-3"
                >
                  <form onSubmit={saveEdit} className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center justify-between gap-3 md:col-span-2">
                      <h2 className="font-display text-base font-bold text-[#0B4650]">
                        Edit testimonial
                      </h2>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        aria-label="Cancel editing"
                        className="rounded-full p-1.5 text-[#0B4650]/50 transition-colors hover:bg-[#0B4650]/8 hover:text-[#0B4650]"
                      >
                        <X className="h-4 w-4" aria-hidden />
                      </button>
                    </div>

                    <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#0B4650]/70">
                      Name
                      <input
                        required
                        maxLength={200}
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className={inputClass}
                      />
                    </label>
                    <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#0B4650]/70">
                      Role or school
                      <input
                        maxLength={200}
                        value={editForm.role}
                        onChange={(e) =>
                          setEditForm({ ...editForm, role: e.target.value })
                        }
                        className={inputClass}
                      />
                    </label>
                    <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#0B4650]/70 md:col-span-2">
                      Quote
                      <textarea
                        required
                        maxLength={2000}
                        rows={4}
                        value={editForm.quote}
                        onChange={(e) =>
                          setEditForm({ ...editForm, quote: e.target.value })
                        }
                        className={textareaClass}
                      />
                    </label>
                    <div className="md:col-span-2">
                      <span className="mb-2 block text-xs font-semibold text-[#0B4650]/70">
                        Avatar
                      </span>
                      <AvatarField
                        value={editForm.avatar}
                        name={editForm.name || row.name}
                        onChange={(avatar) =>
                          setEditForm({ ...editForm, avatar })
                        }
                        onError={setError}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Toggle
                        checked={editForm.published}
                        onChange={() =>
                          setEditForm({
                            ...editForm,
                            published: !editForm.published,
                          })
                        }
                        label="Publish this testimonial"
                      />
                      <span className="text-sm font-semibold text-[#0B4650]">
                        Published
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="rounded-full px-4 py-2.5 text-sm font-semibold text-[#0B4650]/70 transition-colors hover:bg-[#0B4650]/8 hover:text-[#0B4650]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={busy}
                        className="rounded-full bg-[#0B4650] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#062E35] disabled:opacity-60"
                      >
                        {busy ? "Saving…" : "Save changes"}
                      </button>
                    </div>
                  </form>
                </article>
              );
            }

            return (
              <article
                key={row.id}
                className="flex flex-col rounded-3xl bg-white p-5 shadow-sm ring-1 ring-[#0B4650]/8 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <AvatarPreview
                    src={row.avatar}
                    name={row.name}
                    seed={row.id}
                    size={44}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm font-bold text-[#0B4650]">
                      {row.name}
                    </p>
                    <p className="truncate text-xs text-[#0B4650]/55">
                      {row.role || "No role"}
                    </p>
                  </div>
                  <Toggle
                    checked={row.published}
                    disabled={busy}
                    onChange={() => togglePublished(row)}
                    label={
                      row.published
                        ? `Unpublish ${row.name}`
                        : `Publish ${row.name}`
                    }
                  />
                </div>

                <Quote
                  className="mt-4 h-4 w-4 text-[#0B4650]/20"
                  aria-hidden
                />
                <p
                  className="mt-2 line-clamp-4 flex-1 text-sm leading-relaxed text-[#0B4650]/75"
                  title={row.quote}
                >
                  {row.quote}
                </p>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#0B4650]/8 pt-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      row.published
                        ? "bg-[#A3E4D7]/45 text-[#0B8A6B]"
                        : "bg-[#FFF3C9] text-[#B08D1A]"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        row.published ? "bg-[#0B8A6B]" : "bg-[#B08D1A]"
                      }`}
                      aria-hidden
                    />
                    {row.published ? "Published" : "Draft"}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => startEdit(row)}
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold text-[#0B4650]/70 transition-colors hover:bg-[#0B4650]/8 hover:text-[#0B4650] disabled:opacity-50"
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden />
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => removeRow(row)}
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold text-[#B4532A] transition-colors hover:bg-[#F28F6B]/15 disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                      Delete
                    </button>
                  </div>
                </div>

                <p className="mt-2 text-[10px] font-medium text-[#0B4650]/40">
                  Updated {formatUpdated(row.updatedAt)}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
