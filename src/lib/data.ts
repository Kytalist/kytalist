/**
 * Static catalog metadata used as fallbacks when the API is unreachable.
 *
 * Live values now come from `GET /api/v1/meta` via `src/lib/api/meta.ts`;
 * components should prefer those when available.
 *
 * Listing types are re-exported from `src/lib/api/types.ts` so existing
 * imports of `Listing`, `ExtracurricularType`, `CostOption` keep working.
 */

export type {
  CostOption,
  ExtracurricularType,
  Listing,
  ListingCategory,
  ListingsSort,
} from "@/lib/api/types";

export const extracurricularTypes = [
  "All",
  "Competition",
  "Research",
  "Program",
  "Club",
  "Volunteer",
  "Leadership",
  "Arts",
  "STEM",
] as const;

export const costOptions = ["Any cost", "Free", "Paid", "Stipend"] as const;

export const gradeOptions = [9, 10, 11, 12] as const;

export const sortOptions = [
  { value: "deadline", label: "Deadline soonest" },
  { value: "alpha", label: "A → Z" },
  { value: "recent", label: "Recently added" },
] as const;

export const regions = [
  "All regions",
  "Northeast",
  "Southeast",
  "Midwest",
  "Southwest",
  "Pacific",
  "Mountain",
  "Nationwide",
] as const;
