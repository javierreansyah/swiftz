"use client";

import React, { useState } from "react";
import { Movie, TVShow } from "@/types";
import { HomeMediaCarousel, MediaItem } from "./home-media-carousel";

export interface TrendingSectionProps {
  movies: Movie[];
  tvShows: TVShow[];
}

export function TrendingSection({ movies, tvShows }: TrendingSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("movies");

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

  return (
    <HomeMediaCarousel
      title="Trending Today"
      subtitle="The most popular stories across cinema & television right now"
      items={activeTab === "movies" ? movieItems : tvItems}
      tabs={[
        { id: "movies", label: "Movies" },
        { id: "tv", label: "TV Shows" },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      viewAllHref={activeTab === "movies" ? "/movie" : "/tv"}
    />
  );
}

export default TrendingSection;
