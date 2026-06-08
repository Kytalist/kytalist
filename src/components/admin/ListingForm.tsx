"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  adminCreateListing,
  adminDeleteListing,
  adminGetListing,
  adminPublishListing,
  adminRequestListingImageUpload,
  adminUnpublishListing,
  adminUpdateListing,
  uploadToSignedUrl,
} from "@/lib/api/adminApi";
import type { AdminListing } from "@/lib/api/adminTypes";
import { ApiError } from "@/lib/api/client";
import { getSupabaseBrowser } from "@/lib/supabase/client";

const REGIONS = [
  "Northeast",
  "Southeast",
  "Midwest",
  "Southwest",
  "Pacific",
  "Mountain",
  "Nationwide",
] as const;

const TYPES = [
  "Competition",
  "Research",
  "Program",
  "Club",
  "Volunteer",
  "Leadership",
  "Arts",
  "STEM",
] as const;

const COSTS = ["Free", "Paid", "Stipend"] as const;
const GRADES = [9, 10, 11, 12] as const;

function toDatetimeLocalValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

function fromDatetimeLocalValue(local: string): string | null {
  if (!local.trim()) return null;
  const d = new Date(local);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

type Props = {
  listingId?: string;
};

export function ListingForm({ listingId }: Props) {
  const router = useRouter();
  const isNew = !listingId;
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [id, setId] = useState(() =>
    isNew ? (globalThis.crypto?.randomUUID?.() ?? `id-${Date.now()}`) : "",
  );
  const [title, setTitle] = useState("");
  const [org, setOrg] = useState("");
  const [location, setLocation] = useState("");
  const [region, setRegion] = useState<string>("Nationwide");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("/images/placeholder.svg");
  const [category, setCategory] = useState<"activity" | "camp" | "internship">(
    "activity",
  );
  const [badge, setBadge] = useState("");
  const [footer, setFooter] = useState("");
  const [deadline, setDeadline] = useState("");
  const [deadlineAtLocal, setDeadlineAtLocal] = useState("");
  const [type, setType] = useState<string>("");
  const [cost, setCost] = useState<string>("");
  const [grades, setGrades] = useState<number[]>([]);
  const [tagsInput, setTagsInput] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "archived">(
    "draft",
  );
  const [featuredOrder, setFeaturedOrder] = useState<string>("");
  const [trendingOrder, setTrendingOrder] = useState<string>("");

  const getToken = useCallback(async () => {
    const {
      data: { session },
    } = await getSupabaseBrowser().auth.getSession();
    return session?.access_token ?? null;
  }, []);

  useEffect(() => {
    if (isNew || !listingId) return;
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        const res = await adminGetListing(token, listingId);
        const L = res.data;
        if (cancelled) return;
        setId(L.id);
        setTitle(L.title);
        setOrg(L.org);
        setLocation(L.location);
        setRegion(L.region);
        setDescription(L.description);
        setImage(L.image);
        setCategory(L.category);
        setBadge(L.badge);
        setFooter(L.footer);
        setDeadline(L.deadline ?? "");
        setDeadlineAtLocal(toDatetimeLocalValue(L.deadlineAt));
        setType(L.type ?? "");
        setCost(L.cost ?? "");
        setGrades(L.grades ?? []);
        setTagsInput((L.tags ?? []).join(", "));
        setStatus(L.status);
        setFeaturedOrder(
          L.featuredOrder != null ? String(L.featuredOrder) : "",
        );
        setTrendingOrder(
          L.trendingOrder != null ? String(L.trendingOrder) : "",
        );
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
  }, [isNew, listingId, getToken]);

  function toggleGrade(g: number) {
    setGrades((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g].sort(),
    );
  }

  function buildPayload(): Record<string, unknown> {
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const fo = featuredOrder.trim();
    const to = trendingOrder.trim();
    const deadlineAtIso = fromDatetimeLocalValue(deadlineAtLocal);
    return {
      title,
      org,
      location,
      region,
      description,
      image,
      category,
      badge: badge || "",
      footer: footer || "",
      deadline: deadline.trim() || null,
      deadlineAt: deadlineAtIso,
      type: type || null,
      cost: cost || null,
      grades,
      tags,
      status,
      featuredOrder: fo === "" ? null : Number(fo),
      trendingOrder: to === "" ? null : Number(to),
    };
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const token = await getToken();
      const payload = buildPayload();
      if (isNew) {
        await adminCreateListing(token, { id, ...payload });
      } else {
        await adminUpdateListing(token, id, payload);
      }
      router.push("/admin/listings");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!listingId || !confirm("Delete this listing permanently?")) return;
    setSaving(true);
    setError(null);
    try {
      const token = await getToken();
      await adminDeleteListing(token, id);
      router.push("/admin/listings");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Delete failed");
    } finally {
      setSaving(false);
    }
  }

  async function onPublish() {
    setSaving(true);
    setError(null);
    try {
      const token = await getToken();
      await adminPublishListing(token, id);
      const res = await adminGetListing(token, id);
      setStatus(res.data.status);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Publish failed");
    } finally {
      setSaving(false);
    }
  }

  async function onUnpublish() {
    setSaving(true);
    setError(null);
    try {
      const token = await getToken();
      await adminUnpublishListing(token, id);
      const res = await adminGetListing(token, id);
      setStatus(res.data.status);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unpublish failed");
    } finally {
      setSaving(false);
    }
  }

  async function onPickImage(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const token = await getToken();
      const contentType = file.type || "image/jpeg";
      const { data } = await adminRequestListingImageUpload(
        token,
        file.name,
        contentType,
      );
      await uploadToSignedUrl(data.uploadUrl, data.token, file, contentType);
      setImage(data.publicUrl);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <p className="text-sm font-medium text-[#0B4650]/70">Loading listing…</p>
    );
  }

  return (
    <form onSubmit={onSave} className="mx-auto max-w-3xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-[#0B4650]">
          {isNew ? "New listing" : "Edit listing"}
        </h1>
        <Link
          href="/admin/listings"
          className="text-sm font-semibold text-[#0B4650]/70 hover:text-[#0B4650]"
        >
          Back to list
        </Link>
      </div>

      {error ? (
        <div
          className="rounded-2xl border border-[#B4532A]/30 bg-[#FFE4C4]/40 px-4 py-3 text-sm font-medium text-[#B4532A]"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      <div className="card-surface squircle space-y-6 p-6 md:p-8">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#0B4650]/50">
          Identity
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#0B4650]">
            ID
            <input
              value={id}
              onChange={(e) => isNew && setId(e.target.value)}
              readOnly={!isNew}
              className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#0B4650]/30"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#0B4650]">
            Status
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as AdminListing["status"])
              }
              className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#0B4650]/30"
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
          </label>
        </div>
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#0B4650]">
          <span>
            Title <span className="text-[#B4532A]">*</span>
          </span>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#0B4650]/30"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#0B4650]">
            <span>
              Organization <span className="text-[#B4532A]">*</span>
            </span>
            <input
              required
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#0B4650]/30"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#0B4650]">
            <span>
              Location <span className="text-[#B4532A]">*</span>
            </span>
            <input
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#0B4650]/30"
            />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#0B4650]">
            Region
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#0B4650]/30"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#0B4650]">
            Category
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof category)}
              className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#0B4650]/30"
            >
              <option value="activity">activity</option>
              <option value="camp">camp</option>
              <option value="internship">internship</option>
            </select>
          </label>
        </div>
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#0B4650]">
          <span>
            Description <span className="text-[#B4532A]">*</span>
          </span>
          <textarea
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#0B4650]/30"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#0B4650]">
            Badge
            <input
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#0B4650]/30"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#0B4650]">
            Footer
            <input
              value={footer}
              onChange={(e) => setFooter(e.target.value)}
              className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#0B4650]/30"
            />
          </label>
        </div>
      </div>

      <div className="card-surface squircle space-y-6 p-6 md:p-8">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#0B4650]/50">
          Deadlines
        </h2>
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#0B4650]">
          Display deadline (e.g. &quot;Applications due Feb 28&quot;)
          <input
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            placeholder="Optional display text"
            className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#0B4650]/30"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#0B4650]">
          Sortable deadline (for &quot;deadline soonest&quot; on the site)
          <input
            type="datetime-local"
            value={deadlineAtLocal}
            onChange={(e) => setDeadlineAtLocal(e.target.value)}
            className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#0B4650]/30"
          />
        </label>
      </div>

      <div className="card-surface squircle space-y-6 p-6 md:p-8">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#0B4650]/50">
          Image
        </h2>
        <div className="flex flex-wrap items-start gap-6">
          <div className="relative h-36 w-48 overflow-hidden rounded-2xl border border-[#0B4650]/10 bg-[#0B4650]/5">
            <Image
              src={image}
              alt=""
              fill
              className="object-cover"
              sizes="192px"
              unoptimized={image.startsWith("http")}
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#0B4650]">
              <span>
                Image URL <span className="text-[#B4532A]">*</span>
              </span>
              <input
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="min-w-[240px] rounded-xl border border-[#0B4650]/15 bg-white/80 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#0B4650]/30"
              />
            </label>
            <label className="text-sm font-semibold text-[#0B4650]">
              <span className="mb-1.5 block">Upload file</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
                disabled={uploading}
                onChange={(e) => onPickImage(e.target.files?.[0] ?? null)}
                className="text-xs font-medium file:mr-3 file:rounded-full file:border-0 file:bg-[#0B4650] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white"
              />
            </label>
            {uploading ? (
              <span className="text-xs text-[#0B4650]/60">Uploading…</span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="card-surface squircle space-y-6 p-6 md:p-8">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#0B4650]/50">
          Filters (activities)
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#0B4650]">
            Type
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#0B4650]/30"
            >
              <option value="">—</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#0B4650]">
            Cost
            <select
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#0B4650]/30"
            >
              <option value="">—</option>
              {COSTS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <span className="mb-2 block text-sm font-semibold text-[#0B4650]">
            Grades
          </span>
          <div className="flex flex-wrap gap-2">
            {GRADES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => toggleGrade(g)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  grades.includes(g)
                    ? "bg-[#0B4650] text-white"
                    : "bg-white/70 text-[#0B4650]/70 hover:bg-white"
                }`}
              >
                {g}th
              </button>
            ))}
          </div>
        </div>
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#0B4650]">
          Tags (comma-separated)
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Robotics, STEM"
            className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#0B4650]/30"
          />
        </label>
      </div>

      <div className="card-surface squircle space-y-6 p-6 md:p-8">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#0B4650]/50">
          Homepage order
        </h2>
        <p className="text-xs text-[#0B4650]/60">
          Lower numbers appear first. Leave empty to remove from carousel slots.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#0B4650]">
            Featured order
            <input
              inputMode="numeric"
              value={featuredOrder}
              onChange={(e) => setFeaturedOrder(e.target.value)}
              placeholder="e.g. 1"
              className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#0B4650]/30"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#0B4650]">
            Trending order
            <input
              inputMode="numeric"
              value={trendingOrder}
              onChange={(e) => setTrendingOrder(e.target.value)}
              placeholder="e.g. 1"
              className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#0B4650]/30"
            />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-[#0B4650] px-6 py-3 text-sm font-semibold text-white hover:bg-[#062E35] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {!isNew ? (
          <>
            <button
              type="button"
              disabled={saving}
              onClick={onPublish}
              className="rounded-full border border-[#0B4650]/20 bg-white/80 px-5 py-2.5 text-sm font-semibold text-[#0B4650] hover:bg-white disabled:opacity-60"
            >
              Publish
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={onUnpublish}
              className="rounded-full border border-[#0B4650]/20 bg-white/80 px-5 py-2.5 text-sm font-semibold text-[#0B4650] hover:bg-white disabled:opacity-60"
            >
              Unpublish (draft)
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={onDelete}
              className="rounded-full border border-[#B4532A]/40 bg-[#FFE4C4]/50 px-5 py-2.5 text-sm font-semibold text-[#B4532A] hover:bg-[#FFE4C4] disabled:opacity-60"
            >
              Delete
            </button>
          </>
        ) : null}
      </div>
    </form>
  );
}
