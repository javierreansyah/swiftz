"use client";

import React from "react";
import { ContentCarousel } from "@/components/common/content-carousel";
import { MediaCard } from "@/components/common/media-card";
import { SectionHeader } from "@/components/common/section-header";
import { MovieCardSkeleton } from "@/components/common/movie-card-skeleton";
import {
  usePopularTVShowsQuery,
  useTopRatedTVShowsQuery,
  useOnTheAirTVShowsQuery,
  useTrendingTVShowsQuery,
  useAiringTodayTVShowsQuery,
} from "@/hooks/use-tmdb";
import { TVShow } from "@/types";

interface TVCarouselRowProps {
  title: string;
  shows?: TVShow[];
  isLoading: boolean;
  viewAllHref: string;
}

function TVCarouselRow({ title, shows, isLoading, viewAllHref }: TVCarouselRowProps) {
  const displayShows = shows || [];

  if (isLoading) {
    return (
      <section className="space-y-4">
        <SectionHeader
          title={title}
          action={{ label: "View all", href: viewAllHref }}
        />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="w-52 shrink-0 sm:w-60">
              <MovieCardSkeleton />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (displayShows.length === 0) return null;

  return (
    <ContentCarousel
      title={title}
      action={{ label: "View all", href: viewAllHref }}
    >
      {displayShows.map((show) => {
        const year = show.first_air_date
          ? show.first_air_date.substring(0, 4)
          : undefined;

        return (
          <MediaCard
            key={show.id}
            type="tv"
            id={show.id}
            title={show.name}
            image={show.poster_path}
            rating={show.vote_average}
            year={year}
            href={`/tv/${show.id}`}
            variant="shelf"
          />
        );
      })}
    </ContentCarousel>
  );
}

export interface TVSectionsProps {
  onSelectGenre?: (genreId: string) => void;
  onSelectSort?: (sort: string) => void;
}

export function TVSections() {
  const { data: trendingData, isLoading: isTrendingLoading } =
    useTrendingTVShowsQuery(1);
  const { data: popularData, isLoading: isPopularLoading } =
    usePopularTVShowsQuery(1);
  const { data: topRatedData, isLoading: isTopRatedLoading } =
    useTopRatedTVShowsQuery(1);
  const { data: onTheAirData, isLoading: isOnTheAirLoading } =
    useOnTheAirTVShowsQuery(1);
  const { data: airingTodayData, isLoading: isAiringTodayLoading } =
    useAiringTodayTVShowsQuery(1);

  return (
    <div className="space-y-12">
      {/* 1. Trending TV Section Carousel */}
      <TVCarouselRow
        title="Trending TV Shows"
        shows={trendingData?.results}
        isLoading={isTrendingLoading}
        viewAllHref="/tv/trending-today"
      />

      {/* 2. Popular TV Shows Section Carousel */}
      <TVCarouselRow
        title="Most Popular Shows"
        shows={popularData?.results}
        isLoading={isPopularLoading}
        viewAllHref="/tv/popular"
      />

      {/* 3. Top Rated TV Shows Carousel */}
      <TVCarouselRow
        title="Top Rated Television"
        shows={topRatedData?.results}
        isLoading={isTopRatedLoading}
        viewAllHref="/tv/top-rated"
      />

      {/* 4. Currently Airing TV Shows Carousel */}
      <TVCarouselRow
        title="Currently Airing"
        shows={onTheAirData?.results}
        isLoading={isOnTheAirLoading}
        viewAllHref="/tv/on-the-air"
      />

      {/* 5. Airing Today Carousel */}
      <TVCarouselRow
        title="Airing Today"
        shows={airingTodayData?.results}
        isLoading={isAiringTodayLoading}
        viewAllHref="/tv/airing-today"
      />
    </div>
  );
}

export default TVSections;
