"use client";

import React from "react";
import { X, Film, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MovieGrid } from "@/components/common/movie-grid";
import { PaginationSystem } from "@/components/common/pagination-system";
import { MovieCardSkeleton } from "@/components/common/movie-card-skeleton";
import { useDiscoverMoviesQuery } from "@/hooks/use-tmdb";
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
  currentPage: number;
  onPageChange: (page: number) => void;
  onRemoveGenre: (genreId: string) => void;
  onRemoveKeyword: (keywordId: number) => void;
  onRemoveProvider: (providerId: number) => void;
  onResetFilterKey: (key: keyof DiscoverFilterState) => void;
  onClearAll: () => void;
}

export function DiscoverFilteredResults({
  filters,
  currentPage,
  onPageChange,
  onRemoveGenre,
  onRemoveKeyword,
  onRemoveProvider,
  onResetFilterKey,
  onClearAll,
}: DiscoverFilteredResultsProps) {
  const tmdbFilters = buildTMDBFilters(filters, currentPage);
  const { data, isLoading, isFetching, isError } =
    useDiscoverMoviesQuery(tmdbFilters);

  const movies = data?.results || [];
  const totalPages = Math.min(data?.total_pages || 1, 500); // TMDB caps discover at 500 pages
  const totalResults = data?.total_results || 0;
  const activeCount = countActiveFilters(filters);

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
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Discover Results
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

        {activeCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            className="w-fit gap-1.5 text-xs"
          >
            <RotateCcw className="size-3.5" />
            <span>Clear all filters</span>
          </Button>
        )}
      </div>

      {/* Active Filter Chips */}
      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs font-semibold text-muted-foreground">
            Active:
          </span>

          {/* Sort Pill */}
          {filters.sort_by !== "popularity.desc" && (
            <span className="inline-flex items-center gap-1 rounded-none border border-border bg-secondary/80 px-2.5 py-1 text-xs">
              <span className="text-muted-foreground">Sort:</span> {sortLabel}
              <button
                type="button"
                onClick={() => onResetFilterKey("sort_by")}
                className="hover:text-foreground"
                aria-label="Remove sort filter"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {/* Genres */}
          {filters.with_genres.map((gId) => {
            const genre = movieGenres.find((g) => String(g.id) === gId);
            return (
              <span
                key={gId}
                className="inline-flex items-center gap-1 rounded-none border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
              >
                <span>{genre ? genre.name : gId}</span>
                <button
                  type="button"
                  onClick={() => onRemoveGenre(gId)}
                  className="hover:text-primary/70"
                  aria-label={`Remove ${genre?.name || gId} filter`}
                >
                  <X className="size-3" />
                </button>
              </span>
            );
          })}

          {/* Keywords */}
          {filters.keywords.map((kw) => (
            <span
              key={kw.id}
              className="inline-flex items-center gap-1 rounded-none border border-border bg-secondary/80 px-2.5 py-1 text-xs capitalize"
            >
              <span>{kw.name}</span>
              <button
                type="button"
                onClick={() => onRemoveKeyword(kw.id)}
                className="hover:text-foreground"
                aria-label={`Remove keyword ${kw.name}`}
              >
                <X className="size-3" />
              </button>
            </span>
          ))}

          {/* Release Date Preset */}
          {filters.release_date_preset && filters.release_date_preset !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-none border border-border bg-secondary/80 px-2.5 py-1 text-xs">
              <span>Year: {filters.release_date_preset}</span>
              <button
                type="button"
                onClick={() => onResetFilterKey("release_date_preset")}
                className="hover:text-foreground"
                aria-label="Remove year filter"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {/* Score */}
          {(filters.vote_average_gte > 0 || filters.vote_average_lte < 10) && (
            <span className="inline-flex items-center gap-1 rounded-none border border-border bg-secondary/80 px-2.5 py-1 text-xs">
              <span>
                Score: {filters.vote_average_gte} - {filters.vote_average_lte} ★
              </span>
              <button
                type="button"
                onClick={() => {
                  onResetFilterKey("vote_average_gte");
                  onResetFilterKey("vote_average_lte");
                }}
                className="hover:text-foreground"
                aria-label="Remove score filter"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {/* Min Votes */}
          {filters.vote_count_gte > 0 && (
            <span className="inline-flex items-center gap-1 rounded-none border border-border bg-secondary/80 px-2.5 py-1 text-xs">
              <span>Votes: {filters.vote_count_gte}+</span>
              <button
                type="button"
                onClick={() => onResetFilterKey("vote_count_gte")}
                className="hover:text-foreground"
                aria-label="Remove vote count filter"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {/* Language */}
          {filters.original_language && filters.original_language !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-none border border-border bg-secondary/80 px-2.5 py-1 text-xs">
              <span>Lang: {langLabel || filters.original_language}</span>
              <button
                type="button"
                onClick={() => onResetFilterKey("original_language")}
                className="hover:text-foreground"
                aria-label="Remove language filter"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {/* Certification */}
          {filters.certification && filters.certification !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-none border border-border bg-secondary/80 px-2.5 py-1 text-xs uppercase">
              <span>Cert: {filters.certification}</span>
              <button
                type="button"
                onClick={() => onResetFilterKey("certification")}
                className="hover:text-foreground"
                aria-label="Remove certification filter"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {/* Runtime */}
          {(filters.with_runtime_gte > 0 || filters.with_runtime_lte < 360) && (
            <span className="inline-flex items-center gap-1 rounded-none border border-border bg-secondary/80 px-2.5 py-1 text-xs">
              <span>
                Runtime: {filters.with_runtime_gte}m - {filters.with_runtime_lte}m
              </span>
              <button
                type="button"
                onClick={() => {
                  onResetFilterKey("with_runtime_gte");
                  onResetFilterKey("with_runtime_lte");
                }}
                className="hover:text-foreground"
                aria-label="Remove runtime filter"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {/* Providers */}
          {filters.watch_providers.map((pId) => {
            const provider = TOP_WATCH_PROVIDERS.find((p) => p.id === pId);
            return (
              <span
                key={pId}
                className="inline-flex items-center gap-1 rounded-none border border-border bg-secondary/80 px-2.5 py-1 text-xs"
              >
                <span>{provider ? provider.name : `Provider ${pId}`}</span>
                <button
                  type="button"
                  onClick={() => onRemoveProvider(pId)}
                  className="hover:text-foreground"
                  aria-label={`Remove provider ${provider?.name || pId}`}
                >
                  <X className="size-3" />
                </button>
              </span>
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
        <div className="flex min-h-80 flex-col items-center justify-center space-y-3 rounded-none border border-dashed border-border bg-card/50 p-8 text-center">
          <div className="flex size-14 items-center justify-center rounded-none bg-secondary text-muted-foreground">
            <Film className="size-7" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            No movies match your filters
          </h2>
          <p className="max-w-md text-xs text-muted-foreground sm:text-sm">
            Try adjusting your search criteria, removing some filters, or broadening your release date and rating requirements.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            className="gap-2"
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
