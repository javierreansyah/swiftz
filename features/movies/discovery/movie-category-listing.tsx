"use client";
import { Badge } from "@/components/ui/badge";
import { X, Film, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MovieGrid } from "@/features/movies/components/movie-grid";
import { PaginationSystem } from "@/components/common/pagination-system";
import { MovieCardSkeleton } from "@/features/media/components/movie-card-skeleton";
import { DiscoverSidebar } from "@/features/movies/discovery/discover-sidebar";
import { DiscoverMobileFilterDrawer } from "@/features/movies/discovery/discover-mobile-filter-drawer";
import {
  type DiscoverFilterState,
  SORT_OPTIONS,
  LANGUAGE_OPTIONS,
} from "@/features/movies/discovery/types";
import {
  parseFiltersFromParams,
  serializeFiltersToParams,
  isDefaultFilterState,
} from "@/features/movies/discovery/filter-utils";
import { movieGenres } from "@/features/movies/genres/genres";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useFilterQueryState } from "@/hooks/use-filter-query-state";
import {
  movieCategoryDefaults,
  movieCategoryOptions,
  type MovieCategoryType,
} from "@/features/movies/discovery/categories";
import { MediaListingLayout } from "@/features/media/components/media-listing-layout";
import { QueryFeedback } from "@/features/media/components/query-feedback";
export interface MovieCategoryListingProps {
  category: MovieCategoryType;
  title: string;
  subtitle?: string;
}

