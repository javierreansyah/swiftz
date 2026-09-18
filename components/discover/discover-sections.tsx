"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MovieCard } from "@/components/common/movie-card";
import { MovieCardSkeleton } from "@/components/common/movie-card-skeleton";
import {
  usePopularMoviesQuery,
  useTrendingMoviesQuery,
  useNowPlayingMoviesQuery,
  useTopRatedMoviesQuery,
  useUpcomingMoviesQuery,
} from "@/hooks/use-tmdb";
import { Movie } from "@/types";
import { DiscoverFilterState } from "./types";

interface SectionProps {
  title: string;
  movies?: Movie[];
  isLoading: boolean;
  onViewAll: () => void;
}

function SectionRow({ title, movies, isLoading, onViewAll }: SectionProps) {
  const displayMovies = (movies || []).slice(0, 5);

  return (
    <section className="space-y-4">
      {/* Header: Title in Lora font + "View all" right beside the title */}
      <div className="flex items-center gap-3 border-b border-border/50 pb-2.5">
        <h2 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAll}
          className="gap-1 px-2 text-xs font-semibold text-primary hover:text-primary"
        >
          <span>View all</span>
          <ChevronRight className="size-3.5" />
        </Button>
      </div>

      {/* Cards Row */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 5 }, (_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : displayMovies.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {displayMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              poster={movie.poster_path}
              rating={movie.vote_average}
            />
          ))}
        </div>
      ) : (
        <p className="py-4 text-xs text-muted-foreground">
          No movies available right now.
        </p>
      )}
    </section>
  );
}

export interface DiscoverSectionsProps {
  onApplyFilters: (filters: Partial<DiscoverFilterState>) => void;
}

export function DiscoverSections({ onApplyFilters }: DiscoverSectionsProps) {
  const { data: popularData, isLoading: isPopularLoading } =
    usePopularMoviesQuery(1);
  const { data: trendingData, isLoading: isTrendingLoading } =
    useTrendingMoviesQuery(1);
  const { data: nowPlayingData, isLoading: isNowPlayingLoading } =
    useNowPlayingMoviesQuery(1);
  const { data: topRatedData, isLoading: isTopRatedLoading } =
    useTopRatedMoviesQuery(1);
  const { data: upcomingData, isLoading: isUpcomingLoading } =
    useUpcomingMoviesQuery(1);

  return (
    <div className="space-y-12">
      {/* 1. Popular Movies */}
      <SectionRow
        title="Popular"
        movies={popularData?.results}
        isLoading={isPopularLoading}
        onViewAll={() =>
          onApplyFilters({
            sort_by: "popularity.desc",
          })
        }
      />

      {/* 2. Trending Today */}
      <SectionRow
        title="Trending Today"
        movies={trendingData?.results}
        isLoading={isTrendingLoading}
        onViewAll={() =>
          onApplyFilters({
            sort_by: "popularity.desc",
          })
        }
      />

      {/* 3. Now Playing in Theatres */}
      <SectionRow
        title="Now Playing"
        movies={nowPlayingData?.results}
        isLoading={isNowPlayingLoading}
        onViewAll={() =>
          onApplyFilters({
            release_date_preset: "2026",
            sort_by: "popularity.desc",
          })
        }
      />

      {/* 4. Top Rated Movies */}
      <SectionRow
        title="Top Rated"
        movies={topRatedData?.results}
        isLoading={isTopRatedLoading}
        onViewAll={() =>
          onApplyFilters({
            sort_by: "vote_average.desc",
            vote_count_gte: 300,
          })
        }
      />

      {/* 5. Upcoming Releases */}
      <SectionRow
        title="Upcoming"
        movies={upcomingData?.results}
        isLoading={isUpcomingLoading}
        onViewAll={() =>
          onApplyFilters({
            sort_by: "primary_release_date.desc",
          })
        }
      />
    </div>
  );
}

export default DiscoverSections;
