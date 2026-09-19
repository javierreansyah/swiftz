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
import { SectionHeader } from "@/components/common/section-header";

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
        <SectionHeader
          title="Trending TV Shows"
          action={{
            label: "View all",
            onClick: () => onSelectSort?.("popularity.desc"),
          }}
        />

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
        <SectionHeader
          title="Most Popular Shows"
          action={{
            label: "View all",
            onClick: () => onSelectSort?.("popularity.desc"),
          }}
        />

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
        <SectionHeader
          title="Top Rated Television"
          action={{
            label: "View all",
            onClick: () => onSelectSort?.("vote_average.desc"),
          }}
        />

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
        <SectionHeader
          title="Currently Airing & New Episodes"
          action={{
            label: "View all",
            onClick: () => onSelectSort?.("first_air_date.desc"),
          }}
        />

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
