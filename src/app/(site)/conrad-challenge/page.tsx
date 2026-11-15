import Link from "next/link";
import { Metadata } from "next";
import { ConradHeroArt } from "@/components/ConradHeroArt";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock,
  Globe2,
  GraduationCap,
  Layers,
  Lightbulb,
  PlayCircle,
  Rocket,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

const COURSE_URL =
  "https://courses.kytalist.xyz/courses/nasa-conrad-challenge-preparation-course";

export const metadata: Metadata = {
  title: "NASA Conrad Challenge Preparation Course | Kytalist",
  description:
    "A recorded, self-paced course by Mahdi Bin Ferdous that takes you from Activation to the Innovation Summit — 12 classes across 6 modules covering problem finding, validation, business model, and the full Conrad submission.",
  robots: { index: false, follow: false },
};

const modules = [
  {
    title: "Module 1 — Starting the Conrad Journey",
    classes: [
      "Class 1: The Complete Conrad Challenge Roadmap",
      "Class 2: Activation Stage & Building the Right Foundation",
    ],
  },
  {
    title: "Module 2 — Learning From Previous Conrad Innovations",
    classes: [
      "Class 3: Aerospace & Aviation + Cyber-Technology & Security",
      "Class 4: Energy & Environment",
      "Class 5: Health & Nutrition + The Water Challenge",
    ],
  },
  {
    title: "Module 3 — Building a Serious Innovation",
    classes: [
      "Class 6: Finding the Right Problem & Developing the Innovation",
      "Class 7: Validation, Research & Prototype Strategy",
    ],
  },
  {
    title: "Module 4 — Business & Market Strategy",
    classes: [
      "Class 8: Customers, Market & Competition",
      "Class 9: Business Model, Go-to-Market & Financial Thinking",
    ],
  },
  {
    title: "Module 5 — Building the Innovation Stage Submission",
    classes: [
      "Class 10: The Innovation Brief — Turning Your Work Into a Strong Story",
      "Class 11: Innovation Video, Website & Pitch Deck",
    ],
  },
  {
    title: "Module 6 — Beyond the Submission: The Innovation Summit",
    classes: [
      "Class 12: From Finalist to Innovation Summit",
    ],
  },
];

const outcomes = [
  { icon: Target, title: "Pick a winning problem", desc: "Identify meaningful, defensible problems instead of trendy ideas." },
  { icon: Lightbulb, title: "Build a real innovation", desc: "Move from idea to a validated solution with evidence and prototypes." },
  { icon: Layers, title: "Master the Lean Canvas", desc: "Team roles, category choice, coach selection, and strategic brainstorming." },
  { icon: Globe2, title: "Analyze past winners", desc: "Extract patterns and unexplored opportunities across all 5 categories." },
  { icon: Zap, title: "Business & market strategy", desc: "Customers, competitors, pricing, and realistic financial projections." },
  { icon: Trophy, title: "Nail the submission", desc: "Innovation Brief, Video, Website, and a Summit-ready Power Pitch." },
];

const testimonials = [
  { name: "Aisha R.", role: "Team Lead, Health & Nutrition", quote: "This course saved us from scrambling two weeks before the deadline. The module on the Innovation Brief alone was worth it." },
  { name: "Daniel K.", role: "Coach & Educator", quote: "Finally a structured roadmap. My students went from vague ideas to a defensible innovation with a real business model." },
  { name: "Priya S.", role: "Finalist, Energy & Environment", quote: "The past-project analysis module opened our eyes to gaps nobody in our category was addressing." },
];

