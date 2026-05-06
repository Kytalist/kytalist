/**
 * Deterministic visual helpers for backend rows that don't carry their own
 * styling fields (e.g. listing logo tints, testimonial avatar colors).
 *
 * The same input always produces the same output, so colors stay stable
 * across renders and SSR / CSR.
 */

const LOGO_PALETTE = [
  { tint: "bg-[#0B4650]", text: "text-white" },
  { tint: "bg-[#F28F6B]", text: "text-white" },
  { tint: "bg-[#5E3BB4]", text: "text-white" },
  { tint: "bg-[#0B2E35]", text: "text-white" },
  { tint: "bg-[#B4532A]", text: "text-white" },
  { tint: "bg-white border border-[#0B4650]/15", text: "text-[#0B4650]" },
] as const;

const TAG_PALETTE = [
  "text-[#5E3BB4]",
  "text-[#0B8A6B]",
  "text-[#B4532A]",
  "text-[#0B4650]",
] as const;

const TESTIMONIAL_PALETTE = [
  { tint: "bg-[#E0F2F1]", accent: "text-[#0B4650]" },
  { tint: "bg-[#FFE4C4]/80", accent: "text-[#B4532A]" },
  { tint: "bg-[#A3E4D7]/50", accent: "text-[#0B4650]" },
  { tint: "bg-[#F3E8FF]", accent: "text-[#5E3BB4]" },
] as const;

function hashString(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i++) {
    h = (h * 31 + value.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function deriveInitials(source: string, max = 3): string {
  const cleaned = source
    .replace(/[^A-Za-z0-9 ]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (cleaned.length === 0) return "?";
  if (cleaned.length === 1) {
    const word = cleaned[0] ?? "";
    return word.slice(0, Math.min(max, 2)).toUpperCase();
  }
  return cleaned
    .slice(0, max)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function deriveLogoStyle(seed: string): {
  tint: string;
  text: string;
} {
  const idx = hashString(seed) % LOGO_PALETTE.length;
  return LOGO_PALETTE[idx] ?? LOGO_PALETTE[0]!;
}

export function deriveTagColor(seed: string): string {
  const idx = hashString(seed) % TAG_PALETTE.length;
  return TAG_PALETTE[idx] ?? TAG_PALETTE[0]!;
}

export function deriveTestimonialStyle(seed: string): {
  tint: string;
  accent: string;
} {
  const idx = hashString(seed) % TESTIMONIAL_PALETTE.length;
  return TESTIMONIAL_PALETTE[idx] ?? TESTIMONIAL_PALETTE[0]!;
}
