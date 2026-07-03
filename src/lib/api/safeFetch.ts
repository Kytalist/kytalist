import { ApiError } from "./client";

export type SafeResult<T> =
  | { ok: true; data: T; error: null }
  | {
      ok: false;
      data: null;
      error: { message: string; status?: number; code?: string };
    };

/**
 * Wrap a Server Component data fetch so a backend outage renders a graceful
 * empty state instead of crashing the whole route. These are handled failures,
 * so avoid console logging here; Next dev treats server console errors as
 * user-facing overlays.
 */
export async function safeFetch<T>(
  loader: () => Promise<T>,
  context?: string,
): Promise<SafeResult<T>> {
  try {
    const data = await loader();
    return { ok: true, data, error: null };
  } catch (err) {
    if (err instanceof ApiError) {
      const error: { message: string; status?: number; code?: string } = {
        message: formatMessage(err.message, context),
        status: err.status,
      };
      if (err.code !== undefined) error.code = err.code;
      return { ok: false, data: null, error };
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      ok: false,
      data: null,
      error: { message: formatMessage(message, context) },
    };
  }
}

function formatMessage(message: string, context?: string): string {
  return context ? `[safeFetch:${context}] ${message}` : message;
}
