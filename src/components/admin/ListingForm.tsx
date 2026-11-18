"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ListingPreview } from "@/components/admin/ListingPreview";
import { Markdown } from "@/components/Markdown";
import { Switch } from "@/components/admin/Switch";
import {
  adminCreateListing,
  adminDeleteListing,
  adminFormatListingDescription,
  adminGetAiQuota,
  adminGetListing,
  adminPublishListing,
  adminRequestListingImageUpload,
  adminUnpublishListing,
  adminUpdateListing,
  uploadToSignedUrl,
} from "@/lib/api/adminApi";
import type {
  AdminListing,
  AiQuotaResult,
  FormatDescriptionRequest,
  FormatDescriptionResult,
} from "@/lib/api/adminTypes";
import { ApiError } from "@/lib/api/client";
import { typesByCategory } from "@/lib/data";
import type {
  CostOption,
  ExtracurricularType,
  Listing,
} from "@/lib/api/types";
import { getSupabaseAccessToken } from "@/lib/supabase/client";

const REGIONS = ["Bangladesh", "International"] as const;

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

/** "2026-11-14T00:00:00.000Z" -> "2026-11-14" for <input type="date">. */
function toDateInputValue(iso: string | null | undefined): string {
  return iso ? iso.slice(0, 10) : "";
}

/** Date-only inputs are stored at UTC midnight so every viewer sees one day. */
function fromDateInputValue(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? `${trimmed}T00:00:00.000Z` : null;
}

type DayTitleOption = { key: string; label: string };

/**
 * Expands the event's date inputs into one entry per day. Returns [] when the
 * dates are missing or invalid.
 */
