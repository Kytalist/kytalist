"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";

export function AdminTopBar() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    getSupabaseBrowser()
      .auth.getSession()
      .then(({ data: { session } }) => {
        setEmail(session?.user?.email ?? null);
      });
  }, []);

  async function signOut() {
    await getSupabaseBrowser().auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-6 py-4 md:px-8">
      <div className="glass-nav flex flex-1 items-center justify-between rounded-full px-5 py-3">
        <span className="truncate text-sm font-medium text-[#0B4650]/80">
          {email ?? "…"}
        </span>
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
