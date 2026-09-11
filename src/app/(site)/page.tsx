import Image from "next/image";
import { Sparkles } from "lucide-react";
import { ComingSoonForm } from "@/components/ComingSoonForm";
import { MeshBackground } from "@/components/MeshBackground";

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#F9F8F6]">
      <MeshBackground />

      <main className="relative z-10 mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#A3E4D7]/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-[#F28F6B]/14 blur-3xl" />

        <div className="relative">
          <div className="mb-8 flex items-center justify-center gap-3">
            <Image
              src="/images/Kytalist_profile_light.png"
              alt="Kytalist Logo"
              width={44}
              height={44}
              className="h-11 w-11 rounded-xl object-contain"
            />
            <span className="font-display text-2xl font-extrabold tracking-tight text-[#0B4650]">
              Kytalist<span className="text-[#F28F6B]">.</span>
            </span>
          </div>

          <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#0B4650] px-4 py-2 text-xs font-bold text-white shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-[#FFD3B6]" aria-hidden />
            Coming soon
          </span>

          <h1 className="font-display mt-6 text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-[#0B4650] text-balance">
            Something is cooking :)
          </h1>

          <p className="mt-6 text-base font-semibold leading-relaxed text-[#0B4650]/72 text-pretty sm:text-lg">
            We&rsquo;re building a curated hub for student activities, camps,
            and internships. Sign up to be the first to know when we launch.
          </p>

          <div className="mt-10 flex justify-center">
            <ComingSoonForm />
          </div>

          <div className="mt-8 flex justify-center">
            <a
              href="https://www.facebook.com/kytalist.xyz"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our official Facebook page"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B4650]/60 transition-colors hover:text-[#0B4650]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
              Visit our official Facebook page
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
