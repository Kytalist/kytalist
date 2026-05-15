/**
 * Thin fetch wrapper for the api-kytalist backend.
 *
 * Reads the base URL from `NEXT_PUBLIC_API_BASE_URL` (e.g.
 * `http://localhost:3001/api/v1`). See `.env.local.example` at the repo root.
 *
 * Server Components import this directly. Default cache mode is `no-store`
 * for now; switch to `next: { revalidate: N }` per call if/when we want ISR.
 */

const DEFAULT_BASE_URL = "http://localhost:3001/api/v1";
const DEFAULT_CONTEST_API_URL = "https://kytalist-cp-backend.vercel.app/api";

export function getApiBaseUrl(): string {
  return process.env["NEXT_PUBLIC_API_BASE_URL"] ?? DEFAULT_BASE_URL;
}

export function getContestApiBaseUrl(): string {
  return (
    process.env["NEXT_PUBLIC_CONTEST_BACKEND_API"] ?? DEFAULT_CONTEST_API_URL
  );
}

function getBaseUrl(): string {
  return getApiBaseUrl();
}

function getContestBaseUrl(): string {
  return getContestApiBaseUrl();
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string | undefined;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    if (code !== undefined) this.code = code;
  }
}

export type SearchParamsInit = Record<
  string,
  string | number | boolean | undefined | null
>;

function buildUrl(path: string, searchParams?: SearchParamsInit): string {
  const base = getBaseUrl().replace(/\/+$/, "");
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

type ApiInit = Omit<RequestInit, "body"> & {
  searchParams?: SearchParamsInit;
  json?: unknown;
};

async function request<T>(path: string, init: ApiInit = {}): Promise<T> {
  const { searchParams, json, headers, ...rest } = init;
  const url = buildUrl(path, searchParams);

  const finalHeaders = new Headers(headers);
  if (json !== undefined && !finalHeaders.has("content-type")) {
    finalHeaders.set("content-type", "application/json");
  }

  const res = await fetch(url, {
    cache: "no-store",
    ...rest,
    headers: finalHeaders,
    ...(json !== undefined ? { body: JSON.stringify(json) } : {}),
  });

  if (!res.ok) {
    let message = `Request failed: ${res.status} ${res.statusText}`;
    let code: string | undefined;
    try {
      const body = (await res.json()) as {
        error?: { message?: string; code?: string };
      };
      if (body?.error?.message) message = body.error.message;
      if (body?.error?.code) code = body.error.code;
    } catch {
      // not JSON; keep default message
    }
    throw new ApiError(message, res.status, code);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export function apiGet<T>(
  path: string,
  init?: Omit<ApiInit, "method" | "json">,
): Promise<T> {
  return request<T>(path, { ...init, method: "GET" });
}

export function apiPost<T>(
  path: string,
  body?: unknown,
  init?: Omit<ApiInit, "method" | "json">,
): Promise<T> {
  return request<T>(path, { ...init, method: "POST", json: body });
}

export function apiPatch<T>(
  path: string,
  body?: unknown,
  init?: Omit<ApiInit, "method" | "json">,
): Promise<T> {
  return request<T>(path, { ...init, method: "PATCH", json: body });
}

export function apiDelete<T>(
  path: string,
  init?: Omit<ApiInit, "method" | "json">,
): Promise<T> {
  return request<T>(path, { ...init, method: "DELETE" });
}

// Contest API functions
async function contestRequest<T>(path: string, init: ApiInit = {}): Promise<T> {
  const { searchParams, json, headers, ...rest } = init;
  const base = getContestBaseUrl().replace(/\/$/, "");
  let url: URL;

  if (path === "" || path === "/") {
    url = new URL(base);
  } else {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    url = new URL(`${base}${cleanPath}`);
  }

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }

  const finalHeaders = new Headers(headers);
  if (json !== undefined && !finalHeaders.has("content-type")) {
    finalHeaders.set("content-type", "application/json");
  }

  const res = await fetch(url.toString(), {
    cache: "no-store",
    ...rest,
    headers: finalHeaders,
    ...(json !== undefined ? { body: JSON.stringify(json) } : {}),
  });

  if (!res.ok) {
    let message = `Request failed: ${res.status} ${res.statusText}`;
    let code: string | undefined;
    try {
      const body = (await res.json()) as {
        error?: { message?: string; code?: string };
      };
      if (body?.error?.message) message = body.error.message;
      if (body?.error?.code) code = body.error.code;
    } catch {
      // not JSON; keep default message
    }
    throw new ApiError(message, res.status, code);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export function contestApiGet<T>(
  path: string,
  init?: Omit<ApiInit, "method" | "json">,
): Promise<T> {
  return contestRequest<T>(path, { ...init, method: "GET" });
}
