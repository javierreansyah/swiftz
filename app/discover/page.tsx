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
  const viewParam = searchParams.get("view") as
    | "popular"
    | "trending"
    | "now_playing"
    | "top_rated"
    | "upcoming"
    | null;

  const pageParam = searchParams.get("page");
  const currentPage = Number(pageParam) || 1;

  const isInitial = isDefaultFilterState(currentFilters) && !viewParam;

  // Apply new filters from sidebar and push to URL (clears dedicated view)
  const handleApplyFilters = (newFilters: DiscoverFilterState) => {
    const query = serializeFiltersToParams(newFilters, 1);
    router.push(`/discover${query ? `?${query}` : ""}`, { scroll: false });
  };

  // Dedicated view selection from "View all" section buttons
  const handleSelectView = (
    view: "popular" | "trending" | "now_playing" | "top_rated" | "upcoming"
  ) => {
    router.push(`/discover?view=${view}&page=1`, { scroll: false });
  };

  const handleClearView = () => {
    router.push("/discover", { scroll: false });
  };

  // Reset all filters back to initial state
  const handleResetFilters = () => {
    router.push("/discover", { scroll: false });
  };

  // Pagination page change
  const handlePageChange = (newPage: number) => {
    if (viewParam) {
      router.push(`/discover?view=${viewParam}&page=${newPage}`, { scroll: true });
    } else {
      const query = serializeFiltersToParams(currentFilters, newPage);
      router.push(`/discover?${query}`, { scroll: true });
    }
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
            <DiscoverSections onSelectView={handleSelectView} />
          ) : (
            <DiscoverFilteredResults
              filters={currentFilters}
              view={viewParam}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onRemoveGenre={handleRemoveGenre}
              onRemoveKeyword={handleRemoveKeyword}
              onRemoveProvider={handleRemoveProvider}
              onResetFilterKey={handleResetFilterKey}
              onClearView={handleClearView}
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
