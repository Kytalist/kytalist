"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { ExtracurricularCard } from "@/components/ExtracurricularCard";
import {
  countActiveFilters,
  filtersToQuery,
  type ListingsFilters,
} from "@/lib/api/searchParams";
import type { Listing } from "@/lib/api/types";
import {
  defaultListingFilterOptions,
  sortOptions,
  type ListingFilterOptions,
  type ListingsSort,
} from "@/lib/data";

type Props = {
  items: Listing[];
  total: number;
  initialFilters: ListingsFilters;
  hrefBase: string;
  filterOptions?: ListingFilterOptions;
  loadFailed?: boolean;
};

export function ExtracurricularsExplorer({
  items,
  total,
  initialFilters,
  hrefBase,
  filterOptions = defaultListingFilterOptions,
  loadFailed = false,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [filters, setFilters] = useState<ListingsFilters>(initialFilters);
  const [queryDraft, setQueryDraft] = useState(initialFilters.q);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Keep local state aligned if the server hands down new initial filters
  // (e.g. user navigates back/forward).
  useEffect(() => {
    setFilters(initialFilters);
    setQueryDraft(initialFilters.q);
  }, [initialFilters]);

  const pushFilters = (next: ListingsFilters) => {
    setFilters(next);
    const qs = new URLSearchParams(filtersToQuery(next)).toString();
    const url = qs ? `${pathname}?${qs}` : pathname;
    startTransition(() => {
      router.replace(url, { scroll: false });
    });
  };

  // Debounce search input -> URL.
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (queryDraft === filters.q) return;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      pushFilters({ ...filters, q: queryDraft });
    }, 250);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryDraft]);

  const activeFilterCount = countActiveFilters(filters);
  const regionOptions = includeStringOption(
    filterOptions.regions,
    filters.region,
    "All regions",
  );
  const typeOptions = includeStringOption(
    filterOptions.extracurricularTypes,
    filters.type,
    "All",
  );
  const costOptionList = includeStringOption(
    filterOptions.costOptions,
    filters.cost,
    "Any cost",
  );
  const gradeOptionList = includeNumberOption(
    filterOptions.gradeOptions,
    filters.grade,
  );
  const sortOptionList = filterOptions.sortOptions.length
    ? filterOptions.sortOptions
    : sortOptions;

  const clearAll = () => {
    const cleared: ListingsFilters = {
      type: "All",
      cost: "Any cost",
      grade: "All",
      region: "All regions",
      q: "",
      sort: filters.sort,
    };
    setQueryDraft("");
    pushFilters(cleared);
  };

  return (
    <div className="space-y-8">
      <div className="card-surface squircle p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search extracurriculars</span>
            <Search
              className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0B4650]/40"
              aria-hidden
            />
            <input
              type="search"
              value={queryDraft}
              onChange={(e) => setQueryDraft(e.target.value)}
              placeholder="Search by title, org, tag, or location…"
              className="w-full rounded-full border border-[#0B4650]/10 bg-white/80 py-3.5 pl-12 pr-4 text-sm font-medium text-[#0B4650] placeholder:text-[#0B4650]/40 shadow-inner outline-none transition-colors focus:border-[#0B4650]/30 focus:bg-white"
            />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filters.region}
              onChange={(e) =>
                pushFilters({ ...filters, region: e.target.value })
              }
              className="rounded-full border border-[#0B4650]/10 bg-white/80 px-4 py-3 text-sm font-semibold text-[#0B4650] outline-none transition-colors focus:border-[#0B4650]/30 focus:bg-white"
            >
              {regionOptions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <select
              value={filters.sort}
              onChange={(e) =>
                pushFilters({
                  ...filters,
                  sort: e.target.value as ListingsSort,
                })
              }
              className="rounded-full border border-[#0B4650]/10 bg-white/80 px-4 py-3 text-sm font-semibold text-[#0B4650] outline-none transition-colors focus:border-[#0B4650]/30 focus:bg-white"
            >
              {sortOptionList.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full border border-[#0B4650]/10 bg-white/80 px-4 py-3 text-sm font-semibold text-[#0B4650] transition-colors hover:bg-white lg:hidden"
              aria-expanded={mobileOpen}
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden />
              Filters
              {activeFilterCount > 0 ? (
                <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#F28F6B] px-1.5 text-[11px] font-bold text-white">
                  {activeFilterCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        <div
          className={`${mobileOpen ? "mt-5 flex" : "mt-5 hidden lg:flex"} flex-col gap-4 border-t border-[#0B4650]/10 pt-5`}
        >
          <FilterRow label="Category">
            {typeOptions.map((t) => (
              <FilterChip
                key={t}
                active={filters.type === t}
                onClick={() =>
                  pushFilters({
                    ...filters,
                    type: t as ListingsFilters["type"],
                  })
                }
              >
                {t}
              </FilterChip>
            ))}
          </FilterRow>

          <FilterRow label="Cost">
            {costOptionList.map((c) => (
              <FilterChip
                key={c}
                active={filters.cost === c}
                onClick={() =>
                  pushFilters({
                    ...filters,
                    cost: c as ListingsFilters["cost"],
                  })
                }
              >
                {c}
              </FilterChip>
            ))}
          </FilterRow>

          <FilterRow label="Grade">
            <FilterChip
              active={filters.grade === "All"}
              onClick={() => pushFilters({ ...filters, grade: "All" })}
            >
              All
            </FilterChip>
            {gradeOptionList.map((g) => (
              <FilterChip
                key={g}
                active={filters.grade === g}
                onClick={() => pushFilters({ ...filters, grade: g })}
              >
                {g}th
              </FilterChip>
            ))}
          </FilterRow>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[#0B4650]/70">
          <span className="font-display text-lg font-bold text-[#0B4650]">
            {total}
          </span>
          <span className="ml-1.5">
            {total === 1 ? "opportunity" : "opportunities"} found
          </span>
          {activeFilterCount > 0 ? (
            <span className="ml-1.5 text-[#0B4650]/50">
              · {activeFilterCount} active{" "}
              {activeFilterCount === 1 ? "filter" : "filters"}
            </span>
          ) : null}
          {isPending ? (
            <span className="ml-2 text-xs font-medium text-[#0B4650]/40">
              Updating…
            </span>
          ) : null}
        </p>
        {activeFilterCount > 0 ? (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#0B4650]/15 bg-white/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0B4650] transition-colors hover:bg-white"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
            Clear all
          </button>
        ) : null}
      </div>

      {loadFailed ? (
        <div className="card-surface squircle flex flex-col items-center justify-center p-12 text-center">
          <h3 className="font-display mb-2 text-xl font-bold text-[#0B4650]">
            Couldn&rsquo;t load programs right now
          </h3>
          <p className="max-w-sm text-sm font-medium text-[#0B4650]/70">
            The catalog service is temporarily unavailable. Please refresh or
            try again in a moment.
          </p>
        </div>
      ) : items.length === 0 ? (
        <div className="card-surface squircle flex flex-col items-center justify-center p-12 text-center">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#A3E4D7]/30 text-[#0B4650]">
            <Search className="h-6 w-6" aria-hidden />
          </span>
          <h3 className="font-display mb-2 text-xl font-bold text-[#0B4650]">
            No matches just yet
          </h3>
          <p className="max-w-sm text-sm font-medium text-[#0B4650]/70">
            Try broadening your grade, region, or cost filters — or clear them
            all to see the full list.
          </p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0B4650] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#062E35]"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} id={item.id} className="scroll-mt-36">
              <ExtracurricularCard item={item} hrefBase={hrefBase} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function includeStringOption(
  options: readonly string[],
  value: string,
  sentinel: string,
): readonly string[] {
  if (value === sentinel || options.includes(value)) return options;
  return [...options, value];
}

function includeNumberOption(
  options: readonly number[],
  value: number | "All",
): readonly number[] {
  if (value === "All" || options.includes(value)) return options;
  return [...options, value].sort((a, b) => a - b);
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <span className="w-20 shrink-0 text-[11px] font-bold uppercase tracking-wider text-[#0B4650]/50">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
        active
          ? "bg-[#0B4650] text-white shadow-sm"
          : "bg-white/70 text-[#0B4650]/70 hover:bg-white hover:text-[#0B4650]"
      }`}
    >
      {children}
    </button>
  );
}
