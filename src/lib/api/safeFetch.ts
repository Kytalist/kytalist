import { ApiError } from "./client";

export type SafeResult<T> =
  | { ok: true; data: T; error: null }
  | { ok: false; data: null; error: { message: string; status?: number; code?: string } };

/**
 * Wrap a Server Component data fetch so a backend outage renders a graceful
 * empty state instead of crashing the whole route. Logs the failure to stderr
 * so it remains visible in the server logs.
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
      console.error(
        `[safeFetch${context ? `:${context}` : ""}] ${err.status} ${err.message}`,
      );
      const error: { message: string; status?: number; code?: string } = {
        message: err.message,
        status: err.status,
      };
      if (err.code !== undefined) error.code = err.code;
      return { ok: false, data: null, error };
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(
      `[safeFetch${context ? `:${context}` : ""}] ${message}`,
    );
    return { ok: false, data: null, error: { message } };
  }
}
