"use client";

import React from "react";
import { MediaCarouselRow } from "@/components/common/media-carousel-row";
import {
  usePopularTVShowsQuery,
  useTopRatedTVShowsQuery,
  useOnTheAirTVShowsQuery,
  useTrendingTVShowsQuery,
  useAiringTodayTVShowsQuery,
} from "@/hooks/use-tmdb";

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
      <MediaCarouselRow
        title="Trending TV Shows"
        items={trendingData?.results}
        isLoading={isTrendingLoading}
        viewAllHref="/tv/trending-today"
        type="tv"
      />
      <MediaCarouselRow
        title="Most Popular Shows"
        items={popularData?.results}
        isLoading={isPopularLoading}
        viewAllHref="/tv/popular"
        type="tv"
      />
      <MediaCarouselRow
        title="Top Rated Television"
        items={topRatedData?.results}
        isLoading={isTopRatedLoading}
        viewAllHref="/tv/top-rated"
        type="tv"
      />
      <MediaCarouselRow
        title="Currently Airing"
        items={onTheAirData?.results}
        isLoading={isOnTheAirLoading}
        viewAllHref="/tv/on-the-air"
        type="tv"
      />
      <MediaCarouselRow
        title="Airing Today"
        items={airingTodayData?.results}
        isLoading={isAiringTodayLoading}
        viewAllHref="/tv/airing-today"
        type="tv"
      />
    </div>
  );
}

export default TVSections;
