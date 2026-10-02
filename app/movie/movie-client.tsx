"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useClientQueryRouter } from "@/hooks/use-client-query-router";
import { parsePage } from "@/lib/pagination";
import {
  DiscoverSidebar,
  DiscoverSections,
  DiscoverFilteredResults,
  DiscoverMobileFilterDrawer,
  DiscoverFilterState,
  DEFAULT_DISCOVER_FILTERS,
  parseFiltersFromParams,
  serializeFiltersToParams,
  isDefaultFilterState,
} from "@/components/discover";
import { MediaListingSkeleton } from "@/components/common/media-listing-skeleton";

function MovieContent() {
  const searchParams = useSearchParams();
  const router = useClientQueryRouter();

  const currentFilters = parseFiltersFromParams(searchParams);
  const pageParam = searchParams.get("page");
  const currentPage = parsePage(pageParam);

  const isInitial = isDefaultFilterState(currentFilters);

  // Apply new filters from sidebar and push to URL
  const handleApplyFilters = (newFilters: DiscoverFilterState) => {
    const query = serializeFiltersToParams(newFilters, 1);
    router.push(`/movie${query ? `?${query}` : ""}`, { scroll: false });
  };

  // Reset all filters back to initial state
  const handleResetFilters = () => {
    router.push("/movie", { scroll: false });
  };

  // Pagination page change
  const handlePageChange = (newPage: number) => {
    const query = serializeFiltersToParams(currentFilters, newPage);
    router.push(`/movie?${query}`, { scroll: true });
  };

  // Remove individual filters from active chips
  const handleRemoveGenre = (genreId: string) => {
    const updated = currentFilters.with_genres.filter((id) => id !== genreId);
    handleApplyFilters({ ...currentFilters, with_genres: updated });
  };

  const handleRemoveKeyword = (keywordId: number) => {
    const updated = currentFilters.keywords.filter((k) => k.id !== keywordId);
    handleApplyFilters({ ...currentFilters, keywords: updated });
  };

  const handleRemoveProvider = (providerId: number) => {
    const updated = currentFilters.watch_providers.filter(
      (id) => id !== providerId
    );
    handleApplyFilters({ ...currentFilters, watch_providers: updated });
  };

  const handleResetFilterKey = (key: keyof DiscoverFilterState) => {
    const updated = {
      ...currentFilters,
      [key]: DEFAULT_DISCOVER_FILTERS[key],
    };
    handleApplyFilters(updated);
  };

  return (
    <main className="container min-h-screen pt-20 pb-16">
      {/* Mobile Filters Trigger */}
      <div className="mb-6 lg:hidden">
        <DiscoverMobileFilterDrawer
          activeFilters={currentFilters}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex gap-8 xl:gap-12">
        {/* Left: Minimalist Background-Integrated Sidebar (Desktop) */}
        <div className="hidden w-64 shrink-0 lg:block lg:w-72 xl:w-80">
          <div className="sticky top-20 max-h-sidebar scrollbar-thin overflow-y-auto pr-3">
            <DiscoverSidebar
              activeFilters={currentFilters}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>

        {/* Right: Content Area */}
        <div className="min-w-0 flex-1">
          {isInitial ? (
            <DiscoverSections />
          ) : (
            <DiscoverFilteredResults
              filters={currentFilters}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onRemoveGenre={handleRemoveGenre}
              onRemoveKeyword={handleRemoveKeyword}
              onRemoveProvider={handleRemoveProvider}
              onResetFilterKey={handleResetFilterKey}
              onClearAll={handleResetFilters}
            />
          )}
        </div>
      </div>
    </main>
  );
}

export default function MoviePage() {
  return (
    <Suspense fallback={<MediaListingSkeleton />}>
      <MovieContent />
    </Suspense>
  );
}
