"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  getSupabaseBrowser,
  isSupabaseConfigured,
} from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!isSupabaseConfigured()) {
        setError(
          "Supabase env vars are missing. Copy .env.local.example to .env.local.",
        );
        return;
      }
      const supabase = getSupabaseBrowser();
      const { error: err } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (err) {
        setError(err.message);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Sign-in failed. Check Supabase env vars and credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="card-surface squircle w-full max-w-md p-8 md:p-10">
        <h1 className="font-display mb-2 text-2xl font-bold text-[#0B4650]">
          Admin sign in
        </h1>
        <p className="mb-8 text-sm font-medium text-[#0B4650]/65">
          Use the same account as your Supabase project (must have{" "}
          <code className="rounded bg-white/80 px-1 text-xs">role = admin</code>{" "}
          in the app database).
        </p>
        {!isSupabaseConfigured() ? (
          <p className="mb-4 text-sm font-medium text-[#B4532A]" role="alert">
            Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in
            .env.local.
          </p>
        ) : null}
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#0B4650]">
            Email
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-4 py-3 text-sm outline-none focus:border-[#0B4650]/30"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#0B4650]">
            Password
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-[#0B4650]/15 bg-white/80 px-4 py-3 text-sm outline-none focus:border-[#0B4650]/30"
            />
          </label>
          {error ? (
            <p className="text-sm font-medium text-[#B4532A]" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-[#0B4650] py-3 text-sm font-semibold text-white hover:bg-[#062E35] disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <Link
          href="/"
          className="mt-6 inline-block text-sm font-semibold text-[#0B4650]/70 hover:text-[#0B4650]"
        >
          Back to site
        </Link>
      </div>
    </div>
  );
}
