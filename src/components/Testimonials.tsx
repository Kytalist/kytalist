import Image from "next/image";
import { Quote, Star } from "lucide-react";
import { getTestimonials } from "@/lib/api/testimonials";
import { safeFetch } from "@/lib/api/safeFetch";
import type { Testimonial } from "@/lib/api/types";
import { deriveInitials, deriveTestimonialStyle } from "@/lib/visual";

const STAR_RATING = 5;

/** Shown when the API is unreachable or returns no published rows (e.g. before `db:seed`). */
const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: "fallback-maya",
    name: "Maya Patel",
    role: "11th grade · Austin, TX",
    quote:
      "I found a robotics camp two states away that I never would have heard of otherwise. The filters made it so easy to pick one that actually fit my summer.",
    avatar: null,
    order: 1,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "fallback-jordan",
    name: "Jordan Reyes",
    role: "12th grade · Brooklyn, NY",
    quote:
      "Kytalist is the first place I've seen internships for high schoolers that aren't just resume-bait. I landed a paid research role at a local lab because of it.",
    avatar: null,
    order: 2,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "fallback-elena",
    name: "Elena Sørensen",
    role: "Parent · Minneapolis, MN",
    quote:
      "We used to spend whole weekends hunting for clubs. Now my daughter and I browse together for fifteen minutes and actually find things worth applying to.",
    avatar: null,
    order: 3,
    createdAt: "",
    updatedAt: "",
  },
];

export async function Testimonials() {
  const result = await safeFetch(() => getTestimonials(), "testimonials");
  const testimonials =
    result.ok && result.data.length > 0
      ? result.data
      : FALLBACK_TESTIMONIALS;

  return (
    <section className="relative pb-24 pt-4">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
        <div className="mb-10 flex flex-col gap-3 sm:mb-12">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#0B4650]/10 bg-white/50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0B4650] shadow-sm backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#F28F6B]" />
            Loved by students &amp; parents
          </span>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
            <h2 className="font-display max-w-xl text-3xl font-bold leading-tight tracking-tight text-[#0B4650] text-balance sm:text-4xl">
              Real stories from the{" "}
              <span className="text-gradient">Kytalist community.</span>
            </h2>
            <p className="max-w-sm text-[#0B4650]/65 text-pretty">
              A few notes from the students, parents, and counselors using
              Kytalist to plan what&rsquo;s next.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => {
            const style = deriveTestimonialStyle(t.id);
            const initials = deriveInitials(t.name, 2);
            return (
              <figure
                key={t.id}
                className="card-surface squircle group relative flex flex-col p-8"
              >
                <span
                  className="pointer-events-none absolute right-6 top-6 text-[#0B4650]/10 transition-colors group-hover:text-[#F28F6B]/40"
                  aria-hidden
                >
                  <Quote className="h-10 w-10 -scale-x-100" />
                </span>

                <div
                  className="mb-6 flex items-center gap-1 text-[#F28F6B]"
                  aria-label={`${STAR_RATING} out of 5 stars`}
                >
                  {Array.from({ length: STAR_RATING }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-current"
                      aria-hidden
                    />
                  ))}
                </div>

                <blockquote className="mb-8 text-base font-medium leading-relaxed text-[#0B4650]/80 text-pretty">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <figcaption className="mt-auto flex items-center gap-3 border-t border-[#0B4650]/10 pt-5">
                  {t.avatar ? (
                    <span className="relative flex h-11 w-11 shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={t.avatar}
                        alt=""
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </span>
                  ) : (
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${style.tint} font-display text-sm font-bold ${style.accent}`}
                      aria-hidden
                    >
                      {initials}
                    </span>
                  )}
                  <span className="flex flex-col">
                    <span className="font-display text-sm font-bold text-[#0B4650]">
                      {t.name}
                    </span>
                    {t.role ? (
                      <span className="text-xs font-medium text-[#0B4650]/60">
                        {t.role}
                      </span>
                    ) : null}
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
