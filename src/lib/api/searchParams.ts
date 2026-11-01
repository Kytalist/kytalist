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

export type RawSearchParams = Record<string, string | string[] | undefined>;

export type ListingsFilters = {
  type: ExtracurricularType[];
  cost: CostOption[];
  grade: string[];
  region: string;
  q: string;
  sort: ListingsSort;
  past: boolean;
};

function pickString(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function splitValues(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value.flatMap((v) => String(v).split(","));
  if (typeof value === "string") return value.split(",");
  return [];
}

/**
 * Parse a Next.js searchParams object into well-typed listing filters.
 */
export function parseListingsFilters(raw: RawSearchParams): ListingsFilters {
  const type = splitValues(raw["type"])
    .map((v) => v.trim())
    .filter((v) => TYPE_VALUES.has(v as ExtracurricularType))
    .map((v) => v as ExtracurricularType);

  const cost = splitValues(raw["cost"])
    .map((v) => v.trim())
    .filter((v) => COST_VALUES.has(v as CostOption))
    .map((v) => v as CostOption);

  const grade = splitValues(raw["grade"])
    .map((v) => v.trim())
    .filter((v) => v && v !== "All");

  const regionRaw = pickString(raw["region"])?.trim();
  const region =
    regionRaw && regionRaw !== "All regions" ? regionRaw : "All regions";

  const q = pickString(raw["q"])?.trim() ?? "";

  const sortRaw = pickString(raw["sort"]);
  const sort =
    sortRaw && SORT_VALUES.has(sortRaw as ListingsSort)
      ? (sortRaw as ListingsSort)
      : "deadline";

  const past = pickString(raw["past"]) === "true";

  return { type, cost, grade, region, q, sort, past };
}

/**
 * Build the API call params from parsed filters + a fixed category.
 */
export function filtersToListParams(
  filters: ListingsFilters,
  category: ListingCategory | "all" = "all",
  extra: Pick<ListingsListParams, "limit" | "offset"> = {},
): ListingsListParams {
  const params: ListingsListParams = { category, sort: filters.sort };
  if (filters.type.length) params.type = filters.type.join(",");
  if (filters.cost.length) params.cost = filters.cost.join(",");
  if (filters.grade.length) params.grade = filters.grade.join(",");
  if (filters.region !== "All regions") params.region = filters.region;
  if (filters.q) params.q = filters.q;
  if (filters.past) params.past = true;
  if (extra.limit !== undefined) params.limit = extra.limit;
  if (extra.offset !== undefined) params.offset = extra.offset;
  return params;
}

/**
 * Serialize filters into a URLSearchParams-ready record.
 */
export function filtersToQuery(
  filters: ListingsFilters,
): Record<string, string> {
  const out: Record<string, string> = {};
  if (filters.type.length) out["type"] = filters.type.join(",");
  if (filters.cost.length) out["cost"] = filters.cost.join(",");
  if (filters.grade.length) out["grade"] = filters.grade.join(",");
  if (filters.region !== "All regions") out["region"] = filters.region;
  if (filters.q) out["q"] = filters.q;
  if (filters.sort !== "deadline") out["sort"] = filters.sort;
  if (filters.past) out["past"] = "true";
  return out;
}

export function countActiveFilters(filters: ListingsFilters): number {
  let n = 0;
  if (filters.type.length) n++;
  if (filters.cost.length) n++;
  if (filters.grade.length) n++;
  if (filters.region !== "All regions") n++;
  if (filters.q.trim()) n++;
  return n;
}