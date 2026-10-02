"use client";

import React from "react";
import { useVisible } from "@/hooks/use-visible";
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
  const trending = useVisible();
  const nowPlaying = useVisible();
  const topRated = useVisible();
  const upcoming = useVisible();
  const { data: popularData, isLoading: isPopularLoading } =
    usePopularMoviesQuery(1);
  const { data: trendingData, isLoading: isTrendingLoading } =
    useTrendingMoviesQuery(1, trending.visible);
  const { data: nowPlayingData, isLoading: isNowPlayingLoading } =
    useNowPlayingMoviesQuery(1, nowPlaying.visible);
  const { data: topRatedData, isLoading: isTopRatedLoading } =
    useTopRatedMoviesQuery(1, topRated.visible);
  const { data: upcomingData, isLoading: isUpcomingLoading } =
    useUpcomingMoviesQuery(1, upcoming.visible);

  return (
    <div className="space-y-12">
      <MediaCarouselRow
        title="Popular Movies"
        items={popularData?.results}
        isLoading={isPopularLoading}
        viewAllHref="/movie/popular"
        type="movie"
      />
      <div ref={trending.ref}>
      <MediaCarouselRow
        title="Trending Today"
        items={trendingData?.results}
        isLoading={!trending.visible || isTrendingLoading}
        viewAllHref="/movie/trending-today"
        type="movie"
      />
      </div>
      <div ref={nowPlaying.ref}>
      <MediaCarouselRow
        title="Now Playing in Theatres"
        items={nowPlayingData?.results}
        isLoading={!nowPlaying.visible || isNowPlayingLoading}
        viewAllHref="/movie/now-playing"
        type="movie"
      />
      </div>
      <div ref={topRated.ref}>
      <MediaCarouselRow
        title="Top Rated Movies"
        items={topRatedData?.results}
        isLoading={!topRated.visible || isTopRatedLoading}
        viewAllHref="/movie/top-rated"
        type="movie"
      />
      </div>
      <div ref={upcoming.ref}>
      <MediaCarouselRow
        title="Upcoming Releases"
        items={upcomingData?.results}
        isLoading={!upcoming.visible || isUpcomingLoading}
        viewAllHref="/movie/upcoming"
        type="movie"
      />
      </div>
    </div>
  );
}

export default DiscoverSections;
