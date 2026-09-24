"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ListingPreview } from "@/components/admin/ListingPreview";
import { Switch } from "@/components/admin/Switch";
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
import type {
  CostOption,
  ExtracurricularType,
  Listing,
} from "@/lib/api/types";
import { getSupabaseBrowser } from "@/lib/supabase/client";

const REGIONS = ["Bangladesh", "International"] as const;

const TYPES_BY_CATEGORY = {
  academic: [
    "Olympiad",
    "Quiz",
    "LocalFairs",
    "Research",
    "WritingCompetition",
    "Debate",
  ],
  professional: ["Internship", "Mentorship"],
  competition: ["TechContest", "Hackathon", "Startup", "FilmArt"],
  opportunity: ["ExchangeProgram", "Conference", "MUN"],
} as const satisfies Record<
  "academic" | "professional" | "competition" | "opportunity",
  readonly ExtracurricularType[]
>;

const COSTS = ["Free", "Paid", "Stipend"] as const;
const GRADES = [
  "Primary",
  "High School",
  "College",
  "O Level",
  "A Level",
  "Undergraduate",
  "Postgraduate",
  "Professional",
] as const;

const DEFAULT_DESCRIPTION_TEMPLATE = `## About this opportunity

Describe the program, who it's for, and what students will gain.

## Eligibility

- Grade level:
- Region / format:

## How to apply

1. 
2. 

## Key dates

- Application deadline:
`;

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
  const [region, setRegion] = useState<string>("Bangladesh");
  const [description, setDescription] = useState(
    isNew ? DEFAULT_DESCRIPTION_TEMPLATE : "",
  );
  const [descriptionEnabled, setDescriptionEnabled] = useState(isNew);
  const [image, setImage] = useState("/images/placeholder.svg");
  const [bannerImage, setBannerImage] = useState("");
  const [bannerEnabled, setBannerEnabled] = useState(false);
  const [eventUrl, setEventUrl] = useState("");
  const [category, setCategory] = useState<
    "academic" | "professional" | "competition" | "opportunity"
  >("academic");
  const [deadline, setDeadline] = useState("");
  const [deadlineAtLocal, setDeadlineAtLocal] = useState("");
  const [types, setTypes] = useState<string[]>([]);
  const [cost, setCost] = useState<string>("");
  const [grades, setGrades] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<"draft" | "published">("draft");

  const previewItem = useMemo<Listing>(() => {
    return {
      id: id || "preview",
      title: title.trim() || "Untitled listing",
      org: org.trim() || "Organization name",
      location: location.trim() || "Location",
      region,
      description:
        description.trim() ||
        "Add a description to see how it reads in the catalog.",
      descriptionEnabled,
      image: image.trim() || "/images/placeholder.svg",
      bannerImage: bannerImage.trim() || undefined,
      bannerEnabled,
      eventUrl: eventUrl.trim() || undefined,
      category,
      deadline: deadline.trim() || undefined,
      types: types as ExtracurricularType[],
      cost: (cost || undefined) as CostOption | undefined,
      grades,
      featured,
    };
  }, [
    id,
    title,
    org,
    location,
    region,
    description,
    descriptionEnabled,
    image,
    bannerImage,
    bannerEnabled,
    eventUrl,
    category,
    deadline,
    types,
    cost,
    grades,
    featured,
  ]);

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
        setDescriptionEnabled(L.descriptionEnabled ?? false);
        setImage(L.image);
        setBannerImage(L.bannerImage ?? "");
        setBannerEnabled(L.bannerEnabled ?? false);
        setEventUrl(L.eventUrl ?? "");
        setCategory(L.category);
        setDeadline(L.deadline ?? "");
        setDeadlineAtLocal(toDatetimeLocalValue(L.deadlineAt));
        setTypes(L.types ?? []);
        setCost(L.cost ?? "");
        setGrades(L.grades ?? []);
        setFeatured(Boolean(L.featured));
        setStatus(L.status);
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

  useEffect(() => {
    setTypes((prev) => {
      const allowed = TYPES_BY_CATEGORY[category] as readonly string[];
      const next = prev.filter((t) => allowed.includes(t));
      return next.length === prev.length ? prev : next;
    });
  }, [category]);

  function toggleGrade(g: string) {
    setGrades((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g],
    );
  }

  function toggleType(t: string) {
    setTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  }

  const typeOptions = TYPES_BY_CATEGORY[category];

  function buildPayload(): Record<string, unknown> {
    const deadlineAtIso = fromDatetimeLocalValue(deadlineAtLocal);
    return {
      title,
      org,
      location,
      region,
      description,
      descriptionEnabled,
      image,
      bannerImage: bannerImage.trim() || null,
      bannerEnabled,
      eventUrl: eventUrl.trim() || null,
      category,
      deadline: deadline.trim() || null,
      deadlineAt: deadlineAtIso,
      types,
      cost: cost || null,
      grades,
      featured,
      status,
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

  async function onPickBannerImage(file: File | null) {
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
      setBannerImage(data.publicUrl);
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
    <form onSubmit={onSave} className="mx-auto max-w-6xl space-y-8">
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

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start">
        <div className="order-2 space-y-8 lg:order-1">
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
                </select>
              </label>
            </div>
            <label className="flex items-start gap-3 rounded-2xl border border-[#0B4650]/10 bg-white/55 p-4 text-sm font-semibold text-[#0B4650]">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-[#0B4650]/20 text-[#0B4650]"
              />
              <span>
                <span className="block">Featured event</span>
                <span className="mt-0.5 block text-xs font-medium leading-relaxed text-[#0B4650]/60">
                  Show this listing in the homepage featured event slideshow.
                </span>
              </span>
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#0B4650]">
              Event link
              <input
                type="url"
                value={eventUrl}
                onChange={(e) => setEventUrl(e.target.value)}
                placeholder="https://example.com/event"
                className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#0B4650]/30"
              />
            </label>
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
                  onChange={(e) =>
                    setCategory(e.target.value as typeof category)
                  }
                  className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#0B4650]/30"
                >
                  <option value="academic">academic</option>
                  <option value="professional">professional</option>
                  <option value="competition">competition</option>
                  <option value="opportunity">opportunity</option>
                </select>
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
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#0B4650]/50">
                Image
              </h2>
              <p className="text-xs font-medium leading-relaxed text-[#0B4650]/55">
                Main image used on listing cards and the event page.
                Recommended 1600×1000 (16:10).
              </p>
            </div>
            <div className="flex flex-wrap items-start gap-8">
              <div className="relative aspect-[16/10] w-56 overflow-hidden rounded-2xl border border-[#0B4650]/10 bg-[#0B4650]/5">
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="224px"
                  unoptimized={image.startsWith("http")}
                />
              </div>
              <div className="flex flex-col gap-5">
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
                  <span className="text-xs text-[#0B4650]/60">
                    Uploading…
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="card-surface squircle space-y-6 p-6 md:p-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0B4650]/50">
              Filters (activities)
            </h2>
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
            <div>
              <span className="mb-2 block text-sm font-semibold text-[#0B4650]">
                Types
              </span>
              <div className="flex flex-wrap gap-2">
                {typeOptions.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleType(t)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                      types.includes(t)
                        ? "bg-[#0B4650] text-white"
                        : "bg-white/70 text-[#0B4650]/70 hover:bg-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs font-medium text-[#0B4650]/50">
                Select all that apply.
              </p>
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
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="card-surface squircle space-y-6 p-6 md:p-8">
            <div className="space-y-4 rounded-2xl border border-[#0B4650]/10 bg-white/55 p-4">
              <Switch
                checked={bannerEnabled}
                onChange={setBannerEnabled}
                label="Enable banner image (16:9)"
                description="Shown above the description on the event page. Recommended 1920×1080."
              />
              <div className="flex flex-wrap items-start gap-4">
                <div className="relative aspect-video w-44 shrink-0 overflow-hidden rounded-xl border border-[#0B4650]/10 bg-[#0B4650]/5">
                  {bannerImage ? (
                    <Image
                      src={bannerImage}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="176px"
                      unoptimized={bannerImage.startsWith("http")}
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-[11px] font-semibold text-[#0B4650]/40">
                      16:9
                    </span>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#0B4650]">
                    Banner image URL
                    <input
                      value={bannerImage}
                      onChange={(e) => setBannerImage(e.target.value)}
                      placeholder="https://example.com/banner.jpg"
                      className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#0B4650]/30"
                    />
                  </label>
                  <label className="text-sm font-semibold text-[#0B4650]">
                    <span className="mb-1.5 block">Upload banner</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
                      disabled={uploading}
                      onChange={(e) =>
                        onPickBannerImage(e.target.files?.[0] ?? null)
                      }
                      className="text-xs font-medium file:mr-3 file:rounded-full file:border-0 file:bg-[#0B4650] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white"
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-md">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#0B4650]/50">
                  Description
                </h2>
                <p className="mt-1.5 text-xs font-medium leading-relaxed text-[#0B4650]/55">
                  Write the event details in Markdown. When enabled, this
                  content is shown on a dedicated event page.
                </p>
              </div>
              <Switch
                checked={descriptionEnabled}
                onChange={setDescriptionEnabled}
                label="Enable description page"
                description={
                  descriptionEnabled
                    ? "Card shows “View details” and opens the event page."
                    : "Card shows “Visit event” and opens the event link."
                }
              />
            </div>
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#0B4650]">
              Markdown
              <textarea
                required
                rows={16}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                spellCheck={false}
                className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-4 py-3 font-mono text-sm leading-relaxed outline-none focus:border-[#0B4650]/30"
              />
            </label>
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
        </div>

        <aside className="order-1 lg:order-2 lg:sticky lg:top-6 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto">
          <ListingPreview
            item={previewItem}
            status={status}
            featured={featured}
          />
        </aside>
      </div>
    </form>
  );
}
