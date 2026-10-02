"use client";
import { TVSidebar } from "@/features/tv/discovery/tv-sidebar";
import { TVSections } from "@/features/tv/discovery/tv-sections";
import { TVFilteredResults } from "@/features/tv/discovery/tv-filtered-results";
import { TVMobileFilterDrawer } from "@/features/tv/discovery/tv-mobile-filter-drawer";
import { useFilterQueryState } from "@/hooks/use-filter-query-state";
import {
  parseTVFilters,
  serializeTVFilters,
  hasTVFilters,
} from "@/features/tv/discovery/filter-utils";
import { MediaListingLayout } from "@/features/media/components/media-listing-layout";
export function TVDiscoveryClient() {
  const {
    filters: currentFilters,
    currentPage,
    applyFilters: handleApplyFilters,
    resetFilters: handleResetFilters,
    changePage: handlePageChange,
    searchParams,
  } = useFilterQueryState({
    path: "/tv",
    parse: parseTVFilters,
    serialize: serializeTVFilters,
  });
  const isInitial =
    !hasTVFilters(currentFilters) && !searchParams.get("sort_by");

  const handleRemoveGenre = (genreId: string) => {
    const updated = currentFilters.with_genres.filter((id) => id !== genreId);
    handleApplyFilters({ ...currentFilters, with_genres: updated });
  };

  return (
    <MediaListingLayout
      mobileFilters={
        <TVMobileFilterDrawer
          activeFilters={currentFilters}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />
      }
      sidebar={
        <TVSidebar
          activeFilters={currentFilters}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />
      }
    >
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
    </MediaListingLayout>
  );
}
