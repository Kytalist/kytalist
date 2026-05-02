"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ExtracurricularCard } from "@/components/ExtracurricularCard";
import {
  costOptions,
  extracurricularTypes,
  gradeOptions,
  regions,
  sortOptions,
  type Listing,
} from "@/lib/data";

type Props = {
  items: Listing[];
  hrefBase: string;
};

type SortValue = (typeof sortOptions)[number]["value"];

export function ExtracurricularsExplorer({ items, hrefBase }: Props) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<(typeof extracurricularTypes)[number]>("All");
  const [cost, setCost] = useState<(typeof costOptions)[number]>("Any cost");
  const [grade, setGrade] = useState<number | "All">("All");
  const [region, setRegion] = useState<(typeof regions)[number]>("All regions");
  const [sort, setSort] = useState<SortValue>("deadline");
  const [mobileOpen, setMobileOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const result = items.filter((item) => {
      if (type !== "All" && item.type !== type) return false;
      if (cost !== "Any cost" && item.cost !== cost) return false;
      if (grade !== "All" && !item.grades?.includes(grade)) return false;
      if (region !== "All regions" && item.region !== region) return false;

      if (q) {
        const haystack = [
          item.title,
          item.org,
          item.location,
          item.description,
          item.type ?? "",
          item.badge,
          ...(item.tags ?? []),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    const sorted = [...result];
    if (sort === "alpha") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "deadline") {
      sorted.sort((a, b) => {
        const aHas = a.deadline ? 0 : 1;
        const bHas = b.deadline ? 0 : 1;
        if (aHas !== bHas) return aHas - bHas;
        return (a.deadline ?? "").localeCompare(b.deadline ?? "");
      });
    }
    return sorted;
  }, [items, type, cost, grade, region, query, sort]);

  const activeFilterCount =
    (type !== "All" ? 1 : 0) +
    (cost !== "Any cost" ? 1 : 0) +
    (grade !== "All" ? 1 : 0) +
    (region !== "All regions" ? 1 : 0) +
    (query.trim() ? 1 : 0);

  const clearAll = () => {
    setQuery("");
    setType("All");
    setCost("Any cost");
    setGrade("All");
    setRegion("All regions");
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
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, org, tag, or location…"
              className="w-full rounded-full border border-[#0B4650]/10 bg-white/80 py-3.5 pl-12 pr-4 text-sm font-medium text-[#0B4650] placeholder:text-[#0B4650]/40 shadow-inner outline-none transition-colors focus:border-[#0B4650]/30 focus:bg-white"
            />
          </label>

          <div className="flex items-center gap-2">
            <select
              value={region}
              onChange={(e) =>
                setRegion(e.target.value as (typeof regions)[number])
              }
              className="rounded-full border border-[#0B4650]/10 bg-white/80 px-4 py-3 text-sm font-semibold text-[#0B4650] outline-none transition-colors focus:border-[#0B4650]/30 focus:bg-white"
            >
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortValue)}
              className="rounded-full border border-[#0B4650]/10 bg-white/80 px-4 py-3 text-sm font-semibold text-[#0B4650] outline-none transition-colors focus:border-[#0B4650]/30 focus:bg-white"
            >
              {sortOptions.map((s) => (
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
            {extracurricularTypes.map((t) => (
              <FilterChip
                key={t}
                active={type === t}
                onClick={() => setType(t)}
              >
                {t}
              </FilterChip>
            ))}
          </FilterRow>

          <FilterRow label="Cost">
            {costOptions.map((c) => (
              <FilterChip
                key={c}
                active={cost === c}
                onClick={() => setCost(c)}
              >
                {c}
              </FilterChip>
            ))}
          </FilterRow>

          <FilterRow label="Grade">
            <FilterChip
              active={grade === "All"}
              onClick={() => setGrade("All")}
            >
              All
            </FilterChip>
            {gradeOptions.map((g) => (
              <FilterChip
                key={g}
                active={grade === g}
                onClick={() => setGrade(g)}
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
            {filtered.length}
          </span>
          <span className="ml-1.5">
            {filtered.length === 1 ? "opportunity" : "opportunities"} found
          </span>
          {activeFilterCount > 0 ? (
            <span className="ml-1.5 text-[#0B4650]/50">
              · {activeFilterCount} active{" "}
              {activeFilterCount === 1 ? "filter" : "filters"}
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

      {filtered.length === 0 ? (
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
          {filtered.map((item) => (
            <div key={item.id} id={item.id} className="scroll-mt-36">
              <ExtracurricularCard item={item} hrefBase={hrefBase} />
            </div>
          ))}
        </div>
      )}
    </div>
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
