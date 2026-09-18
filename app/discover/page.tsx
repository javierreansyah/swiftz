"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
import { MovieCardSkeleton } from "@/components/common/movie-card-skeleton";

export const dynamic = "force-dynamic";

function DiscoverContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentFilters = parseFiltersFromParams(searchParams);
  const pageParam = searchParams.get("page");
  const currentPage = Number(pageParam) || 1;

  const isInitial = isDefaultFilterState(currentFilters);

  // Apply new filters and push to URL (resets page to 1)
  const handleApplyFilters = (newFilters: DiscoverFilterState) => {
    const query = serializeFiltersToParams(newFilters, 1);
    router.push(`/discover${query ? `?${query}` : ""}`, { scroll: false });
  };

  // Quick filter update from "View all" buttons or specific actions
  const handlePartialFilters = (partial: Partial<DiscoverFilterState>) => {
    const merged: DiscoverFilterState = {
      ...currentFilters,
      ...partial,
    };
    handleApplyFilters(merged);
  };

  // Reset all filters back to initial state
  const handleResetFilters = () => {
    router.push("/discover", { scroll: false });
  };

  // Pagination page change
  const handlePageChange = (newPage: number) => {
    const query = serializeFiltersToParams(currentFilters, newPage);
    router.push(`/discover?${query}`, { scroll: true });
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
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] scrollbar-thin overflow-y-auto pr-3">
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
            <DiscoverSections onApplyFilters={handlePartialFilters} />
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

export default function DiscoverPage() {
  return (
    <Suspense
      fallback={
        <main className="container min-h-screen pt-20 pb-16">
          <div className="flex gap-8">
            <div className="hidden w-72 shrink-0 lg:block">
              <div className="h-96 animate-pulse rounded-none bg-secondary/30" />
            </div>
            <div className="flex-1 space-y-8">
              <div className="h-8 w-48 animate-pulse rounded-none bg-secondary" />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {Array.from({ length: 10 }, (_, i) => (
                  <MovieCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </main>
      }
    >
      <DiscoverContent />
    </Suspense>
  );
}
