"use client";

import React, { useState } from "react";
import { useTrendingMoviesQuery, useTrendingTVShowsQuery } from "@/hooks/use-tmdb";
import { HomeMediaCarousel, MediaItem } from "./home-media-carousel";
import { HomeShelfLoading } from "./home-shelf-loading";

export function TrendingSection() {
  const [activeTab, setActiveTab] = useState<string>("movies");
  const movieQuery = useTrendingMoviesQuery(1, activeTab === "movies");
  const tvQuery = useTrendingTVShowsQuery(1, activeTab === "tv");
  const movies = movieQuery.data?.results || [];
  const tvShows = tvQuery.data?.results || [];
  const activeQuery = activeTab === "movies" ? movieQuery : tvQuery;

  const movieItems: MediaItem[] = movies.map((m) => ({
    id: m.id,
    title: m.title,
    poster_path: m.poster_path,
    vote_average: m.vote_average,
    release_year: m.release_date ? m.release_date.substring(0, 4) : undefined,
    media_type: "movie",
  }));

  const tvItems: MediaItem[] = tvShows.map((t) => ({
    id: t.id,
    title: t.name,
    poster_path: t.poster_path,
    vote_average: t.vote_average,
    release_year: t.first_air_date ? t.first_air_date.substring(0, 4) : undefined,
    media_type: "tv",
  }));

  if (!activeQuery.data) return <HomeShelfLoading title="Trending Today" isError={activeQuery.isError} />;

  return (
    <HomeMediaCarousel
      title="Trending Today"
      items={activeTab === "movies" ? movieItems : tvItems}
      tabs={[
        { id: "movies", label: "Movies" },
        { id: "tv", label: "TV Shows" },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      viewAllHref={
        activeTab === "movies"
          ? "/movie/trending-today"
          : "/tv/trending-today"
      }
    />
  );
}

export default TrendingSection;
