"use client";

import React from "react";
import { X, Tv } from "lucide-react";
import { useDiscoverTVShowsQuery } from "@/hooks/use-tmdb";
import { TVCard } from "./tv-card";
import { TVFilterState, TV_GENRES } from "./types";
import { PaginationSystem } from "@/components/common/pagination-system";
import { MovieCardSkeleton } from "@/components/common/movie-card-skeleton";

export interface TVFilteredResultsProps {
  filters: TVFilterState;
  currentPage: number;
  onPageChange: (newPage: number) => void;
  onRemoveGenre: (genreId: string) => void;
  onResetFilters: () => void;
}

export function TVFilteredResults({
  filters,
  currentPage,
  onPageChange,
  onRemoveGenre,
  onResetFilters,
}: TVFilteredResultsProps) {
  const queryParams = {
    page: currentPage,
    sort_by: filters.sort_by,
    with_genres:
      filters.with_genres.length > 0 ? filters.with_genres.join(",") : undefined,
    first_air_date_year: filters.first_air_date_year
      ? Number(filters.first_air_date_year)
      : undefined,
    "vote_average.gte":
      filters.vote_average_gte > 0 ? filters.vote_average_gte : undefined,
  };

  const { data, isLoading, isError } = useDiscoverTVShowsQuery(queryParams);

  const shows = data?.results || [];
  const totalPages = Math.min(data?.total_pages || 1, 500); // TMDB limits to 500 pages max
  const totalResults = data?.total_results || 0;

  return (
    <div className="space-y-6">
      {/* Active Filter Chips & Results Count Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">
            Active:
          </span>

          {filters.with_genres.map((gId) => {
            const genreObj = TV_GENRES.find((g) => g.id === gId);
            return (
              <span
                key={gId}
                className="inline-flex items-center gap-1 rounded-none border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
              >
                <span>{genreObj?.name || gId}</span>
                <button
                  type="button"
                  onClick={() => onRemoveGenre(gId)}
                  className="hover:text-primary-foreground"
                >
                  <X className="size-3" />
                </button>
              </span>
            );
          })}

          {filters.first_air_date_year && (
            <span className="inline-flex items-center gap-1 rounded-none border border-border bg-secondary px-2 py-0.5 text-xs font-medium text-foreground">
              <span>Year: {filters.first_air_date_year}</span>
            </span>
          )}

          {filters.vote_average_gte > 0 && (
            <span className="inline-flex items-center gap-1 rounded-none border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              <span>Rating &ge; {filters.vote_average_gte}</span>
            </span>
          )}

          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-semibold text-muted-foreground underline hover:text-foreground"
          >
            Clear all
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          {totalResults.toLocaleString()} shows found &bull; Page {currentPage} of {totalPages}
        </p>
      </div>

      {/* Results Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 15 }, (_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : isError || shows.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center space-y-3 rounded-none border border-dashed border-border bg-card p-8 text-center">
          <Tv className="size-10 text-muted-foreground" />
          <h3 className="text-base font-bold">No TV Shows Found</h3>
          <p className="max-w-md text-xs text-muted-foreground">
            No series matched your active filter criteria. Try adjusting your genres, rating, or year filters.
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-semibold text-primary underline"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {shows.map((show) => (
              <TVCard key={show.id} show={show} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pt-6">
              <PaginationSystem
                currentPage={currentPage}
                totalPage={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TVFilteredResults;
