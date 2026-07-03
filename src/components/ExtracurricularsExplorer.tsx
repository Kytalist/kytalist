"use client";

import {
  CheckCircle2,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
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

type ActiveFilter = {
  key: string;
  label: string;
  onClear: () => void;
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

  const [filters, setFilters] = useState<ListingsFilters>(initialFilters);
  const [queryDraft, setQueryDraft] = useState(initialFilters.q);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const pushFilters = (next: ListingsFilters) => {
    setFilters(next);
    const qs = new URLSearchParams(filtersToQuery(next)).toString();
    const url = qs ? `${hrefBase}?${qs}` : hrefBase;
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

  const activeFilters: ActiveFilter[] = [];
  if (filters.type !== "All") {
    activeFilters.push({
      key: "type",
      label: `Category: ${filters.type}`,
      onClear: () => pushFilters({ ...filters, type: "All" }),
    });
  }
  if (filters.cost !== "Any cost") {
    activeFilters.push({
      key: "cost",
      label: `Cost: ${filters.cost}`,
      onClear: () => pushFilters({ ...filters, cost: "Any cost" }),
    });
  }
  if (filters.grade !== "All") {
    activeFilters.push({
      key: "grade",
      label: `Grade ${filters.grade}`,
      onClear: () => pushFilters({ ...filters, grade: "All" }),
    });
  }
  if (filters.region !== "All regions") {
    activeFilters.push({
      key: "region",
      label: filters.region,
      onClear: () => pushFilters({ ...filters, region: "All regions" }),
    });
  }
  if (filters.q.trim()) {
    activeFilters.push({
      key: "q",
      label: `Search: ${filters.q}`,
      onClear: () => {
        setQueryDraft("");
        pushFilters({ ...filters, q: "" });
      },
    });
  }

  return (
    <div className="space-y-7">
      <section className="overflow-hidden rounded-3xl border border-white/85 bg-white/72 shadow-[0_12px_18px_-16px_rgba(11,70,80,0.35)] backdrop-blur-xl">
        <div className="flex flex-col gap-5 border-b border-[#0B4650]/10 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 rounded-full bg-[#E0F2F1] px-3 py-1 text-xs font-bold text-[#0B4650]">
              <Sparkles className="h-3.5 w-3.5 text-[#F28F6B]" aria-hidden />
              Catalog controls
            </p>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-[#0B4650]/65">
              Search, sort, and narrow the board without losing your place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[#0B4650]/70">
            <span className="rounded-full bg-[#0B4650] px-3 py-1.5 font-bold text-white">
              {total} {total === 1 ? "result" : "results"}
            </span>
            {activeFilterCount > 0 ? (
              <span className="rounded-full bg-[#F28F6B]/18 px-3 py-1.5 text-[#8C3F24]">
                {activeFilterCount} active{" "}
                {activeFilterCount === 1 ? "filter" : "filters"}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#A3E4D7]/28 px-3 py-1.5 text-[#0B4650]">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                Showing everything
              </span>
            )}
            {isPending ? (
              <span className="rounded-full bg-white px-3 py-1.5 text-[#0B4650]/45 ring-1 ring-[#0B4650]/8">
                Updating…
              </span>
            ) : null}
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="relative flex-1">
              <span className="sr-only">Search extracurriculars</span>
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0B4650]/42"
                aria-hidden
              />
              <input
                type="search"
                value={queryDraft}
                onChange={(e) => setQueryDraft(e.target.value)}
                placeholder="Search title, organization, tag, or location…"
                className="min-h-12 w-full rounded-2xl border border-[#0B4650]/12 bg-[#F9F8F6]/80 py-3 pl-11 pr-4 text-sm font-semibold text-[#0B4650] placeholder:text-[#0B4650]/50 outline-none transition-colors focus:border-[#0B4650]/35 focus:bg-white"
              />
            </label>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
              <SelectControl
                label="Region"
                value={filters.region}
                onChange={(value) => pushFilters({ ...filters, region: value })}
              >
                {regionOptions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </SelectControl>

              <SelectControl
                label="Sort"
                value={filters.sort}
                onChange={(value) =>
                  pushFilters({
                    ...filters,
                    sort: value as ListingsSort,
                  })
                }
              >
                {sortOptionList.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </SelectControl>

              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="col-span-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#0B4650]/12 bg-white/80 px-4 py-3 text-sm font-bold text-[#0B4650] transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B4650]/20 sm:col-span-1 lg:hidden"
                aria-expanded={mobileOpen}
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden />
                Filters
                {activeFilterCount > 0 ? (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F28F6B] px-1.5 text-[11px] font-bold text-white">
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

          {activeFilters.length > 0 ? (
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#0B4650]/10 pt-4">
              <span className="mr-1 text-xs font-bold uppercase tracking-wider text-[#0B4650]/45">
                Active
              </span>
              {activeFilters.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={filter.onClear}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#0B4650]/6 px-3 py-1.5 text-xs font-bold text-[#0B4650] transition-colors hover:bg-[#0B4650]/10 focus:outline-none focus:ring-2 focus:ring-[#0B4650]/20"
                >
                  {filter.label}
                  <X className="h-3.5 w-3.5" aria-hidden />
                </button>
              ))}
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#0B4650]/15 bg-white/70 px-3 py-1.5 text-xs font-bold text-[#0B4650]
 transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B4650]/20"
              >
                Clear all
              </button>
            </div>
          ) : null}
        </div>
      </section>

      {loadFailed ? (
        <div className="rounded-3xl border border-white/85 bg-white/74 p-10 text-center backdrop-blur-xl sm:p-12">
          <h3 className="font-display mb-2 text-xl font-bold text-[#0B4650]">
            Couldn&rsquo;t load programs right now
          </h3>
          <p className="mx-auto max-w-sm text-sm font-semibold leading-relaxed text-[#0B4650]/70">
            The catalog service is temporarily unavailable. Please refresh or
            try again in a moment.
          </p>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-white/85 bg-white/74 p-10 text-center backdrop-blur-xl sm:p-12">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#A3E4D7]/30 text-[#0B4650]">
            <Search className="h-6 w-6" aria-hidden />
          </span>
          <h3 className="font-display mb-2 text-xl font-bold text-[#0B4650]">
            No matches just yet
          </h3>
          <p className="mx-auto max-w-sm text-sm font-semibold leading-relaxed text-[#0B4650]/70">
            Try broadening your grade, region, or cost filters — or clear them
            all to see the full list.
          </p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0B4650] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#062E35] focus:outline-none focus:ring-2 focus:ring-[#0B4650]/30"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,21rem),1fr))] gap-5">
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

function SelectControl({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-12 w-full rounded-2xl border border-[#0B4650]/12 bg-white/80 px-3 py-3 text-sm font-bold text-[#0B4650] outline-none transition-colors focus:border-[#0B4650]/35 focus:bg-white sm:min-w-38"
      >
        {children}
      </select>
    </label>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
      <span className="w-22 shrink-0 pt-1 text-[11px] font-bold uppercase tracking-wider text-[#0B4650]/50">
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
      className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B4650]/20 ${
        active
          ? "bg-[#0B4650] text-white"
          : "bg-white/75 text-[#0B4650]/72 hover:bg-white hover:text-[#0B4650]"
      }`}
    >
      {children}
    </button>
  );
}
