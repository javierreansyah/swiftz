"use client";

import React, { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { X, Film, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MovieGrid } from "@/components/common/movie-grid";
import { PaginationSystem } from "@/components/common/pagination-system";
import { MovieCardSkeleton } from "@/components/common/movie-card-skeleton";
import { DiscoverSidebar } from "./discover-sidebar";
import { DiscoverMobileFilterDrawer } from "./discover-mobile-filter-drawer";
import {
  DiscoverFilterState,
  DEFAULT_DISCOVER_FILTERS,
  SORT_OPTIONS,
  LANGUAGE_OPTIONS,
} from "./types";
import {
  parseFiltersFromParams,
  serializeFiltersToParams,
  buildTMDBFilters,
} from "./filter-utils";
import movieGenres from "@/public/data/genres";
import {
  useDiscoverMoviesQuery,
  usePopularMoviesQuery,
  useTopRatedMoviesQuery,
  useNowPlayingMoviesQuery,
  useUpcomingMoviesQuery,
} from "@/hooks/use-tmdb";

export type MovieCategoryType = "popular" | "top-rated" | "now-playing" | "upcoming";

export interface MovieCategoryListingProps {
  category: MovieCategoryType;
  title: string;
  subtitle?: string;
}

function formatDateISO(date: Date): string {
  return date.toISOString().split("T")[0];
}

function getNowPlayingDates() {
  const now = new Date();
  const minDate = new Date();
  minDate.setDate(now.getDate() - 45);
  return {
    min: formatDateISO(minDate),
    max: formatDateISO(now),
  };
}

function getUpcomingDates() {
  const now = new Date();
  const maxDate = new Date();
  maxDate.setDate(now.getDate() + 30);
  return {
    min: formatDateISO(now),
    max: formatDateISO(maxDate),
  };
}

export function MovieCategoryListing({
  category,
  title,
  subtitle,
}: MovieCategoryListingProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const pageParam = searchParams.get("page");
  const currentPage = Number(pageParam) || 1;

  // Category-specific base default sort
  const categoryDefaultSort =
    category === "top-rated" ? "vote_average.desc" : "popularity.desc";

  // Parse filters from URL
  const parsedFilters = useMemo(
    () => parseFiltersFromParams(searchParams),
    [searchParams]
  );

  // If URL has no sort_by specified, set to category default
  const activeFilters: DiscoverFilterState = useMemo(() => {
    return {
      ...parsedFilters,
      sort_by: searchParams.get("sort_by") || categoryDefaultSort,
    };
  }, [parsedFilters, searchParams, categoryDefaultSort]);

  // Check if user has active custom filters beyond default category state
  const hasCustomFilters = useMemo(() => {
    const hasGenres = activeFilters.with_genres.length > 0;
    const hasKeywords = activeFilters.keywords.length > 0;
    const hasYear =
      activeFilters.release_date_preset !== "all" ||
      Boolean(activeFilters.release_date_gte) ||
      Boolean(activeFilters.release_date_lte);
    const hasCert = activeFilters.certification !== "all";
    const hasLang = activeFilters.original_language !== "all";
    const hasScore =
      activeFilters.vote_average_gte > 0 || activeFilters.vote_average_lte < 10;
    const hasVotes = activeFilters.vote_count_gte > 0;
    const hasRuntime =
      activeFilters.with_runtime_gte > 0 || activeFilters.with_runtime_lte < 360;
    const hasProviders = activeFilters.watch_providers.length > 0;
    const hasDifferentSort = activeFilters.sort_by !== categoryDefaultSort;

    return (
      hasGenres ||
      hasKeywords ||
      hasYear ||
      hasCert ||
      hasLang ||
      hasScore ||
      hasVotes ||
      hasRuntime ||
      hasProviders ||
      hasDifferentSort
    );
  }, [activeFilters, categoryDefaultSort]);

  // Build TMDB Discover filters seeded with category's base requirements
  const tmdbDiscoverFilters = useMemo(() => {
    const base = { ...activeFilters };

    if (category === "top-rated" && base.vote_count_gte === 0) {
      base.vote_count_gte = 200;
    }

    const built = buildTMDBFilters(base, currentPage);

    if (category === "now-playing") {
      const dates = getNowPlayingDates();
      built.with_release_type = "2|3";
      if (!built["primary_release_date.gte"]) {
        built["primary_release_date.gte"] = dates.min;
      }
      if (!built["primary_release_date.lte"]) {
        built["primary_release_date.lte"] = dates.max;
      }
    } else if (category === "upcoming") {
      const dates = getUpcomingDates();
      built.with_release_type = "2|3";
      if (!built["primary_release_date.gte"]) {
        built["primary_release_date.gte"] = dates.min;
      }
      if (!built["primary_release_date.lte"]) {
        built["primary_release_date.lte"] = dates.max;
      }
    }

    return built;
  }, [activeFilters, category, currentPage]);

  // Category native queries (used when no custom filters are applied)
  const popularQuery = usePopularMoviesQuery(currentPage);
  const topRatedQuery = useTopRatedMoviesQuery(currentPage);
  const nowPlayingQuery = useNowPlayingMoviesQuery(currentPage);
  const upcomingQuery = useUpcomingMoviesQuery(currentPage);

  // Discover query (used when custom filters are applied)
  const discoverQuery = useDiscoverMoviesQuery(tmdbDiscoverFilters);

  // Pick active query
  const activeQuery = hasCustomFilters
    ? discoverQuery
    : category === "popular"
    ? popularQuery
    : category === "top-rated"
    ? topRatedQuery
    : category === "now-playing"
    ? nowPlayingQuery
    : upcomingQuery;

  const { data, isLoading, isFetching, isError } = activeQuery;
  const movies = data?.results || [];
  const totalPages = Math.min(data?.total_pages || 1, 500);
  const totalResults = data?.total_results || 0;

  // Handlers
  const handleApplyFilters = (newFilters: DiscoverFilterState) => {
    const query = serializeFiltersToParams(newFilters, 1);
    router.push(`/movie/${category}${query ? `?${query}` : ""}`, {
      scroll: false,
    });
  };

  const handleResetFilters = () => {
    router.push(`/movie/${category}`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    const query = serializeFiltersToParams(activeFilters, newPage);
    router.push(`/movie/${category}?${query}`, { scroll: true });
  };

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
      [key]: DEFAULT_DISCOVER_FILTERS[key],
    };
    handleApplyFilters(updated);
  };

  const sortLabel = SORT_OPTIONS.find((s) => s.value === activeFilters.sort_by)?.label;
  const langLabel = LANGUAGE_OPTIONS.find(
    (l) => l.value === activeFilters.original_language
  )?.label;

  return (
    <main className="container min-h-screen pt-20 pb-16">
      {/* Mobile Filter Drawer */}
      <div className="mb-6 lg:hidden">
        <DiscoverMobileFilterDrawer
          activeFilters={activeFilters}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex gap-8 xl:gap-12">
        {/* Left: Desktop Sticky Sidebar */}
        <div className="hidden w-64 shrink-0 lg:block lg:w-72 xl:w-80">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] scrollbar-thin overflow-y-auto pr-3">
            <DiscoverSidebar
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
              <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {title}
              </h1>
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
                className="w-fit gap-1.5 text-xs"
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
                <span className="inline-flex items-center gap-1 rounded-none border border-border bg-secondary/80 px-2.5 py-1 text-xs">
                  <span className="text-muted-foreground">Sort:</span> {sortLabel}
                  <button
                    type="button"
                    onClick={() =>
                      handleApplyFilters({
                        ...activeFilters,
                        sort_by: categoryDefaultSort,
                      })
                    }
                    className="hover:text-foreground"
                    aria-label="Reset sort"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              )}

              {/* Genres */}
              {activeFilters.with_genres.map((gId) => {
                const genre = movieGenres.find((g) => String(g.id) === gId);
                return (
                  <span
                    key={gId}
                    className="inline-flex items-center gap-1 rounded-none border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                  >
                    <span>{genre ? genre.name : gId}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveGenre(gId)}
                      className="hover:text-primary/70"
                      aria-label={`Remove ${genre?.name || gId} filter`}
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                );
              })}

              {/* Keywords */}
              {activeFilters.keywords.map((kw) => (
                <span
                  key={kw.id}
                  className="inline-flex items-center gap-1 rounded-none border border-border bg-secondary/80 px-2.5 py-1 text-xs capitalize"
                >
                  <span>{kw.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(kw.id)}
                    className="hover:text-foreground"
                    aria-label={`Remove keyword ${kw.name}`}
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}

              {/* Release Date Preset */}
              {activeFilters.release_date_preset &&
                activeFilters.release_date_preset !== "all" && (
                  <span className="inline-flex items-center gap-1 rounded-none border border-border bg-secondary/80 px-2.5 py-1 text-xs">
                    <span>Year: {activeFilters.release_date_preset}</span>
                    <button
                      type="button"
                      onClick={() => handleResetFilterKey("release_date_preset")}
                      className="hover:text-foreground"
                      aria-label="Remove year filter"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                )}

              {/* Score */}
              {(activeFilters.vote_average_gte > 0 ||
                activeFilters.vote_average_lte < 10) && (
                <span className="inline-flex items-center gap-1 rounded-none border border-border bg-secondary/80 px-2.5 py-1 text-xs">
                  <span>
                    Score: {activeFilters.vote_average_gte} -{" "}
                    {activeFilters.vote_average_lte} ★
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      handleApplyFilters({
                        ...activeFilters,
                        vote_average_gte: 0,
                        vote_average_lte: 10,
                      });
                    }}
                    className="hover:text-foreground"
                    aria-label="Remove score filter"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              )}

              {/* Minimum Votes */}
              {activeFilters.vote_count_gte > 0 && (
                <span className="inline-flex items-center gap-1 rounded-none border border-border bg-secondary/80 px-2.5 py-1 text-xs">
                  <span>Votes: {activeFilters.vote_count_gte}+</span>
                  <button
                    type="button"
                    onClick={() => handleResetFilterKey("vote_count_gte")}
                    className="hover:text-foreground"
                    aria-label="Remove vote count filter"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              )}

              {/* Language */}
              {activeFilters.original_language &&
                activeFilters.original_language !== "all" && (
                  <span className="inline-flex items-center gap-1 rounded-none border border-border bg-secondary/80 px-2.5 py-1 text-xs">
                    <span>Lang: {langLabel || activeFilters.original_language}</span>
                    <button
                      type="button"
                      onClick={() => handleResetFilterKey("original_language")}
                      className="hover:text-foreground"
                      aria-label="Remove language filter"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                )}

              {/* Certification */}
              {activeFilters.certification &&
                activeFilters.certification !== "all" && (
                  <span className="inline-flex items-center gap-1 rounded-none border border-border bg-secondary/80 px-2.5 py-1 text-xs uppercase">
                    <span>Cert: {activeFilters.certification}</span>
                    <button
                      type="button"
                      onClick={() => handleResetFilterKey("certification")}
                      className="hover:text-foreground"
                      aria-label="Remove certification filter"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
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
                onClick={handleResetFilters}
                className="gap-2"
              >
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
        </div>
      </div>
    </main>
  );
}

export default MovieCategoryListing;