export default function ConradChallengePage() {
  return (
    <div className="relative min-h-screen bg-[#F9F8F6]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-linear-to-br from-[#062E35] via-[#0B4650] to-[#1B3A6B] pb-20 pt-28 sm:pt-32 lg:pb-28 lg:pt-36">
        <div className="pointer-events-none absolute -left-24 top-10 h-96 w-96 rounded-full bg-[#F28F6B]/25 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -right-24 top-32 h-[28rem] w-[28rem] rounded-full bg-[#A3E4D7]/20 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-[#6FD3BE]/15 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]" aria-hidden style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />

        <div className="relative mx-auto grid max-w-360 gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:items-center lg:gap-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white ring-1 ring-white/20 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#FFD3B6]" aria-hidden />
              Recorded · Self-paced · By Mahdi Bin Ferdous
            </span>

            <h1 className="font-display mt-6 text-[clamp(2.5rem,6.5vw,5rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-white text-balance">
              Master the{" "}
              <span className="bg-linear-to-r from-[#FFD3B6] to-[#F28F6B] bg-clip-text text-transparent">
                NASA Conrad Challenge
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-white/80 sm:text-lg lg:text-xl">
              From Activation to the Innovation Summit — a complete, recorded
              roadmap so your team plans ahead instead of scrambling before
              deadlines. 12 classes · 6 modules · Lifetime access.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F28F6B]/20 px-3.5 py-1.5 text-xs font-bold text-[#FFD3B6] ring-1 ring-[#F28F6B]/40">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                Early bird ends soon
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white/90 ring-1 ring-white/20">
                <Award className="h-3.5 w-3.5 text-[#FFD3B6]" aria-hidden />
                Certificate on completion
              </span>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <a
                href={COURSE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex min-h-13 items-center justify-center gap-2 overflow-hidden rounded-full bg-linear-to-r from-[#F28F6B] to-[#FF9A78] px-8 py-4 text-base font-extrabold text-[#0B4650] shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl active:scale-[0.99]"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
                <Rocket className="relative h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:rotate-[-8deg]" aria-hidden />
                <span className="relative">Enroll now — ৳2,499</span>
                <ArrowRight className="relative h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </a>
              <a href="#curriculum" className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-base font-bold text-white backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white/20 active:scale-[0.99]">
                View curriculum
                <ChevronDown className="h-5 w-5 shrink-0 transition-transform group-hover:translate-y-0.5" aria-hidden />
              </a>
            </div>

            <p className="mt-4 text-sm font-medium text-white/60">
              <span className="line-through text-white/40">৳5,000</span>{" "}
              <span className="font-extrabold text-[#FFD3B6]">৳2,499</span>{" "}
              early bird · Save ৳2,501
            </p>
          </div>

          <ConradHeroArt />
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="relative -mt-10 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-3 rounded-3xl border border-[#0B4650]/10 bg-white p-4 shadow-[0_20px_40px_-20px_rgba(11,70,80,0.25)] sm:grid-cols-4 sm:p-6">
            {[
              { icon: Layers, label: "6 modules", sub: "Structured path" },
              { icon: BookOpen, label: "12 classes", sub: "Recorded lessons" },
              { icon: Globe2, label: "5 categories", sub: "Full coverage" },
              { icon: Award, label: "Certificate", sub: "On completion" },
            ].map((t) => (
              <div key={t.label} className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E0F2F1] text-[#0B4650]">
                  <t.icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-sm font-extrabold text-[#0B4650]">{t.label}</span>
                  <span className="block text-xs font-semibold text-[#0B4650]/55">{t.sub}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU'LL LEARN */}
      <section className="mx-auto max-w-360 px-4 py-20 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-[#0B4650]/45">What you'll learn</p>
          <h2 className="font-display mt-2 text-3xl font-bold text-[#0B4650] sm:text-4xl">Everything you need to go from idea to Innovation Summit.</h2>
          <p className="mt-3 text-base font-medium text-[#0B4650]/70">A practical, step-by-step system — no fluff, no scrambling.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {outcomes.map((o) => (
            <div key={o.title} className="card-surface squircle group p-6 transition-all hover:-translate-y-1">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F28F6B]/15 text-[#B4532A] transition-colors group-hover:bg-[#F28F6B]/25">
                <o.icon className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="font-display text-lg font-extrabold text-[#0B4650]">{o.title}</h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-[#0B4650]/70">{o.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CURRICULUM */}
      <section id="curriculum" className="relative bg-[#0B4650]/[0.03] py-20">
        <div className="mx-auto max-w-360 px-4 sm:px-6">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-[#0B4650]/45">Curriculum</p>
            <h2 className="font-display mt-2 text-3xl font-bold text-[#0B4650] sm:text-4xl">12 classes across 6 modules.</h2>
            <p className="mt-3 text-base font-medium text-[#0B4650]/70">Follow the journey in order, or jump to what your team needs most.</p>
          </div>
          <div className="grid gap-4">
            {modules.map((m, i) => (
              <details key={m.title} className="group card-surface squircle overflow-hidden" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6">
                  <span className="flex items-center gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0B4650] font-display text-sm font-extrabold text-white">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block font-display text-base font-extrabold text-[#0B4650] sm:text-lg">{m.title}</span>
                      <span className="block text-xs font-semibold text-[#0B4650]/55">{m.classes.length} class{m.classes.length > 1 ? "es" : ""}</span>
                    </span>
                  </span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-[#0B4650]/40 transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <div className="border-t border-[#0B4650]/8 px-5 pb-5 pt-4 sm:px-6">
                  <ul className="grid gap-2">
                    {m.classes.map((c) => (
                      <li key={c} className="flex items-center gap-3 rounded-xl bg-[#F9F8F6] px-4 py-3">
                        <PlayCircle className="h-4 w-4 shrink-0 text-[#F28F6B]" aria-hidden />
                        <span className="text-sm font-semibold text-[#0B4650]">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* INSTRUCTOR */}
      <section className="mx-auto max-w-360 px-4 py-20 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-center">
          <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-3xl border border-[#0B4650]/10 bg-linear-to-br from-[#E0F2F1] to-[#A3E4D7]/40 shadow-lg">
            <div className="absolute inset-0 flex items-center justify-center">
              <GraduationCap className="h-24 w-24 text-[#0B4650]/30" aria-hidden />
            </div>
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/90 px-4 py-3 backdrop-blur-md">
              <p className="font-display text-sm font-extrabold text-[#0B4650]">Mahdi Bin Ferdous</p>
              <p className="text-xs font-semibold text-[#0B4650]/60">Instructor &amp; Conrad mentor</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#0B4650]/45">Your instructor</p>
            <h2 className="font-display mt-2 text-3xl font-bold text-[#0B4650] sm:text-4xl">Mahdi Bin Ferdous</h2>
            <p className="mt-4 text-base font-medium leading-relaxed text-[#0B4650]/75">
              Placeholder bio — replace with real credentials, Conrad experience, teams mentored, and why this course exists. Highlight years of coaching, number of teams guided to the Innovation Summit, and areas of expertise (innovation strategy, business modeling, pitching).
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                { n: "12", l: "Classes" },
                { n: "50+", l: "Teams mentored" },
                { n: "5", l: "Categories covered" },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl border border-[#0B4650]/10 bg-white p-4 text-center">
                  <p className="font-display text-2xl font-extrabold text-[#0B4650]">{s.n}</p>
                  <p className="text-xs font-semibold text-[#0B4650]/55">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="relative overflow-hidden bg-linear-to-br from-[#0B4650] to-[#062E35] py-20">
        <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#F28F6B]/20 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-[#A3E4D7]/20 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-360 px-4 sm:px-6">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-white/60">Pricing</p>
            <h2 className="font-display mt-2 text-3xl font-bold text-white sm:text-4xl">Invest in your team's success.</h2>
            <p className="mt-3 text-base font-medium text-white/70">One-time payment. Lifetime access. No subscriptions.</p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/15 bg-white/5 p-7 backdrop-blur-md">
              <p className="text-sm font-bold text-white/70">Standard</p>
              <p className="font-display mt-2 text-4xl font-extrabold text-white">৳5,000</p>
              <p className="mt-1 text-sm text-white/50">Regular price</p>
              <ul className="mt-6 grid gap-3 text-sm text-white/80">
                {["All 12 recorded classes", "6 modules, lifetime access", "Lean Canvas & Brief templates", "Certificate of completion"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-white/60" aria-hidden /> {f}
                  </li>
                ))}
              </ul>
              <a href={COURSE_URL} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-white/20">
                Enroll at ৳5,000 <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
            <div className="relative rounded-3xl border-2 border-[#F28F6B] bg-white p-7 shadow-[0_30px_60px_-20px_rgba(242,143,107,0.5)]">
              <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-[#F28F6B] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#0B4650]">
                <Sparkles className="h-3 w-3" aria-hidden /> Early bird
              </span>
              <p className="text-sm font-bold text-[#0B4650]/70">Early bird</p>
              <div className="mt-2 flex items-baseline gap-3">
                <p className="font-display text-4xl font-extrabold text-[#0B4650]">৳2,499</p>
                <p className="text-lg font-bold text-[#0B4650]/40 line-through">৳5,000</p>
              </div>
              <p className="mt-1 text-sm font-semibold text-[#B4532A]">Save ৳2,501 · Limited seats</p>
              <ul className="mt-6 grid gap-3 text-sm text-[#0B4650]">
                {["All 12 recorded classes", "6 modules, lifetime access", "Lean Canvas & Brief templates", "Certificate of completion", "Priority Q&amp;A access"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0B8A6B]" aria-hidden /> {f}
                  </li>
                ))}
              </ul>
              <a
                href={COURSE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative mt-7 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-linear-to-r from-[#F28F6B] to-[#FF9A78] px-6 py-3.5 text-sm font-extrabold text-[#0B4650] shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.99]"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
                <Rocket className="relative h-4 w-4 shrink-0" aria-hidden />
                <span className="relative">Claim early bird — ৳2,499</span>
                <ArrowRight className="relative h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-360 px-4 py-20 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-[#0B4650]/45">What students say</p>
          <h2 className="font-display mt-2 text-3xl font-bold text-[#0B4650] sm:text-4xl">Loved by teams preparing for Conrad.</h2>
          <p className="mt-2 text-xs font-semibold text-[#0B4650]/40">(Placeholder testimonials — replace with real reviews.)</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="card-surface squircle p-6">
              <div className="mb-3 flex items-center gap-1 text-[#F28F6B]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" aria-hidden />
                ))}
              </div>
              <p className="text-sm font-medium leading-relaxed text-[#0B4650]/80">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E0F2F1] font-display text-sm font-extrabold text-[#0B4650]">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-extrabold text-[#0B4650]">{t.name}</p>
                  <p className="text-xs font-semibold text-[#0B4650]/55">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="relative bg-[#0B4650]/[0.03] py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-[#0B4650]/45">FAQ</p>
            <h2 className="font-display mt-2 text-3xl font-bold text-[#0B4650] sm:text-4xl">Questions, answered.</h2>
          </div>
          <div className="grid gap-3">
            {[
              { q: "Is this an official NASA/Conrad program?", a: "No. This is an independent preparation course created by Mahdi Bin Ferdous to help teams succeed in the official Conrad Challenge. Registration for the actual challenge happens on the Conrad Challenge portal." },
              { q: "Is the course live or recorded?", a: "Fully recorded and self-paced. Watch anytime, anywhere, on any device. Lifetime access included." },
              { q: "Who is this for?", a: "Students aged 13–18, teams of 2–5, and coaches/parents preparing for any of the 5 Conrad categories — first-timers and returning challengers." },
              { q: "Do I need a team to enroll?", a: "No. You can enroll solo and form or join a team later. The course covers team formation and role assignment." },
              { q: "How long do I have access?", a: "Lifetime access to all recorded classes and downloadable templates." },
              { q: "What's the early bird offer?", a: "Enroll at ৳2,499 instead of ৳5,000 — a saving of ৳2,501. Early bird seats are limited." },
              { q: "Refund policy?", a: "Placeholder — replace with your actual refund policy terms." },
            ].map((f) => (
              <details key={f.q} className="card-surface squircle group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5">
                  <span className="font-display text-base font-extrabold text-[#0B4650]">{f.q}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-[#0B4650]/40 transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <div className="border-t border-[#0B4650]/8 px-5 pb-5 pt-4">
                  <p className="text-sm font-medium leading-relaxed text-[#0B4650]/75">{f.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-[#0B4650] text-balance sm:text-4xl">
            Stop Googling. Start preparing.
          </h2>
          <p className="mt-4 text-base font-medium text-[#0B4650]/75 sm:text-lg">
            Give your team the roadmap the top teams already use.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a
              href={COURSE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-linear-to-r from-[#F28F6B] to-[#FF9A78] px-8 py-3.5 text-base font-extrabold text-[#0B4650] shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl active:scale-[0.99] sm:w-auto sm:min-h-0 sm:py-4"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
              <Rocket className="relative h-5 w-5 shrink-0" aria-hidden />
              <span className="relative">Enroll now — ৳2,499</span>
              <ArrowRight className="relative h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </a>
            <Link href="/" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[#0B4650]/15 bg-white/70 px-8 py-3.5 text-base font-semibold text-[#0B4650] shadow-sm backdrop-blur-xl transition-colors hover:border-[#0B4650]/25 hover:bg-white sm:w-auto sm:min-h-0 sm:py-4">
              Back to Kytalist
            </Link>
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-[#0B4650]/75">Recorded · Lifetime access · Certificate included</p>
        </div>
      </section>

      {/* STICKY MOBILE ENROLL BAR */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#0B4650]/10 bg-white/95 px-4 py-3 backdrop-blur-xl md:hidden">
        <a
          href={COURSE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex w-full items-center justify-between overflow-hidden rounded-full bg-linear-to-r from-[#F28F6B] to-[#FF9A78] px-5 py-3 text-sm font-extrabold text-[#0B4650] shadow-lg"
        >
          <span className="flex items-center gap-2">
            <Rocket className="h-4 w-4" aria-hidden />
            Enroll now
          </span>
          <span className="flex items-center gap-2">
            <span className="text-xs font-bold line-through opacity-60">৳5,000</span>
            <span>৳2,499</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
        </a>
      </div>
    </div>
  );
}
