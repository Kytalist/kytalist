"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { adminGetMe } from "@/lib/api/adminApi";
import {
  getSupabaseBrowser,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] text-[#0B4650]">{children}</div>
    );
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#F9F8F6] text-[#0B4650]">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopBar />
          <main className="flex-1 overflow-auto p-6 md:p-8">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}

function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<
    "loading" | "ok" | "unauth" | "forbidden" | "misconfigured"
  >("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!isSupabaseConfigured()) {
          if (!cancelled) setState("misconfigured");
          return;
        }
        const supabase = getSupabaseBrowser();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.access_token) {
          if (!cancelled) {
            setState("unauth");
            router.replace("/admin/login");
          }
          return;
        }
        const me = await adminGetMe(session.access_token);
        if (me.data.role !== "admin") {
          if (!cancelled) setState("forbidden");
          return;
        }
        if (!cancelled) setState("ok");
      } catch (e) {
        if (!cancelled) {
          if (
            e instanceof Error &&
            e.message.includes("NEXT_PUBLIC_SUPABASE")
          ) {
            setState("misconfigured");
            return;
          }
          setState("unauth");
          router.replace("/admin/login");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9F8F6]">
        <p className="text-sm font-medium text-[#0B4650]/70">Loading…</p>
      </div>
    );
  }

  if (state === "misconfigured") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F9F8F6] px-4">
        <h1 className="font-display text-xl font-bold text-[#0B4650]">
          Supabase not configured
        </h1>
        <p className="max-w-md text-center text-sm text-[#0B4650]/70">
          Add <code className="rounded bg-white/80 px-1">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
          and{" "}
          <code className="rounded bg-white/80 px-1">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>{" "}
          to <code className="rounded bg-white/80 px-1">.env.local</code> (see{" "}
          <code className="rounded bg-white/80 px-1">.env.local.example</code>
          ).
        </p>
        <Link
          href="/admin/login"
          className="rounded-full bg-[#0B4650] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#062E35]"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  if (state === "forbidden") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F9F8F6] px-4">
        <h1 className="font-display text-xl font-bold text-[#0B4650]">
          Access denied
        </h1>
        <p className="max-w-md text-center text-sm text-[#0B4650]/70">
          Your account does not have admin privileges. An owner must set your
          user role to admin in the database (or via another admin).
        </p>
        <Link
          href="/"
          className="rounded-full bg-[#0B4650] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#062E35]"
        >
          Back to site
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
