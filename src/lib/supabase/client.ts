import { createClient, type SupabaseClient } from "@supabase/supabase-js";

declare global {
  interface Window {
    __kytalistSupabase?: SupabaseClient;
  }
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env["NEXT_PUBLIC_SUPABASE_URL"] &&
      process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"],
  );
}

/**
 * Single browser client so GoTrue does not attach multiple auth listeners
 * under the same storage key (avoids "Multiple GoTrueClient instances" warnings).
 */
export function getSupabaseBrowser(): SupabaseClient {
  const url = process.env["NEXT_PUBLIC_SUPABASE_URL"];
  const key = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"];
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }
  if (typeof window !== "undefined") {
    window.__kytalistSupabase ??= createClient(url, key);
    return window.__kytalistSupabase;
  }
  return createClient(url, key);
}

export async function getSupabaseAccessToken(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  const {
    data: { session },
  } = await getSupabaseBrowser().auth.getSession();
  return session?.access_token ?? null;
}
