/**
 * Static catalog metadata used as fallbacks when the API is unreachable.
 *
 * Live values now come from `GET /api/v1/meta` via `src/lib/api/meta.ts`;
 * components should prefer those when available.
 *
 * Listing types are re-exported from `src/lib/api/types.ts` so existing
 * imports of `Listing`, `ExtracurricularType`, `CostOption` keep working.
 */

import type { Listing, Meta, SortOption } from "@/lib/api/types";

export type {
  CostOption,
  ExtracurricularType,
  Listing,
  ListingCategory,
  ListingsSort,
  Meta,
  SortOption,
} from "@/lib/api/types";

export const extracurricularTypes = [
  "All",
  "Olympiad",
  "Quiz",
  "LocalFairs",
  "Research",
  "WritingCompetition",
  "Debate",
  "Internship",
  "Mentorship",
  "TechContest",
  "Hackathon",
  "Startup",
  "FilmArt",
  "ExchangeProgram",
  "Conference",
  "MUN",
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
  "Nationwide",
  "Local",
  "International",
] as const;

export type ListingFilterOptions = {
  regions: readonly string[];
  extracurricularTypes: readonly string[];
  costOptions: readonly string[];
  gradeOptions: readonly number[];
  sortOptions: readonly SortOption[];
};

export const defaultListingFilterOptions: ListingFilterOptions = {
  regions,
  extracurricularTypes,
  costOptions,
  gradeOptions,
  sortOptions,
};

function mergeStringOptions(
  sentinel: string,
  ...groups: Array<readonly (string | null | undefined)[] | null | undefined>
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];

  const add = (value: string | null | undefined) => {
    const trimmed = value?.trim();
    if (!trimmed) return;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    out.push(trimmed);
  };

  add(sentinel);
  for (const group of groups) {
    for (const value of group ?? []) add(value);
  }

  return out;
}

function mergeNumberOptions(
  ...groups: Array<readonly (number | null | undefined)[] | null | undefined>
): number[] {
  const seen = new Set<number>();
  const out: number[] = [];

  for (const group of groups) {
    for (const value of group ?? []) {
      if (typeof value !== "number" || !Number.isFinite(value)) continue;
      if (seen.has(value)) continue;
      seen.add(value);
      out.push(value);
    }
  }

  return out.sort((a, b) => a - b);
}

function mergeSortOptions(
  ...groups: Array<readonly SortOption[] | null | undefined>
): SortOption[] {
  const seen = new Set<string>();
  const out: SortOption[] = [];

  for (const group of groups) {
    for (const option of group ?? []) {
      if (!option.value || !option.label || seen.has(option.value)) continue;
      seen.add(option.value);
      out.push(option);
    }
  }

  return out;
}

export function mergeListingFilterOptions(
  meta: Meta | null | undefined,
  items: readonly Listing[] = [],
): ListingFilterOptions {
  return {
    regions: mergeStringOptions(
      "All regions",
      regions,
      meta?.regions,
      items.map((item) => item.region),
    ),
    extracurricularTypes: mergeStringOptions(
      "All",
      extracurricularTypes,
      meta?.extracurricularTypes,
      items.map((item) => item.type),
    ),
    costOptions: mergeStringOptions(
      "Any cost",
      costOptions,
      meta?.costOptions,
      items.map((item) => item.cost),
    ),
    gradeOptions: mergeNumberOptions(
      gradeOptions,
      meta?.gradeOptions,
      items.flatMap((item) => item.grades ?? []),
    ),
    sortOptions: mergeSortOptions(sortOptions, meta?.sortOptions),
  };
}
