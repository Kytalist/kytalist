import Link from "next/link";
import { ArrowRight, Rocket, Sparkles, Star } from "lucide-react";

const COURSE_URL =
  "https://courses.kytalist.xyz/courses/nasa-conrad-challenge-preparation-course";

export function CoursesPromo() {
  return (
    <section className="relative mx-auto max-w-360 px-4 pb-14 pt-2 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-[#0B4650]/10 bg-linear-to-br from-[#0B4650] via-[#0F5A66] to-[#1B7A88] p-6 shadow-[0_30px_60px_-30px_rgba(11,70,80,0.6)] sm:p-8 lg:p-10">
        {/* Decorative glows */}
        <div
          className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[#F28F6B]/30 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 -right-12 h-64 w-64 rounded-full bg-[#A3E4D7]/30 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white ring-1 ring-white/25 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#FFD3B6]" aria-hidden />
              New course
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F28F6B] px-2 py-0.5 text-[10px] font-black text-[#0B4650]">
                <Star className="h-3 w-3" aria-hidden />
                Featured
              </span>
            </span>

            <h2 className="font-display mt-4 text-2xl font-extrabold leading-tight text-white text-balance sm:text-3xl lg:text-4xl">
              Prepare for the NASA Conrad Challenge with a guided course.
            </h2>
            <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-white/80 sm:text-base">
              Structured lessons, mentorship, and a step-by-step roadmap to
              ideate, build, and pitch your innovation — built for ambitious
              students like you.
            </p>

            <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] font-semibold text-white/85">
              <li className="inline-flex items-center gap-1.5">
                <Rocket className="h-3.5 w-3.5 text-[#FFD3B6]" aria-hidden />
                Hands-on projects
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#FFD3B6]" aria-hidden />
                Mentor feedback
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-[#FFD3B6]" aria-hidden />
                Certificate on completion
              </li>
            </ul>
          </div>

          <div className="flex shrink-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
            <a
              href={COURSE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex min-h-13 items-center justify-center gap-2 overflow-hidden rounded-full bg-[#F28F6B] px-8 py-4 text-base font-extrabold text-[#0B4650] shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#FF9A78] hover:shadow-xl active:scale-[0.99]"
            >
              <span
                className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                aria-hidden
              />
              <Rocket className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:rotate-[-8deg]" aria-hidden />
              Start the course
              <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </a>
            <p className="text-center text-[11px] font-semibold text-white/60 sm:text-left lg:text-right">
              Opens on courses.kytalist.xyz
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
