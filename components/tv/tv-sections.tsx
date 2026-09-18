"use client";

import React from "react";
import {
  usePopularTVShowsQuery,
  useTopRatedTVShowsQuery,
  useOnTheAirTVShowsQuery,
  useTrendingTVShowsQuery,
} from "@/hooks/use-tmdb";
import { TVCard } from "./tv-card";
import { MovieCardSkeleton } from "@/components/common/movie-card-skeleton";
import { Button } from "@/components/ui/button";

export interface TVSectionsProps {
  onSelectGenre?: (genreId: string) => void;
  onSelectSort?: (sort: string) => void;
}

export function TVSections({ onSelectSort }: TVSectionsProps) {
  const { data: popularData, isLoading: isPopularLoading } =
    usePopularTVShowsQuery(1);
  const { data: trendingData, isLoading: isTrendingLoading } =
    useTrendingTVShowsQuery(1);
  const { data: topRatedData, isLoading: isTopRatedLoading } =
    useTopRatedTVShowsQuery(1);
  const { data: onTheAirData, isLoading: isOnTheAirLoading } =
    useOnTheAirTVShowsQuery(1);

  const popularShows = (popularData?.results || []).slice(0, 5);
  const trendingShows = (trendingData?.results || []).slice(0, 5);
  const topRatedShows = (topRatedData?.results || []).slice(0, 5);
  const onTheAirShows = (onTheAirData?.results || []).slice(0, 5);

  return (
    <div className="space-y-10">
      {/* 1. Trending TV Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-l-2 border-primary pl-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Trending TV Shows
            </h2>
            <p className="text-xs text-muted-foreground sm:text-sm">
              The hottest series captivating audiences today
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectSort?.("popularity.desc")}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            View all
          </Button>
        </div>

        {isTrendingLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 5 }, (_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {trendingShows.map((show) => (
              <TVCard key={show.id} show={show} />
            ))}
          </div>
        )}
      </section>

      {/* 2. Popular TV Shows Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-l-2 border-primary pl-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Most Popular Shows
            </h2>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Global fan favorites and television sensations
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectSort?.("popularity.desc")}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            View all
          </Button>
        </div>

        {isPopularLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 5 }, (_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {popularShows.map((show) => (
              <TVCard key={show.id} show={show} />
            ))}
          </div>
        )}
      </section>

      {/* 3. Top Rated TV Shows */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-l-2 border-primary pl-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Top Rated Television
            </h2>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Critically acclaimed series with outstanding ratings
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectSort?.("vote_average.desc")}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            View all
          </Button>
        </div>

        {isTopRatedLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 5 }, (_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {topRatedShows.map((show) => (
              <TVCard key={show.id} show={show} />
            ))}
          </div>
        )}
      </section>

      {/* 4. On The Air */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-l-2 border-primary pl-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Currently Airing &amp; New Episodes
            </h2>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Shows airing new episodes in the next 7 days
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectSort?.("first_air_date.desc")}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            View all
          </Button>
        </div>

        {isOnTheAirLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 5 }, (_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {onTheAirShows.map((show) => (
              <TVCard key={show.id} show={show} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default TVSections;