export function MovieCategoryListing({
  category,
  title,
  subtitle,
}: MovieCategoryListingProps) {
  const defaults = useMemo(() => movieCategoryDefaults(category), [category]);
  const categoryDefaultSort = defaults.sort_by;
  const {
    filters: activeFilters,
    currentPage,
    applyFilters: handleApplyFilters,
    resetFilters: handleResetFilters,
    changePage: handlePageChange,
  } = useFilterQueryState({
    path: `/movie/${category}`,
    parse: parseFiltersFromParams,
    serialize: serializeFiltersToParams,
    defaults,
  });
  const hasCustomFilters = !isDefaultFilterState(activeFilters, defaults);
  const activeQuery = useQuery(
    movieCategoryOptions(category, activeFilters, currentPage),
  );
  const { data, isLoading, isFetching, isError, refetch } = activeQuery;
  const movies = data?.results || [];
  const totalPages = Math.min(data?.total_pages || 1, 500);
  const totalResults = data?.total_results || 0;

  const handleRemoveGenre = (genreId: string) => {
    const updated = activeFilters.with_genres.filter((id) => id !== genreId);
    handleApplyFilters({ ...activeFilters, with_genres: updated });
  };

  const handleRemoveKeyword = (keywordId: number) => {
    const updated = activeFilters.keywords.filter((k) => k.id !== keywordId);
    handleApplyFilters({ ...activeFilters, keywords: updated });
  };

  const handleResetFilterKey = (key: keyof DiscoverFilterState) => {
    const updated = {
      ...activeFilters,
      [key]: defaults[key],
    };
    handleApplyFilters(updated);
  };

  const sortLabel = SORT_OPTIONS.find(
    (s) => s.value === activeFilters.sort_by,
  )?.label;
  const langLabel = LANGUAGE_OPTIONS.find(
    (l) => l.value === activeFilters.original_language,
  )?.label;

  return (
    <MediaListingLayout
      mobileFilters={
        <DiscoverMobileFilterDrawer
          defaultFilters={defaults}
          activeFilters={activeFilters}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />
      }
      sidebar={
        <DiscoverSidebar
          defaultFilters={defaults}
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
                "Loading movies..."
              ) : (
                <>
                  {subtitle || (
                    <>
                      Found{" "}
                      <span className="font-semibold text-foreground">
                        {totalResults.toLocaleString()}
                      </span>{" "}
                      movies &bull; Page {currentPage} of {totalPages}
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
              const genre = movieGenres.find((g) => String(g.id) === gId);
              return (
                <Badge variant="soft" size="filter" key={gId}>
                  <span>{genre ? genre.name : gId}</span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    type="button"
                    onClick={() => handleRemoveGenre(gId)}

                    aria-label={`Remove ${genre?.name || gId} filter`}
                  >
                    <X className="size-3" />
                  </Button>
                </Badge>
              );
            })}

            {/* Keywords */}
            {activeFilters.keywords.map((kw) => (
              <Badge variant="secondary" size="filter" key={kw.id}>
                <span>{kw.name}</span>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  type="button"
                  onClick={() => handleRemoveKeyword(kw.id)}

                  aria-label={`Remove keyword ${kw.name}`}
                >
                  <X className="size-3" />
                </Button>
              </Badge>
            ))}

            {/* Release Date Preset */}
            {activeFilters.release_date_preset &&
              activeFilters.release_date_preset !== "all" && (
                <Badge variant="secondary" size="filter">
                  <span>Year: {activeFilters.release_date_preset}</span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    type="button"
                    onClick={() => handleResetFilterKey("release_date_preset")}

                    aria-label="Remove year filter"
                  >
                    <X className="size-3" />
                  </Button>
                </Badge>
              )}

            {/* Score */}
            {(activeFilters.vote_average_gte > 0 ||
              activeFilters.vote_average_lte < 10) && (
              <Badge variant="secondary" size="filter">
                <span>
                  Score: {activeFilters.vote_average_gte} -{" "}
                  {activeFilters.vote_average_lte} ★
                </span>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  type="button"
                  onClick={() => {
                    handleApplyFilters({
                      ...activeFilters,
                      vote_average_gte: 0,
                      vote_average_lte: 10,
                    });
                  }}

                  aria-label="Remove score filter"
                >
                  <X className="size-3" />
                </Button>
              </Badge>
            )}

            {/* Minimum Votes */}
            {activeFilters.vote_count_gte > 0 && (
              <Badge variant="secondary" size="filter">
                <span>Votes: {activeFilters.vote_count_gte}+</span>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  type="button"
                  onClick={() => handleResetFilterKey("vote_count_gte")}

                  aria-label="Remove vote count filter"
                >
                  <X className="size-3" />
                </Button>
              </Badge>
            )}

            {/* Language */}
            {activeFilters.original_language &&
              activeFilters.original_language !== "all" && (
                <Badge variant="secondary" size="filter">
                  <span>
                    Lang: {langLabel || activeFilters.original_language}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    type="button"
                    onClick={() => handleResetFilterKey("original_language")}

                    aria-label="Remove language filter"
                  >
                    <X className="size-3" />
                  </Button>
                </Badge>
              )}

            {/* Certification */}
            {activeFilters.certification &&
              activeFilters.certification !== "all" && (
                <Badge variant="secondary" size="filter">
                  <span>Cert: {activeFilters.certification}</span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    type="button"
                    onClick={() => handleResetFilterKey("certification")}

                    aria-label="Remove certification filter"
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
      ) : isError && !data ? null : movies.length === 0 ? (
        <div className="flex min-h-80 flex-col items-center justify-center space-y-3 rounded-3xl border border-dashed border-border bg-card/50 p-8 text-center">
          <div className="flex size-14 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
            <Film className="size-7" />
          </div>
          <h2 className="heading-section text-foreground">
            No movies match your filters
          </h2>
          <p className="max-w-md text-xs text-muted-foreground sm:text-sm">
            Try adjusting your search criteria, removing some filters, or
            broadening your release date and rating requirements.
          </p>
          <Button variant="outline" size="sm" onClick={handleResetFilters}>
            <RotateCcw className="size-3.5" />
            <span>Reset to Default</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          <MovieGrid
            movies={movies}
            count={movies.length}
            className="grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          />

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
