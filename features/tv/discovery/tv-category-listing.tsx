"use client";
import { Badge } from "@/components/ui/badge";
import { X, Tv, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaginationSystem } from "@/components/common/pagination-system";
import { MovieCardSkeleton } from "@/features/media/components/movie-card-skeleton";
import { TVSidebar } from "@/features/tv/discovery/tv-sidebar";
import { TVMobileFilterDrawer } from "@/features/tv/discovery/tv-mobile-filter-drawer";
import { TVCard } from "@/features/tv/discovery/tv-card";
import { TV_GENRES, TV_SORT_OPTIONS } from "@/features/tv/discovery/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useFilterQueryState } from "@/hooks/use-filter-query-state";
import {
  tvCategoryDefaults,
  tvCategoryOptions,
  type TVCategoryType,
} from "@/features/tv/discovery/categories";
import {
  parseTVFilters,
  serializeTVFilters,
  hasTVFilters,
} from "@/features/tv/discovery/filter-utils";
import { MediaListingLayout } from "@/features/media/components/media-listing-layout";
import { QueryFeedback } from "@/features/media/components/query-feedback";
export interface TVCategoryListingProps {
  category: TVCategoryType;
  title: string;
  subtitle?: string;
}

export function TVCategoryListing({
  category,
  title,
  subtitle,
}: TVCategoryListingProps) {
  const defaults = useMemo(() => tvCategoryDefaults(category), [category]);
  const categoryDefaultSort = defaults.sort_by;
  const {
    filters: activeFilters,
    currentPage,
    applyFilters: handleApplyFilters,
    resetFilters: handleResetFilters,
    changePage: handlePageChange,
  } = useFilterQueryState({
    path: `/tv/${category}`,
    parse: parseTVFilters,
    serialize: serializeTVFilters,
    defaults,
  });
  const hasCustomFilters = hasTVFilters(activeFilters, defaults);
  const activeQuery = useQuery(
    tvCategoryOptions(category, activeFilters, currentPage),
  );
  const { data, isLoading, isFetching, isError, refetch } = activeQuery;
  const shows = data?.results || [];
  const totalPages = Math.min(data?.total_pages || 1, 500);
  const totalResults = data?.total_results || 0;

  const handleRemoveGenre = (genreId: string) => {
    const updated = activeFilters.with_genres.filter((id) => id !== genreId);
    handleApplyFilters({ ...activeFilters, with_genres: updated });
  };

  const sortLabel = TV_SORT_OPTIONS.find(
    (s) => s.value === activeFilters.sort_by,
  )?.label;

  return (
    <MediaListingLayout
      mobileFilters={
        <TVMobileFilterDrawer
          activeFilters={activeFilters}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />
      }
      sidebar={
        <TVSidebar
          activeFilters={activeFilters}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />
      }
      variant="category"
      header={
        <div className="flex flex-col gap-3 border-b border-border/50 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="heading-page text-foreground">{title}</h1>
            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
              {isLoading ? (
                "Loading TV shows..."
              ) : (
                <>
                  {subtitle || (
                    <>
                      Found{" "}
                      <span className="font-semibold text-foreground">
                        {totalResults.toLocaleString()}
                      </span>{" "}
                      shows &bull; Page {currentPage} of {totalPages}
                    </>
                  )}
                  {isFetching && (
                    <span className="ml-2 animate-pulse text-xs text-primary">
                      (Updating...)
                    </span>
                  )}
                </>
              )}
            </p>
          </div>

          {hasCustomFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="w-fit"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset to Default</span>
            </Button>
          )}
        </div>
      }
      activeFilters={
        hasCustomFilters && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-xs font-semibold text-muted-foreground">
              Active:
            </span>

            {/* Sort Pill */}
            {activeFilters.sort_by !== categoryDefaultSort && (
              <Badge variant="secondary" size="filter">
                <span className="text-muted-foreground">Sort:</span> {sortLabel}
                <Button
                  variant="ghost"
                  size="icon-xs"
                  type="button"
                  onClick={() =>
                    handleApplyFilters({
                      ...activeFilters,
                      sort_by: categoryDefaultSort,
                    })
                  }

                  aria-label="Reset sort"
                >
                  <X className="size-3" />
                </Button>
              </Badge>
            )}

            {/* Genres */}
            {activeFilters.with_genres.map((gId) => {
              const genreObj = TV_GENRES.find((g) => g.id === gId);
              return (
                <Badge variant="soft" size="filter" key={gId}>
                  <span>{genreObj?.name || gId}</span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    type="button"
                    onClick={() => handleRemoveGenre(gId)}

                    aria-label={`Remove ${genreObj?.name || gId} filter`}
                  >
                    <X className="size-3" />
                  </Button>
                </Badge>
              );
            })}

            {/* Year */}
            {activeFilters.first_air_date_year && (
              <Badge variant="secondary" size="filter">
                <span>Year: {activeFilters.first_air_date_year}</span>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  type="button"
                  onClick={() =>
                    handleApplyFilters({
                      ...activeFilters,
                      first_air_date_year: "",
                    })
                  }

                  aria-label="Remove year filter"
                >
                  <X className="size-3" />
                </Button>
              </Badge>
            )}

            {/* Minimum Rating */}
            {activeFilters.vote_average_gte > 0 && (
              <Badge variant="secondary" size="filter">
                <span>Rating &ge; {activeFilters.vote_average_gte} ★</span>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  type="button"
                  onClick={() =>
                    handleApplyFilters({
                      ...activeFilters,
                      vote_average_gte: 0,
                    })
                  }

                  aria-label="Remove rating filter"
                >
                  <X className="size-3" />
                </Button>
              </Badge>
            )}
          </div>
        )
      }
    >
      {isError && (
        <QueryFeedback hasData={Boolean(data)} onRetry={() => void refetch()} />
      )}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 15 }, (_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : isError && !data ? null : shows.length === 0 ? (
        <div className="flex min-h-80 flex-col items-center justify-center space-y-3 rounded-3xl border border-dashed border-border bg-card/50 p-8 text-center">
          <div className="flex size-14 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
            <Tv className="size-7" />
          </div>
          <h2 className="heading-section text-foreground">
            No TV shows match your filters
          </h2>
          <p className="max-w-md text-xs text-muted-foreground sm:text-sm">
            Try adjusting your genres, rating, or release year filters.
          </p>
          <Button variant="outline" size="sm" onClick={handleResetFilters}>
            <RotateCcw className="size-3.5" />
            <span>Reset to Default</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {shows.map((show) => (
              <TVCard key={show.id} show={show} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pt-4">
              <PaginationSystem
                currentPage={currentPage}
                totalPage={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}
    </MediaListingLayout>
  );
}
