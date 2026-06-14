import type {
  CostOption,
  ExtracurricularType,
  ListingCategory,
  ListingsListParams,
  ListingsSort,
} from "./types";

const TYPE_VALUES = new Set<ExtracurricularType>([
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
]);

const COST_VALUES = new Set<CostOption>(["Free", "Paid", "Stipend"]);

const SORT_VALUES = new Set<ListingsSort>(["deadline", "alpha", "recent"]);

const GRADE_VALUES = new Set<number>([9, 10, 11, 12]);

export type RawSearchParams = Record<string, string | string[] | undefined>;

export type ListingsFilters = {
  type: ExtracurricularType | "All";
  cost: CostOption | "Any cost";
  grade: number | "All";
  region: string;
  q: string;
  sort: ListingsSort;
};

function pickString(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

/**
 * Parse a Next.js searchParams object into well-typed listing filters.
 * Unknown / "All"-style values fall back to the inclusive defaults the UI
 * displays when nothing is selected.
 */
export function parseListingsFilters(raw: RawSearchParams): ListingsFilters {
  const typeRaw = pickString(raw["type"]);
  const type =
    typeRaw && TYPE_VALUES.has(typeRaw as ExtracurricularType)
      ? (typeRaw as ExtracurricularType)
      : "All";

  const costRaw = pickString(raw["cost"]);
  const cost =
    costRaw && COST_VALUES.has(costRaw as CostOption)
      ? (costRaw as CostOption)
      : "Any cost";

  const gradeRaw = pickString(raw["grade"]);
  let grade: number | "All" = "All";
  if (gradeRaw) {
    const n = Number(gradeRaw);
    if (Number.isInteger(n) && GRADE_VALUES.has(n)) {
      grade = n;
    }
  }

  const regionRaw = pickString(raw["region"])?.trim();
  const region =
    regionRaw && regionRaw !== "All regions" ? regionRaw : "All regions";

  const q = pickString(raw["q"])?.trim() ?? "";

  const sortRaw = pickString(raw["sort"]);
  const sort =
    sortRaw && SORT_VALUES.has(sortRaw as ListingsSort)
      ? (sortRaw as ListingsSort)
      : "deadline";

  return { type, cost, grade, region, q, sort };
}

/**
 * Build the API call params from parsed filters + a fixed category.
 * Inclusive sentinels ("All", "Any cost", "All regions") are dropped.
 */
export function filtersToListParams(
  filters: ListingsFilters,
  category: ListingCategory | "all" = "all",
  extra: Pick<ListingsListParams, "limit" | "offset"> = {},
): ListingsListParams {
  const params: ListingsListParams = { category, sort: filters.sort };
  if (filters.type !== "All") params.type = filters.type;
  if (filters.cost !== "Any cost") params.cost = filters.cost;
  if (filters.grade !== "All") params.grade = filters.grade;
  if (filters.region !== "All regions") params.region = filters.region;
  if (filters.q) params.q = filters.q;
  if (extra.limit !== undefined) params.limit = extra.limit;
  if (extra.offset !== undefined) params.offset = extra.offset;
  return params;
}

/**
 * Serialize filters into a URLSearchParams-ready record. Sentinel values
 * are omitted so the URL stays clean.
 */
export function filtersToQuery(
  filters: ListingsFilters,
): Record<string, string> {
  const out: Record<string, string> = {};
  if (filters.type !== "All") out["type"] = filters.type;
  if (filters.cost !== "Any cost") out["cost"] = filters.cost;
  if (filters.grade !== "All") out["grade"] = String(filters.grade);
  if (filters.region !== "All regions") out["region"] = filters.region;
  if (filters.q) out["q"] = filters.q;
  if (filters.sort !== "deadline") out["sort"] = filters.sort;
  return out;
}

export function countActiveFilters(filters: ListingsFilters): number {
  let n = 0;
  if (filters.type !== "All") n++;
  if (filters.cost !== "Any cost") n++;
  if (filters.grade !== "All") n++;
  if (filters.region !== "All regions") n++;
  if (filters.q.trim()) n++;
  return n;
}
