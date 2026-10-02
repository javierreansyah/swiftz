"use client";

import { Badge } from "@/components/ui/badge";
import React from "react";
import { X, Film, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MovieGrid } from "@/components/common/movie-grid";
import { PaginationSystem } from "@/components/common/pagination-system";
import { MovieCardSkeleton } from "@/components/common/movie-card-skeleton";
import {
  useDiscoverMoviesQuery,
  usePopularMoviesQuery,
  useTrendingMoviesQuery,
  useNowPlayingMoviesQuery,
  useTopRatedMoviesQuery,
  useUpcomingMoviesQuery,
} from "@/hooks/use-tmdb";
import {
  DiscoverFilterState,
  SORT_OPTIONS,
  TOP_WATCH_PROVIDERS,
  LANGUAGE_OPTIONS,
} from "./types";
import { buildTMDBFilters, countActiveFilters } from "./filter-utils";
import movieGenres from "@/public/data/genres";

export interface DiscoverFilteredResultsProps {
  filters: DiscoverFilterState;
  view?: "popular" | "trending" | "now_playing" | "top_rated" | "upcoming" | null;
  currentPage: number;
  onPageChange: (page: number) => void;
  onRemoveGenre: (genreId: string) => void;
  onRemoveKeyword: (keywordId: number) => void;
  onRemoveProvider: (providerId: number) => void;
  onResetFilterKey: (key: keyof DiscoverFilterState) => void;
  onClearView?: () => void;
  onClearAll: () => void;
}

