"use client";

import React from "react";
import { MediaCarouselRow } from "@/components/common/media-carousel-row";
import {
  usePopularMoviesQuery,
  useTrendingMoviesQuery,
  useNowPlayingMoviesQuery,
  useTopRatedMoviesQuery,
  useUpcomingMoviesQuery,
} from "@/hooks/use-tmdb";

export interface DiscoverSectionsProps {
  onSelectView?: (
    view: "popular" | "trending" | "now_playing" | "top_rated" | "upcoming"
  ) => void;
}

export function DiscoverSections() {
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
      <MediaCarouselRow
        title="Popular Movies"
        items={popularData?.results}
        isLoading={isPopularLoading}
        viewAllHref="/movie/popular"
        type="movie"
      />
      <MediaCarouselRow
        title="Trending Today"
        items={trendingData?.results}
        isLoading={isTrendingLoading}
        viewAllHref="/movie/trending-today"
        type="movie"
      />
      <MediaCarouselRow
        title="Now Playing in Theatres"
        items={nowPlayingData?.results}
        isLoading={isNowPlayingLoading}
        viewAllHref="/movie/now-playing"
        type="movie"
      />
      <MediaCarouselRow
        title="Top Rated Movies"
        items={topRatedData?.results}
        isLoading={isTopRatedLoading}
        viewAllHref="/movie/top-rated"
        type="movie"
      />
      <MediaCarouselRow
        title="Upcoming Releases"
        items={upcomingData?.results}
        isLoading={isUpcomingLoading}
        viewAllHref="/movie/upcoming"
        type="movie"
      />
    </div>
  );
}

export default DiscoverSections;
