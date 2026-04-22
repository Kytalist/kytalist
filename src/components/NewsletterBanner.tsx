"use client";

import Link from "next/link";
import { ArrowRight, Mail, Sparkles } from "lucide-react";

export function NewsletterBanner() {
  return (
    <section className="relative isolate overflow-hidden border-y border-[#0B4650]/10 bg-[#F9F8F6]">
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#F28F6B]/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-[#A3E4D7]/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(rgba(11, 70, 80, 0.6) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />

      <div className="relative mx-auto flex max-w-[1440px] flex-col items-center gap-10 px-4 py-16 text-center sm:px-6 lg:flex-row lg:items-center lg:gap-12 lg:py-20 lg:text-left">
        <div className="flex flex-1 flex-col items-center gap-4 lg:items-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#0B4650]/10 bg-white/60 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#0B4650] shadow-sm backdrop-blur-md">
            <Mail className="h-3.5 w-3.5 text-[#F28F6B]" aria-hidden />
            Join our newsletter
          </span>
          <h2 className="font-display max-w-xl text-3xl font-bold leading-tight tracking-tight text-[#0B4650] text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
            New programs &amp; deadline reminders,{" "}
            <span className="text-gradient">straight to your inbox.</span>
          </h2>
          <p className="max-w-xl text-sm font-medium leading-relaxed text-[#0B4650]/70 text-pretty sm:text-base">
            One short email a week with newly vetted programs, upcoming
            deadlines, and scholarship drops. Unsubscribe anytime.
          </p>
          <ul className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] font-semibold text-[#0B4650]/70 lg:justify-start">
            <li className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#F28F6B]" aria-hidden />
              Handpicked each week
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#F28F6B]" aria-hidden />
              No spam, no selling
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#F28F6B]" aria-hidden />
              Free forever
            </li>
          </ul>
        </div>

        <div className="flex w-full max-w-xl flex-col gap-3 lg:w-auto lg:max-w-md lg:flex-1">
          <form
            className="card-surface flex w-full flex-col gap-2 rounded-full p-1.5 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <label className="relative flex-1">
              <span className="sr-only">Email address</span>
              <Mail
                className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0B4650]/40"
                aria-hidden
              />
              <input
                type="email"
                required
                placeholder="you@school.edu"
                className="h-12 w-full rounded-full bg-transparent pl-11 pr-4 text-sm font-medium text-[#0B4650] placeholder:text-[#0B4650]/40 outline-none"
              />
            </label>
            <button
              type="submit"
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#0B4650] px-6 text-sm font-semibold text-white transition-all hover:bg-[#062E35] hover:shadow-lg active:scale-[0.99]"
            >
              Subscribe
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </form>
          <p className="text-center text-[11px] font-medium text-[#0B4650]/50 lg:text-left">
            We&rsquo;ll never share your email. See our{" "}
            <Link
              href="/privacy"
              className="text-[#0B4650]/70 underline-offset-4 hover:underline"
            >
              privacy notes
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