export function DiscoverFilteredResults({
  filters,
  view,
  currentPage,
  onPageChange,
  onRemoveGenre,
  onRemoveKeyword,
  onRemoveProvider,
  onResetFilterKey,
  onClearView,
  onClearAll,
}: DiscoverFilteredResultsProps) {
  const tmdbFilters = buildTMDBFilters(filters, currentPage);

  const discoverQuery = useDiscoverMoviesQuery(tmdbFilters);
  const popularQuery = usePopularMoviesQuery(currentPage);
  const trendingQuery = useTrendingMoviesQuery(currentPage);
  const nowPlayingQuery = useNowPlayingMoviesQuery(currentPage);
  const topRatedQuery = useTopRatedMoviesQuery(currentPage);
  const upcomingQuery = useUpcomingMoviesQuery(currentPage);

  const activeQuery =
    view === "popular"
      ? popularQuery
      : view === "trending"
      ? trendingQuery
      : view === "now_playing"
      ? nowPlayingQuery
      : view === "top_rated"
      ? topRatedQuery
      : view === "upcoming"
      ? upcomingQuery
      : discoverQuery;

  const { data, isLoading, isFetching, isError } = activeQuery;

  const movies = data?.results || [];
  const totalPages = Math.min(data?.total_pages || 1, 500); // TMDB caps discover at 500 pages
  const totalResults = data?.total_results || 0;
  const activeCount = countActiveFilters(filters);

  const viewTitleMap: Record<string, string> = {
    popular: "Popular Movies",
    trending: "Trending Movies Today",
    now_playing: "Now Playing in Theatres",
    top_rated: "Top Rated Movies",
    upcoming: "Upcoming Movie Releases",
  };

  const headerTitle = view ? viewTitleMap[view] || "Movies" : "Discover Results";

  // Helper names
  const sortLabel = SORT_OPTIONS.find((s) => s.value === filters.sort_by)?.label;
  const langLabel = LANGUAGE_OPTIONS.find(
    (l) => l.value === filters.original_language
  )?.label;

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex flex-col gap-3 border-b border-border/50 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="heading-page text-foreground">
            {headerTitle}
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            {isLoading ? (
              "Loading movies..."
            ) : (
              <>
                Found{" "}
                <span className="font-semibold text-foreground">
                  {totalResults.toLocaleString()}
                </span>{" "}
                movies
                {isFetching && (
                  <span className="ml-2 animate-pulse text-xs text-primary">
                    (Updating...)
                  </span>
                )}
              </>
            )}
          </p>
        </div>

        {(activeCount > 0 || Boolean(view)) && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            className="w-fit"
          >
            <RotateCcw className="size-3.5" />
            <span>{view ? "Back to Discover" : "Clear all filters"}</span>
          </Button>
        )}
      </div>

      {/* Active Filter Chips */}
      {(activeCount > 0 || Boolean(view)) && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs font-semibold text-muted-foreground">
            Active:
          </span>

          {/* Dedicated Collection Chip */}
          {view && (
            <Badge variant="soft" size="filter" >
              <span>Collection: {viewTitleMap[view] || view}</span>
              {onClearView && (
                <Button variant="ghost" size="icon-xs"
                  type="button"
                  onClick={onClearView}

                  aria-label="Back to all collections"
                >
                  <X className="size-3" />
                </Button>
              )}
            </Badge>
          )}

          {/* Sort Pill */}
          {filters.sort_by !== "popularity.desc" && (
            <Badge variant="secondary" size="filter" >
              <span className="text-muted-foreground">Sort:</span> {sortLabel}
              <Button variant="ghost" size="icon-xs"
                type="button"
                onClick={() => onResetFilterKey("sort_by")}

                aria-label="Remove sort filter"
              >
                <X className="size-3" />
              </Button>
            </Badge>
          )}

          {/* Genres */}
          {filters.with_genres.map((gId) => {
            const genre = movieGenres.find((g) => String(g.id) === gId);
            return (
              <Badge variant="soft" size="filter"
                key={gId}
              >
                <span>{genre ? genre.name : gId}</span>
                <Button variant="ghost" size="icon-xs"
                  type="button"
                  onClick={() => onRemoveGenre(gId)}

                  aria-label={`Remove ${genre?.name || gId} filter`}
                >
                  <X className="size-3" />
                </Button>
              </Badge>
            );
          })}

          {/* Keywords */}
          {filters.keywords.map((kw) => (
            <Badge variant="secondary" size="filter"
              key={kw.id}
            >
              <span>{kw.name}</span>
              <Button variant="ghost" size="icon-xs"
                type="button"
                onClick={() => onRemoveKeyword(kw.id)}

                aria-label={`Remove keyword ${kw.name}`}
              >
                <X className="size-3" />
              </Button>
            </Badge>
          ))}

          {/* Release Date Preset */}
          {filters.release_date_preset && filters.release_date_preset !== "all" && (
            <Badge variant="secondary" size="filter" >
              <span>Year: {filters.release_date_preset}</span>
              <Button variant="ghost" size="icon-xs"
                type="button"
                onClick={() => onResetFilterKey("release_date_preset")}

                aria-label="Remove year filter"
              >
                <X className="size-3" />
              </Button>
            </Badge>
          )}

          {/* Score */}
          {(filters.vote_average_gte > 0 || filters.vote_average_lte < 10) && (
            <Badge variant="secondary" size="filter" >
              <span>
                Score: {filters.vote_average_gte} - {filters.vote_average_lte} ★
              </span>
              <Button variant="ghost" size="icon-xs"
                type="button"
                onClick={() => {
                  onResetFilterKey("vote_average_gte");
                  onResetFilterKey("vote_average_lte");
                }}

                aria-label="Remove score filter"
              >
                <X className="size-3" />
              </Button>
            </Badge>
          )}

          {/* Min Votes */}
          {filters.vote_count_gte > 0 && (
            <Badge variant="secondary" size="filter" >
              <span>Votes: {filters.vote_count_gte}+</span>
              <Button variant="ghost" size="icon-xs"
                type="button"
                onClick={() => onResetFilterKey("vote_count_gte")}

                aria-label="Remove vote count filter"
              >
                <X className="size-3" />
              </Button>
            </Badge>
          )}

          {/* Language */}
          {filters.original_language && filters.original_language !== "all" && (
            <Badge variant="secondary" size="filter" >
              <span>Lang: {langLabel || filters.original_language}</span>
              <Button variant="ghost" size="icon-xs"
                type="button"
                onClick={() => onResetFilterKey("original_language")}

                aria-label="Remove language filter"
              >
                <X className="size-3" />
              </Button>
            </Badge>
          )}

          {/* Certification */}
          {filters.certification && filters.certification !== "all" && (
            <Badge variant="secondary" size="filter" >
              <span>Cert: {filters.certification}</span>
              <Button variant="ghost" size="icon-xs"
                type="button"
                onClick={() => onResetFilterKey("certification")}

                aria-label="Remove certification filter"
              >
                <X className="size-3" />
              </Button>
            </Badge>
          )}

          {/* Runtime */}
          {(filters.with_runtime_gte > 0 || filters.with_runtime_lte < 360) && (
            <Badge variant="secondary" size="filter" >
              <span>
                Runtime: {filters.with_runtime_gte}m - {filters.with_runtime_lte}m
              </span>
              <Button variant="ghost" size="icon-xs"
                type="button"
                onClick={() => {
                  onResetFilterKey("with_runtime_gte");
                  onResetFilterKey("with_runtime_lte");
                }}

                aria-label="Remove runtime filter"
              >
                <X className="size-3" />
              </Button>
            </Badge>
          )}

          {/* Providers */}
          {filters.watch_providers.map((pId) => {
            const provider = TOP_WATCH_PROVIDERS.find((p) => p.id === pId);
            return (
              <Badge variant="secondary" size="filter"
                key={pId}
              >
                <span>{provider ? provider.name : `Provider ${pId}`}</span>
                <Button variant="ghost" size="icon-xs"
                  type="button"
                  onClick={() => onRemoveProvider(pId)}

                  aria-label={`Remove provider ${provider?.name || pId}`}
                >
                  <X className="size-3" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}

      {/* Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 15 }, (_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : isError || movies.length === 0 ? (
        <div className="flex min-h-80 flex-col items-center justify-center space-y-3 rounded-3xl border border-dashed border-border bg-card/50 p-8 text-center">
          <div className="flex size-14 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
            <Film className="size-7" />
          </div>
          <h2 className="heading-section text-foreground">
            No movies match your filters
          </h2>
          <p className="max-w-md text-xs text-muted-foreground sm:text-sm">
            Try adjusting your search criteria, removing some filters, or broadening your release date and rating requirements.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
          >
            <RotateCcw className="size-3.5" />
            <span>Reset All Filters</span>
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
                onPageChange={onPageChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DiscoverFilteredResults;
