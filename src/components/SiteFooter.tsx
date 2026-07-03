import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  GraduationCap,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

type FooterLink = {
  label: string;
  href: string;
  description: string;
};

type DetailChip = {
  label: string;
  icon: LucideIcon;
};

const supportLinks: FooterLink[] = [
  {
    label: "Submit a program",
    href: "mailto:kytalist.xyz@gmail.com?subject=Program%20submission",
    description: "Share a student opportunity for review.",
  },
  {
    label: "Suggest a correction",
    href: "mailto:kytalist.xyz@gmail.com?subject=Listing%20correction",
    description: "Help us update deadlines or eligibility.",
  },
  {
    label: "Partner with Kytalist",
    href: "mailto:kytalist.xyz@gmail.com?subject=Kytalist%20partnership",
    description: "Reach students with relevant programs.",
  },
];

const trackedDetails: DetailChip[] = [
  { label: "Deadlines", icon: CalendarClock },
  { label: "Eligibility", icon: GraduationCap },
  { label: "Cost", icon: CircleDollarSign },
  { label: "Location", icon: MapPin },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden border-t border-[#0B4650]/10 bg-[#F9F8F6]">
      <div
        className="pointer-events-none absolute -left-24 top-12 h-72 w-72 rounded-full bg-[#A3E4D7]/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-16 h-80 w-80 rounded-full bg-[#F28F6B]/14 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-360 px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.45fr)] lg:gap-6">
          <section className="rounded-3xl border border-white/85 bg-white/64 p-5 backdrop-blur-xl sm:p-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0B4650]/20"
            >
              <Image
                src="/images/Kytalist_profile_light.png"
                alt="Kytalist Logo"
                width={44}
                height={44}
                className="rounded-[20%]"
              />
              <span className="font-display text-xl font-extrabold tracking-tight text-[#0B4650]">
                Kytalist<span className="text-[#F28F6B]">.</span>
              </span>
            </Link>

            <h2 className="font-display mt-6 max-w-lg text-2xl font-extrabold leading-tight tracking-[-0.025em] text-[#0B4650] text-balance sm:text-3xl">
              A calmer way to find opportunities worth applying to.
            </h2>
            <p className="mt-4 max-w-lg text-sm font-semibold leading-relaxed text-[#0B4650]/70 text-pretty">
              Kytalist organizes student programs, competitions, internships,
              research calls, and global opportunities so students can compare
              fit before deadlines pass.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {trackedDetails.map((detail) => (
                <span
                  key={detail.label}
                  className="inline-flex items-center gap-2 rounded-full bg-[#F9F8F6]/90 px-3 py-2 text-xs font-bold text-[#0B4650]/72 ring-1 ring-[#0B4650]/8"
                >
                  <detail.icon
                    className="h-3.5 w-3.5 text-[#F28F6B]"
                    aria-hidden
                  />
                  {detail.label}
                </span>
              ))}
            </div>

            <Link
              href="/activities"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0B4650] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#062E35] focus:outline-none focus:ring-2 focus:ring-[#0B4650]/30"
            >
              Open the catalog
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </section>

          <div className="grid gap-5 xl:grid-cols-2">
            <section className="rounded-3xl border border-white/85 bg-white/56 p-5 backdrop-blur-xl sm:p-6">
              <p className="inline-flex items-center gap-2 rounded-full bg-[#E0F2F1] px-3 py-1.5 text-xs font-bold text-[#0B4650]">
                <ClipboardCheck
                  className="h-3.5 w-3.5 text-[#F28F6B]"
                  aria-hidden
                />
                How to use Kytalist
              </p>
              <ol className="mt-5 space-y-4">
                <FooterStep
                  step="1"
                  title="Scan what fits"
                  text="Start broad, then narrow by deadline, grade, cost, region, and format."
                />
                <FooterStep
                  step="2"
                  title="Compare the essentials"
                  text="Use each card to check organizer, timing, eligibility, and next action quickly."
                />
                <FooterStep
                  step="3"
                  title="Verify and apply"
                  text="Open the organizer page before applying so requirements are current."
                />
              </ol>
            </section>

            <section className="rounded-3xl border border-white/85 bg-white/56 p-5 backdrop-blur-xl sm:p-6">
              <p className="inline-flex items-center gap-2 rounded-full bg-[#FFE4C4]/80 px-3 py-1.5 text-xs font-bold text-[#8C3F24]">
                <Mail className="h-3.5 w-3.5" aria-hidden />
                Organizers & updates
              </p>
              <div className="mt-5 space-y-3">
                {supportLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="group block rounded-2xl bg-[#F9F8F6]/82 p-3 ring-1 ring-[#0B4650]/8 transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B4650]/20"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-display text-sm font-extrabold text-[#0B4650]">
                        {link.label}
                      </span>
                      <ArrowRight
                        className="h-4 w-4 shrink-0 text-[#0B4650]/35 transition-transform group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </span>
                    <span className="mt-1 block text-xs font-semibold leading-relaxed text-[#0B4650]/58">
                      {link.description}
                    </span>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>

        <section className="mt-5 rounded-3xl border border-white/85 bg-white/54 p-5 backdrop-blur-xl sm:p-6">
          <div className="grid gap-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-[#0B4650] px-3 py-1.5 text-xs font-bold text-white">
                <ShieldCheck
                  className="h-3.5 w-3.5 text-[#FFD3B6]"
                  aria-hidden
                />
                Verification note
              </p>
              <h2 className="font-display mt-3 text-xl font-extrabold text-[#0B4650]">
                Details move fast. We keep the interface calm.
              </h2>
            </div>
            <ul className="grid gap-3 text-sm font-semibold leading-relaxed text-[#0B4650]/68 sm:grid-cols-2">
              <FooterCheck text="Deadlines, fees, and eligibility can change after a listing is published." />
              <FooterCheck text="Always confirm the final requirements on the organizer’s official page." />
            </ul>
          </div>
        </section>

        <div className="mt-8 flex flex-col gap-4 border-t border-[#0B4650]/10 pt-6 text-sm font-semibold text-[#0B4650]/58 md:flex-row md:items-center md:justify-between">
          <p>© {year} Kytalist. Curated for student discovery.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#F28F6B]" aria-hidden />
              No sign-up required
            </span>
            <a
              href="mailto:kytalist.xyz@gmail.com"
              className="inline-flex items-center gap-1.5 text-[#0B4650]/70 underline-offset-4 hover:text-[#0B4650] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0B4650]/20"
            >
              <Mail className="h-3.5 w-3.5" aria-hidden />
              kytalist.xyz@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterStep({
  step,
  title,
  text,
}: {
  step: string;
  title: string;
  text: string;
}) {
  return (
    <li className="flex gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0B4650] text-xs font-black text-white">
        {step}
      </span>
      <span>
        <span className="block font-display text-sm font-extrabold text-[#0B4650]">
          {title}
        </span>
        <span className="mt-1 block text-sm font-semibold leading-relaxed text-[#0B4650]/64">
          {text}
        </span>
      </span>
    </li>
  );
}

function FooterCheck({ text }: { text: string }) {
  return (
    <li className="flex gap-2 rounded-2xl bg-[#F9F8F6]/78 p-3 ring-1 ring-[#0B4650]/8">
      <CheckCircle2
        className="mt-0.5 h-4 w-4 shrink-0 text-[#0B8A6B]"
        aria-hidden
      />
      <span>{text}</span>
    </li>
  );
}
