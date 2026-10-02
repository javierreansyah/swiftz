"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useClientQueryRouter } from "@/hooks/use-client-query-router";
import { parsePage } from "@/lib/pagination";
import {
  TVSidebar,
  TVSections,
  TVFilteredResults,
  TVMobileFilterDrawer,
  TVFilterState,
  DEFAULT_TV_FILTERS,
} from "@/components/tv";
import { MediaListingSkeleton } from "@/components/common/media-listing-skeleton";

function TVContent() {
  const searchParams = useSearchParams();
  const router = useClientQueryRouter();

  // Parse filters from URL
  const sortByParam = searchParams.get("sort_by") || DEFAULT_TV_FILTERS.sort_by;
  const genresParam = searchParams.get("genres");
  const yearParam = searchParams.get("year") || "";
  const ratingParam = searchParams.get("rating");
  const pageParam = searchParams.get("page");

  const currentFilters: TVFilterState = {
    sort_by: sortByParam,
    with_genres: genresParam ? genresParam.split(",").filter(Boolean) : [],
    first_air_date_year: yearParam,
    vote_average_gte: ratingParam ? Number(ratingParam) : 0,
  };

  const currentPage = parsePage(pageParam);

  const isInitial =
    currentFilters.sort_by === DEFAULT_TV_FILTERS.sort_by &&
    currentFilters.with_genres.length === 0 &&
    !currentFilters.first_air_date_year &&
    currentFilters.vote_average_gte === 0 &&
    !searchParams.get("sort_by");

  const serializeFilters = (filters: TVFilterState, page: number = 1) => {
    const params = new URLSearchParams();
    if (filters.sort_by !== DEFAULT_TV_FILTERS.sort_by) {
      params.set("sort_by", filters.sort_by);
    }
    if (filters.with_genres.length > 0) {
      params.set("genres", filters.with_genres.join(","));
    }
    if (filters.first_air_date_year) {
      params.set("year", filters.first_air_date_year);
    }
    if (filters.vote_average_gte > 0) {
      params.set("rating", String(filters.vote_average_gte));
    }
    if (page > 1) {
      params.set("page", String(page));
    }
    return params.toString();
  };

  const handleApplyFilters = (newFilters: TVFilterState) => {
    const query = serializeFilters(newFilters, 1);
    router.push(`/tv${query ? `?${query}` : ""}`, { scroll: false });
  };

  const handleResetFilters = () => {
    router.push("/tv", { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    const query = serializeFilters(currentFilters, newPage);
    router.push(`/tv${query ? `?${query}` : ""}`, { scroll: true });
  };

  const handleRemoveGenre = (genreId: string) => {
    const updated = currentFilters.with_genres.filter((id) => id !== genreId);
    handleApplyFilters({ ...currentFilters, with_genres: updated });
  };

  return (
    <main className="container min-h-screen pt-20 pb-16">
      {/* Mobile Filter Drawer */}
      <div className="mb-6 lg:hidden">
        <TVMobileFilterDrawer
          activeFilters={currentFilters}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex gap-8 xl:gap-12">
        {/* Left: Minimalist TV Sidebar (Desktop) */}
        <div className="hidden w-64 shrink-0 lg:block lg:w-72 xl:w-80">
          <div className="sticky top-20 max-h-sidebar scrollbar-thin overflow-y-auto pr-3">
            <TVSidebar
              activeFilters={currentFilters}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>

        {/* Right: Content Area */}
        <div className="min-w-0 flex-1">
          {isInitial ? (
            <TVSections />
          ) : (
            <TVFilteredResults
              filters={currentFilters}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onRemoveGenre={handleRemoveGenre}
              onResetFilters={handleResetFilters}
            />
          )}
        </div>
      </div>
    </main>
  );
}

export default function TVPage() {
  return (
    <Suspense fallback={<MediaListingSkeleton />}>
      <TVContent />
    </Suspense>
  );
}
