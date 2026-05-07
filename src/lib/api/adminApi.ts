import {
  ApiError,
  getApiBaseUrl,
  type SearchParamsInit,
} from "@/lib/api/client";
import type {
  AdminListing,
  AdminStats,
  AdminUser,
  AuditLogRow,
  ItemEnvelope,
  ListEnvelope,
  SignedUpload,
  SubscriberRow,
  TestimonialAdmin,
} from "@/lib/api/adminTypes";

function buildUrl(path: string, searchParams?: SearchParamsInit): string {
  const base = getApiBaseUrl().replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${base}${cleanPath}`);
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function adminFetch<T>(
  path: string,
  token: string | null,
  init: RequestInit & { json?: unknown } = {},
): Promise<T> {
  if (!token) {
    throw new ApiError("You must be signed in", 401, "UNAUTHORIZED");
  }
  const { json, headers: hdr, ...rest } = init;
  const headers = new Headers(hdr);
  headers.set("Authorization", `Bearer ${token}`);
  if (json !== undefined && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  const res = await fetch(buildUrl(path), {
    cache: "no-store",
    ...rest,
    headers,
    ...(json !== undefined ? { body: JSON.stringify(json) } : {}),
  });
  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    let code: string | undefined;
    try {
      const body = (await res.json()) as {
        error?: { message?: string; code?: string };
      };
      if (body?.error?.message) message = body.error.message;
      if (body?.error?.code) code = body.error.code;
    } catch {
      /* ignore */
    }
    throw new ApiError(message, res.status, code);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export async function adminGetMe(
  token: string | null,
): Promise<ItemEnvelope<AdminUser>> {
  return adminFetch<ItemEnvelope<AdminUser>>("/auth/me", token, {
    method: "GET",
  });
}

export async function adminGetStats(
  token: string | null,
): Promise<ItemEnvelope<AdminStats>> {
  return adminFetch<ItemEnvelope<AdminStats>>("/admin/stats", token, {
    method: "GET",
  });
}

export async function adminListListings(
  token: string | null,
  params: {
    status?: string;
    category?: string;
    q?: string;
    limit?: number;
    offset?: number;
  },
): Promise<ListEnvelope<AdminListing>> {
  const url = buildUrl("/admin/listings", params as SearchParamsInit);
  if (!token) throw new ApiError("You must be signed in", 401, "UNAUTHORIZED");
  const res = await fetch(url, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const body = (await res.json()) as { error?: { message?: string } };
      if (body?.error?.message) message = body.error.message;
    } catch {
      /* ignore */
    }
    throw new ApiError(message, res.status);
  }
  return (await res.json()) as ListEnvelope<AdminListing>;
}

export async function adminGetListing(
  token: string | null,
  id: string,
): Promise<ItemEnvelope<AdminListing>> {
  return adminFetch<ItemEnvelope<AdminListing>>(
    `/admin/listings/${encodeURIComponent(id)}`,
    token,
    { method: "GET" },
  );
}

export async function adminCreateListing(
  token: string | null,
  body: Record<string, unknown>,
): Promise<ItemEnvelope<AdminListing>> {
  return adminFetch<ItemEnvelope<AdminListing>>("/admin/listings", token, {
    method: "POST",
    json: body,
  });
}

export async function adminUpdateListing(
  token: string | null,
  id: string,
  body: Record<string, unknown>,
): Promise<ItemEnvelope<AdminListing>> {
  return adminFetch<ItemEnvelope<AdminListing>>(
    `/admin/listings/${encodeURIComponent(id)}`,
    token,
    { method: "PATCH", json: body },
  );
}

export async function adminDeleteListing(
  token: string | null,
  id: string,
): Promise<void> {
  await adminFetch<undefined>(
    `/admin/listings/${encodeURIComponent(id)}`,
    token,
    { method: "DELETE" },
  );
}

export async function adminPublishListing(
  token: string | null,
  id: string,
): Promise<ItemEnvelope<AdminListing>> {
  return adminFetch<ItemEnvelope<AdminListing>>(
    `/admin/listings/${encodeURIComponent(id)}/publish`,
    token,
    { method: "POST" },
  );
}

export async function adminUnpublishListing(
  token: string | null,
  id: string,
): Promise<ItemEnvelope<AdminListing>> {
  return adminFetch<ItemEnvelope<AdminListing>>(
    `/admin/listings/${encodeURIComponent(id)}/unpublish`,
    token,
    { method: "POST" },
  );
}

export async function adminRequestListingImageUpload(
  token: string | null,
  filename: string,
  contentType: string,
): Promise<ItemEnvelope<SignedUpload>> {
  return adminFetch<ItemEnvelope<SignedUpload>>(
    "/admin/uploads/listing-image",
    token,
    { method: "POST", json: { filename, contentType } },
  );
}

export async function adminListTestimonials(
  token: string | null,
): Promise<ItemEnvelope<TestimonialAdmin[]>> {
  return adminFetch<ItemEnvelope<TestimonialAdmin[]>>(
    "/admin/testimonials",
    token,
    { method: "GET" },
  );
}

export async function adminCreateTestimonial(
  token: string | null,
  body: Record<string, unknown>,
): Promise<ItemEnvelope<TestimonialAdmin>> {
  return adminFetch<ItemEnvelope<TestimonialAdmin>>(
    "/admin/testimonials",
    token,
    { method: "POST", json: body },
  );
}

export async function adminUpdateTestimonial(
  token: string | null,
  id: string,
  body: Record<string, unknown>,
): Promise<ItemEnvelope<TestimonialAdmin>> {
  return adminFetch<ItemEnvelope<TestimonialAdmin>>(
    `/admin/testimonials/${encodeURIComponent(id)}`,
    token,
    { method: "PATCH", json: body },
  );
}

export async function adminDeleteTestimonial(
  token: string | null,
  id: string,
): Promise<void> {
  await adminFetch<undefined>(
    `/admin/testimonials/${encodeURIComponent(id)}`,
    token,
    { method: "DELETE" },
  );
}

export async function adminListSubscribers(
  token: string | null,
  params: { status?: string; limit?: number; offset?: number },
): Promise<ListEnvelope<SubscriberRow>> {
  const url = buildUrl("/admin/newsletter/subscribers", params as SearchParamsInit);
  if (!token) throw new ApiError("You must be signed in", 401, "UNAUTHORIZED");
  const res = await fetch(url, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const body = (await res.json()) as { error?: { message?: string } };
      if (body?.error?.message) message = body.error.message;
    } catch {
      /* ignore */
    }
    throw new ApiError(message, res.status);
  }
  return (await res.json()) as ListEnvelope<SubscriberRow>;
}

export async function adminBroadcastNewsletter(
  token: string | null,
  subject: string,
  html: string,
): Promise<ItemEnvelope<{ queued: boolean }>> {
  return adminFetch<ItemEnvelope<{ queued: boolean }>>(
    "/admin/newsletter/broadcast",
    token,
    { method: "POST", json: { subject, html } },
  );
}

export async function adminListUsers(
  token: string | null,
  params: { role?: string; q?: string; limit?: number; offset?: number },
): Promise<ListEnvelope<AdminUser>> {
  const url = buildUrl("/admin/users", params as SearchParamsInit);
  if (!token) throw new ApiError("You must be signed in", 401, "UNAUTHORIZED");
  const res = await fetch(url, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const body = (await res.json()) as { error?: { message?: string } };
      if (body?.error?.message) message = body.error.message;
    } catch {
      /* ignore */
    }
    throw new ApiError(message, res.status);
  }
  return (await res.json()) as ListEnvelope<AdminUser>;
}

export async function adminUpdateUser(
  token: string | null,
  id: string,
  body: { role?: "user" | "admin" },
): Promise<ItemEnvelope<AdminUser>> {
  return adminFetch<ItemEnvelope<AdminUser>>(
    `/admin/users/${encodeURIComponent(id)}`,
    token,
    { method: "PATCH", json: body },
  );
}

export async function adminDeleteUser(
  token: string | null,
  id: string,
): Promise<void> {
  await adminFetch<undefined>(
    `/admin/users/${encodeURIComponent(id)}`,
    token,
    { method: "DELETE" },
  );
}

export async function adminListAuditLogs(
  token: string | null,
  params: {
    entityType?: string;
    entityId?: string;
    actorId?: string;
    from?: string;
    to?: string;
    limit?: number;
    offset?: number;
  },
): Promise<ListEnvelope<AuditLogRow>> {
  const url = buildUrl("/admin/audit-logs", params as SearchParamsInit);
  if (!token) throw new ApiError("You must be signed in", 401, "UNAUTHORIZED");
  const res = await fetch(url, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const body = (await res.json()) as { error?: { message?: string } };
      if (body?.error?.message) message = body.error.message;
    } catch {
      /* ignore */
    }
    throw new ApiError(message, res.status);
  }
  return (await res.json()) as ListEnvelope<AuditLogRow>;
}

/** PUT file to Supabase signed upload URL (not the API). */
export async function uploadToSignedUrl(
  uploadUrl: string,
  file: File,
  contentType: string,
): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": contentType },
  });
  if (!res.ok) {
    throw new ApiError(`Upload failed: ${res.status}`, res.status);
  }
}
