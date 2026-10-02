"use client";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useClientQueryRouter } from "@/hooks/use-client-query-router";
import { parsePage } from "@/lib/pagination";
import type { SearchParamsReader } from "@/lib/filter-values";
interface FilterQueryOptions<T> {
  path: string;
  parse: (params: SearchParamsReader, defaults?: T) => T;
  serialize: (filters: T, page: number, defaults?: T) => string;
  defaults?: T;
}

export function useFilterQueryState<T>({
  path,
  parse,
  serialize,
  defaults,
}: FilterQueryOptions<T>) {
  const searchParams = useSearchParams();
  const router = useClientQueryRouter();
  const filters = useMemo(
    () => parse(searchParams, defaults),
    [searchParams, parse, defaults],
  );
  const currentPage = parsePage(searchParams.get("page"));
  function navigate(nextFilters: T, page: number, scroll: boolean) {
    const query = serialize(nextFilters, parsePage(String(page)), defaults);
    router.push(`${path}${query ? `?${query}` : ""}`, { scroll });
  }
  return {
    filters,
    currentPage,
    searchParams,
    applyFilters: (next: T) => navigate(next, 1, false),
    resetFilters: () => router.push(path, { scroll: false }),
    changePage: (page: number) => navigate(filters, page, true),
  };
}
