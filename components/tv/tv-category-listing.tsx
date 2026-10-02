"use client";

import { Badge } from "@/components/ui/badge";
import React, { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { X, Tv, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaginationSystem } from "@/components/common/pagination-system";
import { MovieCardSkeleton } from "@/components/common/movie-card-skeleton";
import { TVSidebar } from "./tv-sidebar";
import { TVMobileFilterDrawer } from "./tv-mobile-filter-drawer";
import { TVCard } from "./tv-card";
import {
  TVFilterState,
  DEFAULT_TV_FILTERS,
  TV_GENRES,
  TV_SORT_OPTIONS,
} from "./types";
import { DiscoverTVFilters } from "@/types";
import {
  useDiscoverTVShowsQuery,
  usePopularTVShowsQuery,
  useTopRatedTVShowsQuery,
  useOnTheAirTVShowsQuery,
  useAiringTodayTVShowsQuery,
} from "@/hooks/use-tmdb";

export type TVCategoryType =
  | "popular"
  | "top-rated"
  | "on-the-air"
  | "airing-today";

export interface TVCategoryListingProps {
  category: TVCategoryType;
  title: string;
  subtitle?: string;
}

function formatDateISO(date: Date): string {
  return date.toISOString().split("T")[0];
}

function getOnTheAirDates() {
  const now = new Date();
  const minDate = new Date();
  minDate.setDate(now.getDate() - 7);
  const maxDate = new Date();
  maxDate.setDate(now.getDate() + 7);
  return {
    min: formatDateISO(minDate),
    max: formatDateISO(maxDate),
  };
}

function getTodayDate() {
  return formatDateISO(new Date());
}

export function TVCategoryListing({
  category,
  title,
  subtitle,
}: TVCategoryListingProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const pageParam = searchParams.get("page");
  const currentPage = Number(pageParam) || 1;

  // Category default sort
  const categoryDefaultSort =
    category === "top-rated" ? "vote_average.desc" : "popularity.desc";

  // Parse filters from URL
  const sortByParam = searchParams.get("sort_by") || categoryDefaultSort;
  const genresParam = searchParams.get("genres");
  const yearParam = searchParams.get("year") || "";
  const ratingParam = searchParams.get("rating");

  const activeFilters: TVFilterState = useMemo(() => {
    return {
      sort_by: sortByParam,
      with_genres: genresParam ? genresParam.split(",").filter(Boolean) : [],
      first_air_date_year: yearParam,
      vote_average_gte: ratingParam ? Number(ratingParam) : 0,
    };
  }, [sortByParam, genresParam, yearParam, ratingParam]);

  // Check if user has active custom filters beyond default category state
  const hasCustomFilters = useMemo(() => {
    const hasGenres = activeFilters.with_genres.length > 0;
    const hasYear = Boolean(activeFilters.first_air_date_year);
    const hasRating = activeFilters.vote_average_gte > 0;
    const hasDifferentSort = activeFilters.sort_by !== categoryDefaultSort;

    return hasGenres || hasYear || hasRating || hasDifferentSort;
  }, [activeFilters, categoryDefaultSort]);

  // Build TMDB Discover filters seeded with category's base requirements
  const tmdbDiscoverFilters = useMemo(() => {
    const filters: DiscoverTVFilters = {
      page: currentPage,
      sort_by: activeFilters.sort_by,
    };

    if (activeFilters.with_genres.length > 0) {
      filters.with_genres = activeFilters.with_genres.join(",");
    }

    if (activeFilters.first_air_date_year) {
      filters.first_air_date_year = Number(activeFilters.first_air_date_year);
    }

    if (activeFilters.vote_average_gte > 0) {
      filters["vote_average.gte"] = activeFilters.vote_average_gte;
    } else if (category === "top-rated") {
      filters["vote_average.gte"] = 7;
    }

    if (category === "on-the-air") {
      const dates = getOnTheAirDates();
      filters["air_date.gte"] = dates.min;
      filters["air_date.lte"] = dates.max;
    } else if (category === "airing-today") {
      const today = getTodayDate();
      filters["air_date.gte"] = today;
      filters["air_date.lte"] = today;
    }

    return filters;
  }, [activeFilters, category, currentPage]);

  // Category native queries (used when no custom filters are applied)
  const popularQuery = usePopularTVShowsQuery(currentPage);
  const topRatedQuery = useTopRatedTVShowsQuery(currentPage);
  const onTheAirQuery = useOnTheAirTVShowsQuery(currentPage);
  const airingTodayQuery = useAiringTodayTVShowsQuery(currentPage);

  // Discover query (used when custom filters are applied)
  const discoverQuery = useDiscoverTVShowsQuery(tmdbDiscoverFilters);

  // Pick active query
  const activeQuery = hasCustomFilters
    ? discoverQuery
    : category === "popular"
    ? popularQuery
    : category === "top-rated"
    ? topRatedQuery
    : category === "on-the-air"
    ? onTheAirQuery
    : airingTodayQuery;

  const { data, isLoading, isFetching, isError } = activeQuery;
  const shows = data?.results || [];
  const totalPages = Math.min(data?.total_pages || 1, 500);
  const totalResults = data?.total_results || 0;

  // URL serialization
  const serializeFilters = (filters: TVFilterState, page: number = 1) => {
    const params = new URLSearchParams();
    if (filters.sort_by !== categoryDefaultSort) {
      params.set("sort_by", filters.sort_by);
    }
    if (filters.with_genres.length > 0) {
      params.set("genres", filters.with_genres.join(","));
    }
    if (filters.first_air_date_year) {
      params.set("year", filters.first_air_date_year);
    }
    if (filters.vote_average_gte > 0) {
      params.set("rating", String(filters.vote_average_gte));
    }
    if (page > 1) {
      params.set("page", String(page));
    }
    return params.toString();
  };

  const handleApplyFilters = (newFilters: TVFilterState) => {
    const query = serializeFilters(newFilters, 1);
    router.push(`/tv/${category}${query ? `?${query}` : ""}`, {
      scroll: false,
    });
  };

  const handleResetFilters = () => {
    router.push(`/tv/${category}`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    const query = serializeFilters(activeFilters, newPage);
    router.push(`/tv/${category}?${query}`, { scroll: true });
  };

  const handleRemoveGenre = (genreId: string) => {
    const updated = activeFilters.with_genres.filter((id) => id !== genreId);
    handleApplyFilters({ ...activeFilters, with_genres: updated });
  };

  const sortLabel = TV_SORT_OPTIONS.find(
    (s) => s.value === activeFilters.sort_by
  )?.label;

  return (
    <main className="container min-h-screen pt-20 pb-16">
      {/* Mobile Filter Drawer */}
      <div className="mb-6 lg:hidden">
        <TVMobileFilterDrawer
          activeFilters={activeFilters}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex gap-8 xl:gap-12">
        {/* Left: Desktop Sticky Sidebar */}
        <div className="hidden w-64 shrink-0 lg:block lg:w-72 xl:w-80">
          <div className="sticky top-20 max-h-sidebar scrollbar-thin overflow-y-auto pr-3">
            <TVSidebar
              activeFilters={activeFilters}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>

        {/* Right: Content Area */}
        <div className="min-w-0 flex-1 space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-3 border-b border-border/50 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="heading-page text-foreground">
                {title}
              </h1>
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

          {/* Active Filter Chips */}
          {hasCustomFilters && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-xs font-semibold text-muted-foreground">
                Active:
              </span>

              {/* Sort Pill */}
              {activeFilters.sort_by !== categoryDefaultSort && (
                <Badge variant="secondary" size="filter" >
                  <span className="text-muted-foreground">Sort:</span> {sortLabel}
                  <Button variant="ghost" size="icon-xs"
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
                  <Badge variant="soft" size="filter"
                    key={gId}
                  >
                    <span>{genreObj?.name || gId}</span>
                    <Button variant="ghost" size="icon-xs"
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
                <Badge variant="secondary" size="filter" >
                  <span>Year: {activeFilters.first_air_date_year}</span>
                  <Button variant="ghost" size="icon-xs"
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
                <Badge variant="secondary" size="filter" >
                  <span>Rating &ge; {activeFilters.vote_average_gte} ★</span>
                  <Button variant="ghost" size="icon-xs"
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
          )}

          {/* Results Grid / States */}
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 15 }, (_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </div>
          ) : isError || shows.length === 0 ? (
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
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
              >
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
        </div>
      </div>
    </main>
  );
}

export default TVCategoryListing;
