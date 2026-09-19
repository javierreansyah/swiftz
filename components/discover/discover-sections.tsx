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

import { SectionHeader } from "@/components/common/section-header";

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
      <SectionHeader
        title={title}
        action={{ label: "View all", onClick: onViewAll }}
      />

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
  onSelectView: (
    view: "popular" | "trending" | "now_playing" | "top_rated" | "upcoming"
  ) => void;
}

export function DiscoverSections({ onSelectView }: DiscoverSectionsProps) {
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
        onViewAll={() => onSelectView("popular")}
      />

      {/* 2. Trending Today */}
      <SectionRow
        title="Trending Today"
        movies={trendingData?.results}
        isLoading={isTrendingLoading}
        onViewAll={() => onSelectView("trending")}
      />

      {/* 3. Now Playing in Theatres */}
      <SectionRow
        title="Now Playing"
        movies={nowPlayingData?.results}
        isLoading={isNowPlayingLoading}
        onViewAll={() => onSelectView("now_playing")}
      />

      {/* 4. Top Rated Movies */}
      <SectionRow
        title="Top Rated"
        movies={topRatedData?.results}
        isLoading={isTopRatedLoading}
        onViewAll={() => onSelectView("top_rated")}
      />

      {/* 5. Upcoming Releases */}
      <SectionRow
        title="Upcoming"
        movies={upcomingData?.results}
        isLoading={isUpcomingLoading}
        onViewAll={() => onSelectView("upcoming")}
      />
    </div>
  );
}

export default DiscoverSections;