function listDateInputDays(start: string, end: string): DayTitleOption[] {
  const startKey = start.trim().slice(0, 10);
  if (!startKey) return [];
  const endKey = (end.trim() || startKey).slice(0, 10);
  const toUtc = (value: string) => {
    const [year, month, day] = value.split("-").map(Number);
    if (!year || !month || !day) return Number.NaN;
    return Date.UTC(year, month - 1, day);
  };
  const startTime = toUtc(startKey);
  const endTime = toUtc(endKey);
  if (!Number.isFinite(startTime) || !Number.isFinite(endTime)) return [];
  if (endTime < startTime) return [];
  const totalDays = Math.round((endTime - startTime) / 86_400_000) + 1;
  return Array.from({ length: totalDays }, (_, index) => {
    const date = new Date(startTime + index * 86_400_000);
    const key = date.toISOString().slice(0, 10);
    return {
      key,
      label: date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      }),
    };
  });
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
  const [failedImageSrc, setFailedImageSrc] = useState<string | null>(null);

  const [id, setId] = useState(() =>
    isNew ? (globalThis.crypto?.randomUUID?.() ?? `id-${Date.now()}`) : "",
  );
  const [title, setTitle] = useState("");
  const [org, setOrg] = useState("");
  const [orgLogo, setOrgLogo] = useState("");
  const [location, setLocation] = useState("");
  const [region, setRegion] = useState<string>("Bangladesh");
  const [description, setDescription] = useState(
    isNew ? DEFAULT_DESCRIPTION_TEMPLATE : "",
  );
  const [descriptionEnabled, setDescriptionEnabled] = useState(isNew);
  const [showPreview, setShowPreview] = useState(false);
  const [formatting, setFormatting] = useState(false);
  const [formatError, setFormatError] = useState<string | null>(null);
  const [quota, setQuota] = useState<AiQuotaResult | null>(null);
  const [statusWord, setStatusWord] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [image, setImage] = useState("/images/placeholder.svg");
  const [bannerImage, setBannerImage] = useState("");
  const [bannerEnabled, setBannerEnabled] = useState(false);
  const [eventUrl, setEventUrl] = useState("");
  const [category, setCategory] = useState<
    "academic" | "professional" | "competition" | "opportunity"
  >("academic");
  const [deadline, setDeadline] = useState("");
  const [deadlineAtLocal, setDeadlineAtLocal] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");
  const [eventProgressEnabled, setEventProgressEnabled] = useState(true);
  const [eventCheckpointDates, setEventCheckpointDates] = useState<string[]>([]);
  const [eventCheckpointHiddenDates, setEventCheckpointHiddenDates] =
    useState<string[]>([]);
  const [eventCheckpointsCustomized, setEventCheckpointsCustomized] =
    useState(false);
  const [checkpointDraft, setCheckpointDraft] = useState("");
  const [eventDayTitles, setEventDayTitles] = useState<Record<string, string>>(
    {},
  );
  const [types, setTypes] = useState<string[]>([]);
  const [cost, setCost] = useState<string>("");
  const [grades, setGrades] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [international, setInternational] = useState(false);
  const [status, setStatus] = useState<"draft" | "published">("draft");

  const previewItem = useMemo<Listing>(() => {
    return {
      id: id || "preview",
      title: title.trim() || "Untitled listing",
      org: org.trim() || "Organization name",
      orgLogo: orgLogo.trim() || undefined,
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
      eventStartAt: fromDateInputValue(eventStart) ?? undefined,
      eventEndAt: fromDateInputValue(eventEnd) ?? undefined,
      eventProgressEnabled,
      types: types as ExtracurricularType[],
      cost: (cost || undefined) as CostOption | undefined,
      grades,
      featured,
      international,
    };
  }, [
    id,
    title,
    org,
    orgLogo,
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
    eventStart,
    eventEnd,
    eventProgressEnabled,
    types,
    cost,
    grades,
    featured,
    international,
  ]);

  const eventDays = useMemo(
    () => listDateInputDays(eventStart, eventEnd),
    [eventStart, eventEnd],
  );
  const shortEvent = eventDays.length > 0 && eventDays.length <= 5;
  const autoMode = shortEvent && !eventCheckpointsCustomized;
  const visibleCheckpointDays = autoMode
    ? eventDays
    : eventDays.filter((day) => eventCheckpointDates.includes(day.key));
  const canAddCheckpoint =
    checkpointDraft !== "" &&
    eventDays.some((day) => day.key === checkpointDraft) &&
    !eventCheckpointDates.includes(checkpointDraft);

  function toggleCheckpointVisibility(key: string) {
    setEventCheckpointHiddenDates((prev) =>
      prev.includes(key)
        ? prev.filter((existing) => existing !== key)
        : [...prev, key],
    );
  }

  function addCheckpoint() {
    if (!canAddCheckpoint) return;
    setEventCheckpointsCustomized(true);
    setEventCheckpointDates((prev) => [...prev, checkpointDraft].sort());
    setCheckpointDraft("");
  }

  function deleteCheckpoint(key: string) {
    if (autoMode) {
      setEventCheckpointsCustomized(true);
      setEventCheckpointDates(
        eventDays
          .filter((day) => day.key !== key)
          .map((day) => day.key),
      );
    } else {
      setEventCheckpointDates((prev) =>
        prev.filter((existing) => existing !== key),
      );
    }
    setEventCheckpointHiddenDates((prev) =>
      prev.filter((existing) => existing !== key),
    );
  }

  function resetCheckpoints() {
    setEventCheckpointsCustomized(false);
    setEventCheckpointDates([]);
    setEventCheckpointHiddenDates([]);
  }

  const getToken = useCallback(() => getSupabaseAccessToken(), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        const res = await adminGetAiQuota(token);
        if (!cancelled) setQuota(res.data);
      } catch {
        /* quota optional */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken]);

  useEffect(() => {
    if (!formatting) {
      setStatusWord("");
      return;
    }
    const words = ["Thinking…", "Finding…", "Researching…", "Drafting…", "Polishing…"];
    let i = 0;
    setStatusWord(words[0]);
    const id = window.setInterval(() => {
      i = (i + 1) % words.length;
      setStatusWord(words[i]);
    }, 900);
    return () => window.clearInterval(id);
  }, [formatting]);

  function insertMarkdown(before: string, after = "") {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart ?? description.length;
    const end = el.selectionEnd ?? description.length;
    const selected = description.slice(start, end);
    const next = description.slice(0, start) + before + selected + after + description.slice(end);
    setDescription(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + before.length + selected.length + (selected ? 0 : 0);
      el.setSelectionRange(pos, pos);
    });
  }

  async function onFormatWithAi() {
    if (formatting) return;
    setFormatting(true);
    setFormatError(null);
    try {
      const token0 = await getToken();
      try {
        const q0 = await adminGetAiQuota(token0);
        setQuota(q0.data);
      } catch {
        /* ignore */
      }
      const token = token0;
      const payload: FormatDescriptionRequest = {
        title: title.trim() || undefined,
        org: org.trim() || undefined,
        location: location.trim() || undefined,
        region,
        category,
        deadline: deadline.trim() || undefined,
        deadlineAt: fromDatetimeLocalValue(deadlineAtLocal) ?? undefined,
        eventUrl: eventUrl.trim() || undefined,
        types,
        cost: cost ? (cost as CostOption) : undefined,
        grades,
        currentDescription: description.trim() ? description : undefined,
        sourceText: description.trim() ? undefined : undefined,
      };
      const res = await adminFormatListingDescription(token, payload);
      const text = res.data.markdown;
      // type into editor
      setDescription("");
      let i = 0;
      const step = Math.max(1, Math.ceil(text.length / 60));
      await new Promise<void>((resolve) => {
        const id = window.setInterval(() => {
          i = Math.min(text.length, i + step);
          setDescription(text.slice(0, i));
          if (i >= text.length) {
            window.clearInterval(id);
            resolve();
          }
        }, 16);
      });
      try {
        const q = await adminGetAiQuota(token);
        setQuota(q.data);
      } catch {
        /* ignore */
      }
    } catch (err) {
      setFormatError(err instanceof ApiError ? err.message : "Could not format description.");
    } finally {
      setFormatting(false);
    }
  }

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
        setOrgLogo(L.orgLogo ?? "");
        setLocation(L.location);
        setRegion(L.region);
        setDescription(L.description ?? "");
        setDescriptionEnabled(L.descriptionEnabled ?? false);
        setImage(L.image);
        setBannerImage(L.bannerImage ?? "");
        setBannerEnabled(L.bannerEnabled ?? false);
        setEventUrl(L.eventUrl ?? "");
        setCategory(L.category);
        setDeadline(L.deadline ?? "");
        setDeadlineAtLocal(toDatetimeLocalValue(L.deadlineAt));
        setEventStart(toDateInputValue(L.eventStartAt));
        setEventEnd(toDateInputValue(L.eventEndAt));
        setEventProgressEnabled(L.eventProgressEnabled ?? true);
        setEventCheckpointDates(L.eventCheckpointDates ?? []);
        setEventCheckpointHiddenDates(L.eventCheckpointHiddenDates ?? []);
        setEventCheckpointsCustomized(
          Boolean(L.eventCheckpointsCustomized),
        );
        setEventDayTitles(L.eventDayTitles ?? {});
        setTypes(L.types ?? []);
        setCost(L.cost ?? "");
        setGrades(L.grades ?? []);
        setFeatured(Boolean(L.featured));
        setInternational(Boolean(L.international));
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
      const allowed = typesByCategory[category] as readonly string[];
      const next = prev.filter((t) => allowed.includes(t));
      return next.length === prev.length ? prev : next;
    });
  }, [category]);

  const imagePreviewFailed = failedImageSrc === image;

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

  const typeOptions = typesByCategory[category];

  function buildPayload(): Record<string, unknown> {
    const deadlineAtIso = fromDatetimeLocalValue(deadlineAtLocal);
    const validKeys = new Set(eventDays.map((day) => day.key));
    const uniqueDates = (values: string[]) =>
      [...new Set(values)].sort();
    let checkpoints: string[];
    let hidden: string[];
    let customized: boolean;
    let titleKeys: string[];
    if (eventDays.length === 0) {
      // No editable range (e.g. >60 days): preserve stored selections.
      checkpoints = uniqueDates(eventCheckpointDates);
      hidden = uniqueDates(eventCheckpointHiddenDates);
      customized = eventCheckpointsCustomized;
      titleKeys = Object.keys(eventDayTitles);
    } else if (autoMode) {
      // Short events checkpoint every day automatically.
      checkpoints = [];
      hidden = uniqueDates(eventCheckpointHiddenDates).filter((key) =>
        validKeys.has(key),
      );
      customized = false;
      titleKeys = eventDays.map((day) => day.key);
    } else {
      checkpoints = uniqueDates(eventCheckpointDates).filter((key) =>
        validKeys.has(key),
      );
      hidden = uniqueDates(eventCheckpointHiddenDates).filter((key) =>
        checkpoints.includes(key),
      );
      customized = true;
      titleKeys = checkpoints;
    }
    const dayTitles: Record<string, string> = {};
    for (const key of titleKeys) {
      const title = eventDayTitles[key]?.trim();
      if (title) dayTitles[key] = title;
    }
    return {
      title,
      org,
      orgLogo: orgLogo.trim() || null,
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
      eventStartAt: fromDateInputValue(eventStart),
      eventEndAt: fromDateInputValue(eventEnd),
      eventProgressEnabled,
      eventCheckpointDates: checkpoints,
      eventCheckpointHiddenDates: hidden,
      eventCheckpointsCustomized: customized,
      eventDayTitles: dayTitles,
      deadlineAt: deadlineAtIso,
      types,
      cost: cost || null,
      grades,
      featured,
      international,
      status,
    };
  }

  /** Persists the current form state. Shared by Save, Publish and Unpublish. */
  async function persistForm(token: string | null): Promise<void> {
    const payload = buildPayload();
    if (isNew) {
      await adminCreateListing(token, { id, ...payload });
    } else {
      await adminUpdateListing(token, id, payload);
    }
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const token = await getToken();
      await persistForm(token);
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
      // Save first so edits (including checkpoints) are not lost.
      await persistForm(token);
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
      await persistForm(token);
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

  async function onPickOrgLogo(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const token = await getToken();
      const contentType = file.type || "image/png";
      const { data } = await adminRequestListingImageUpload(
        token,
        file.name,
        contentType,
      );
      await uploadToSignedUrl(data.uploadUrl, data.token, file, contentType);
      setOrgLogo(data.publicUrl);
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
                  maxLength={200}
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
            <label className="flex items-start gap-3 rounded-2xl border border-[#0B4650]/10 bg-white/55 p-4 text-sm font-semibold text-[#0B4650]">
              <input
                type="checkbox"
                checked={international}
                onChange={(e) => setInternational(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-[#0B4650]/20 text-[#0B4650]"
              />
              <span>
                <span className="block">International Event</span>
                <span className="mt-0.5 block text-xs font-medium leading-relaxed text-[#0B4650]/60">
                  Tag and prioritize this listing as an international event.
                </span>
              </span>
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#0B4650]">
              Event link
              <input
                type="url"
                value={eventUrl}
                maxLength={1000}
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
                maxLength={500}
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
                  maxLength={500}
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
                  maxLength={500}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#0B4650]/30"
                />
              </label>
            </div>
            <div className="flex flex-wrap items-start gap-4 rounded-2xl border border-[#0B4650]/10 bg-white/55 p-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#0B4650]/10 bg-white">
                {orgLogo ? (
                  <Image
                    src={orgLogo}
                    alt=""
                    width={56}
                    height={56}
                    className="h-full w-full object-contain"
                    sizes="56px"
                  />
                ) : (
                  <span className="px-1 text-center text-[10px] font-semibold leading-tight text-[#0B4650]/40">
                    No logo
                  </span>
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#0B4650]">
                  Organizer logo URL
                  <input
                    value={orgLogo}
                    maxLength={1000}
                    onChange={(e) => setOrgLogo(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#0B4650]/30"
                  />
                </label>
                <div className="flex flex-wrap items-end gap-3">
                  <label className="text-sm font-semibold text-[#0B4650]">
                    <span className="mb-1.5 block">Upload logo</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
                      disabled={uploading}
                      onChange={(e) =>
                        onPickOrgLogo(e.target.files?.[0] ?? null)
                      }
                      className="text-xs font-medium file:mr-3 file:rounded-full file:border-0 file:bg-[#0B4650] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white"
                    />
                  </label>
                  {orgLogo ? (
                    <button
                      type="button"
                      onClick={() => setOrgLogo("")}
                      className="rounded-full border border-[#0B4650]/20 bg-white/80 px-4 py-2 text-xs font-semibold text-[#0B4650] hover:bg-white"
                    >
                      Remove logo
                    </button>
                  ) : null}
                </div>
                <p className="text-xs font-medium leading-relaxed text-[#0B4650]/55">
                  Square images work best. Shown next to the organizer name on
                  event cards.
                </p>
              </div>
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
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#0B4650]/50">
                Dates &amp; deadlines
              </h2>
              <p className="text-xs font-medium leading-relaxed text-[#0B4650]/55">
                When the display deadline is empty, the card shows the event
                dates automatically. Set an end date for multi-day events and
                the card shows a range (e.g. &ldquo;14–15 Nov 2026&rdquo;).
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#0B4650]">
                Event start date
                <input
                  type="date"
                  value={eventStart}
                  onChange={(e) => setEventStart(e.target.value)}
                  className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#0B4650]/30"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#0B4650]">
                Event end date (optional)
                <input
                  type="date"
                  min={eventStart || undefined}
                  value={eventEnd}
                  onChange={(e) => setEventEnd(e.target.value)}
                  className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#0B4650]/30"
                />
              </label>
            </div>
            <div className="space-y-4 border-t border-[#0B4650]/10 pt-4">
              <Switch
                checked={eventProgressEnabled}
                onChange={setEventProgressEnabled}
                label="Show event progress"
                description="Events of 5 days or fewer show every day automatically. Longer events use the checkpoints you add."
              />
              {eventProgressEnabled && eventDays.length > 1 ? (
                <div className="space-y-3 rounded-2xl bg-[#0B4650]/[0.03] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-[#0B4650]">
                        Checkpoints
                      </p>
                      <p className="mt-0.5 text-xs font-medium leading-relaxed text-[#0B4650]/55">
                        {eventDays.length > 5
                          ? "Add specific dates. Use the checkbox to show or hide a checkpoint, or delete it."
                          : autoMode
                            ? "Every day is a checkpoint automatically. Uncheck to hide a day, or delete it."
                            : "Uncheck to hide a day, or delete it."}
                      </p>
                    </div>
                    {shortEvent &&
                    (eventCheckpointsCustomized ||
                      eventCheckpointHiddenDates.length > 0) ? (
                      <button
                        type="button"
                        onClick={resetCheckpoints}
                        className="text-xs font-bold text-[#0B4650] hover:underline"
                      >
                        Show all days
                      </button>
                    ) : null}
                  </div>

                  {eventDays.length > 5 ? (
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        type="date"
                        min={eventStart || undefined}
                        max={eventEnd || undefined}
                        value={checkpointDraft}
                        onChange={(e) => setCheckpointDraft(e.target.value)}
                        className="min-h-10 rounded-xl border border-[#0B4650]/15 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-[#0B4650]/30"
                      />
                      <button
                        type="button"
                        onClick={addCheckpoint}
                        disabled={!canAddCheckpoint}
                        className="inline-flex min-h-10 items-center justify-center rounded-xl bg-[#0B4650] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#062E35] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Add checkpoint
                      </button>
                    </div>
                  ) : null}

                  {visibleCheckpointDays.length === 0 ? (
                    <p className="text-xs font-medium text-[#0B4650]/55">
                      No checkpoints added yet.
                    </p>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {visibleCheckpointDays.map((day) => {
                        const shown = !eventCheckpointHiddenDates.includes(
                          day.key,
                        );
                        return (
                          <div
                            key={day.key}
                            className={`rounded-xl border p-3 transition-colors ${
                              shown
                                ? "border-[#0B4650]/25 bg-white"
                                : "border-[#0B4650]/10 bg-white/50"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <input
                                id={`checkpoint-${day.key}`}
                                type="checkbox"
                                checked={shown}
                                onChange={() =>
                                  toggleCheckpointVisibility(day.key)
                                }
                                className="h-4 w-4 shrink-0 cursor-pointer accent-[#0B4650]"
                              />
                              <label
                                htmlFor={`checkpoint-${day.key}`}
                                className="cursor-pointer text-xs font-semibold text-[#0B4650]"
                              >
                                {day.label}
                              </label>
                              <button
                                type="button"
                                onClick={() => deleteCheckpoint(day.key)}
                                className="ml-auto text-[11px] font-bold text-[#B4532A] hover:underline"
                              >
                                Delete
                              </button>
                            </div>
                            <input
                              value={eventDayTitles[day.key] ?? ""}
                              maxLength={120}
                              onChange={(e) =>
                                setEventDayTitles((prev) => ({
                                  ...prev,
                                  [day.key]: e.target.value,
                                }))
                              }
                              placeholder="Optional title"
                              className="mt-2 w-full rounded-lg border border-[#0B4650]/15 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-[#0B4650]/30"
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : null}
              {eventProgressEnabled && eventStart && eventDays.length === 0 ? (
                <p className="text-xs font-medium text-[#0B4650]/55">
                  Set a valid event date range to configure checkpoints.
                </p>
              ) : null}
            </div>
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#0B4650]">
              Display deadline (e.g. &quot;Applications due Feb 28&quot;)
              <input
                value={deadline}
                maxLength={200}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="Optional display text"
                className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#0B4650]/30"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#0B4650]">
              Sortable deadline (used when an event has no start date)
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
                {imagePreviewFailed ? (
                  <span className="flex h-full w-full items-center justify-center px-3 text-center text-[11px] font-semibold leading-snug text-[#B4532A]">
                    Preview unavailable — check the image URL
                  </span>
                ) : (
                  <Image
                    src={image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="224px"
                    onError={() => setFailedImageSrc(image)}
                  />
                )}
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
                description="Shown above the description on the event page. Recommended 1920×600."
              />
              <div className="flex flex-wrap items-start gap-4">
                <div className="relative aspect-[16/5] w-44 shrink-0 overflow-hidden rounded-xl border border-[#0B4650]/10 bg-[#0B4650]/5">
                  {bannerImage ? (
                    <Image
                      src={bannerImage}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="176px"
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
                      maxLength={1000}
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
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold text-[#0B4650]">Markdown</span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPreview((v) => !v)}
                    className="rounded-full border border-[#0B4650]/20 bg-white/80 px-4 py-2 text-xs font-semibold text-[#0B4650] hover:bg-white"
                  >
                    {showPreview ? "Edit" : "Preview"}
                  </button>
                  <button
                    type="button"
                    onClick={onFormatWithAi}
                    disabled={formatting}
                    className="inline-flex items-center gap-2 rounded-full bg-[#0B4650] px-4 py-2 text-xs font-semibold text-white hover:bg-[#062E35] disabled:opacity-50"
                  >
                    {formatting ? "Formatting…" : "Format with AI"}
                  </button>
                  {quota?.freeModelDaily ? (
                    <span className="text-[11px] font-medium text-[#0B4650]/60">
                      {quota.freeModelDaily.remaining}/{quota.freeModelDaily.limit} Free Credit Left
                    </span>
                  ) : null}
                </div>
              </div>

              {formatError ? (
                <div role="alert" className="rounded-xl border border-[#B4532A]/30 bg-[#FFE4C4]/40 px-3 py-2 text-xs font-semibold text-[#B4532A]">
                  {formatError}
                </div>
              ) : null}

              {formatting ? (
                <div className="flex items-center gap-2 text-xs font-medium text-[#0B4650]/70">
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#F28F6B]" />
                  {statusWord}
                </div>
              ) : null}

              <div className="flex flex-wrap items-center gap-1 rounded-xl border border-[#0B4650]/10 bg-white/60 px-2 py-1.5">
                {[
                  { label: "B", title: "Bold", before: "**", after: "**" },
                  { label: "I", title: "Italic", before: "*", after: "*" },
                  { label: "H2", title: "Heading", before: "## ", after: "" },
                  { label: "•", title: "Bullet list", before: "- ", after: "" },
                  { label: "1.", title: "Numbered list", before: "1. ", after: "" },
                  { label: "🔗", title: "Link", before: "[", after: "](url)" },
                  { label: "</>", title: "Code", before: "`", after: "`" },
                  { label: "❝", title: "Quote", before: "> ", after: "" },
                ].map((t) => (
                  <button
                    key={t.title}
                    type="button"
                    title={t.title}
                    onClick={() => insertMarkdown(t.before, t.after)}
                    className="rounded-md px-2 py-1 text-xs font-bold text-[#0B4650] hover:bg-[#0B4650]/8"
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {showPreview ? (
                <div className="min-h-[24rem] rounded-xl border border-[#0B4650]/15 bg-white/80 px-4 py-3">
                  <Markdown content={description || "Nothing to preview yet."} />
                </div>
              ) : (
                <textarea
                  ref={textareaRef}
                  required
                  rows={16}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  spellCheck={false}
                  disabled={formatting}
                  className="w-full rounded-xl border border-[#0B4650]/15 bg-white/80 px-4 py-3 font-mono text-sm leading-relaxed outline-none focus:border-[#0B4650]/30 disabled:opacity-60"
                />
              )}
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
