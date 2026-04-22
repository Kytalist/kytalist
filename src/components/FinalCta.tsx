import Link from "next/link";
import { Search, Sparkles } from "lucide-react";

export function FinalCta() {
  return (
    <section className="relative pb-20 pt-6 sm:pb-24">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-[#0B4650] text-balance sm:text-4xl">
          You scrolled this far{" "}
          <span className="text-[#F28F6B]">&mdash;</span>{" "}
          <span className="text-gradient">you&rsquo;re serious.</span>
        </h2>
        <p className="mt-4 text-base font-medium text-[#0B4650]/70 sm:text-lg">
          Stop Googling. Start applying.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/activities"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0B4650] px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-[#062E35] hover:shadow-lg active:scale-[0.99] sm:w-auto sm:min-h-0 sm:py-4"
          >
            <Search className="h-4 w-4 shrink-0" aria-hidden />
            Browse programs
          </Link>
          <Link
            href="/activities?fit=true"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[#0B4650]/15 bg-white/70 px-8 py-3.5 text-base font-semibold text-[#0B4650] shadow-sm backdrop-blur-xl transition-colors hover:border-[#0B4650]/25 hover:bg-white sm:w-auto sm:min-h-0 sm:py-4"
          >
            <Sparkles className="h-4 w-4 shrink-0 text-[#F28F6B]" aria-hidden />
            Find My Fit
          </Link>
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-[#0B4650]/45">
          No sign-up required. No cost. Ever.
        </p>
      </div>
    </section>
  );
}
