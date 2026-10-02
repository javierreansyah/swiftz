"use client";
import { DiscoverSidebar } from "@/features/movies/discovery/discover-sidebar";
import { DiscoverSections } from "@/features/movies/discovery/discover-sections";
import { DiscoverFilteredResults } from "@/features/movies/discovery/discover-filtered-results";
import { DiscoverMobileFilterDrawer } from "@/features/movies/discovery/discover-mobile-filter-drawer";
import {
  type DiscoverFilterState,
  DEFAULT_DISCOVER_FILTERS,
} from "@/features/movies/discovery/types";
import {
  parseFiltersFromParams,
  serializeFiltersToParams,
  isDefaultFilterState,
} from "@/features/movies/discovery/filter-utils";
import { useFilterQueryState } from "@/hooks/use-filter-query-state";
import { MediaListingLayout } from "@/features/media/components/media-listing-layout";
export function MovieDiscoveryClient() {
  const {
    filters: currentFilters,
    currentPage,
    applyFilters: handleApplyFilters,
    resetFilters: handleResetFilters,
    changePage: handlePageChange,
  } = useFilterQueryState({
    path: "/movie",
    parse: parseFiltersFromParams,
    serialize: serializeFiltersToParams,
  });
  const isInitial = isDefaultFilterState(currentFilters);

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
      (id) => id !== providerId,
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
    <MediaListingLayout
      mobileFilters={
        <DiscoverMobileFilterDrawer
          activeFilters={currentFilters}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />
      }
      sidebar={
        <DiscoverSidebar
          activeFilters={currentFilters}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />
      }
    >
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
    </MediaListingLayout>
  );
}
