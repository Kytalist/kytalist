"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminGetMe } from "@/lib/api/adminApi";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { deriveInitials } from "@/lib/visual";

type Viewer = {
  name: string | null;
  email: string | null;
};

export function AdminTopBar() {
  const router = useRouter();
  const [viewer, setViewer] = useState<Viewer>({ name: null, email: null });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const {
          data: { session },
        } = await getSupabaseBrowser().auth.getSession();
        if (!session) return;

        if (!cancelled) {
          setViewer({ name: null, email: session.user.email ?? null });
        }

        // Read the profile from the API so a name edited in the admin panel
        // shows up immediately, without waiting for the token to refresh.
        const me = await adminGetMe(session.access_token);
        if (!cancelled) {
          setViewer({ name: me.data.name, email: me.data.email });
        }
      } catch {
        // The shell already handles auth failures; keep the session email.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function signOut() {
    await getSupabaseBrowser().auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-6 py-4 md:px-8">
      <div className="glass-nav flex flex-1 items-center justify-between gap-4 rounded-full px-5 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0B4650] font-display text-[11px] font-bold text-white"
          >
            {deriveInitials(viewer.name || viewer.email || "?", 2)}
          </span>
          <div className="min-w-0">
            {viewer.name ? (
              <p className="truncate text-sm font-semibold text-[#0B4650]">
                {viewer.name}
              </p>
            ) : null}
            <p
              className={`truncate ${
                viewer.name
                  ? "text-xs text-[#0B4650]/55"
                  : "text-sm font-medium text-[#0B4650]/80"
              }`}
            >
              {viewer.email ?? "…"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="shrink-0 rounded-full border border-[#0B4650]/15 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#0B4650] transition-colors hover:bg-white"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
