"use client";

import React from "react";
import { ContentCarousel } from "@/components/common/content-carousel";
import { MediaCard } from "@/components/common/media-card";
import { SectionHeader } from "@/components/common/section-header";
import { MovieCardSkeleton } from "@/components/common/movie-card-skeleton";
import {
  usePopularMoviesQuery,
  useTrendingMoviesQuery,
  useNowPlayingMoviesQuery,
  useTopRatedMoviesQuery,
  useUpcomingMoviesQuery,
} from "@/hooks/use-tmdb";
import { Movie } from "@/types";

interface CarouselRowProps {
  title: string;
  movies?: Movie[];
  isLoading: boolean;
  viewAllHref: string;
}

function CarouselRow({ title, movies, isLoading, viewAllHref }: CarouselRowProps) {
  const displayMovies = movies || [];

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

  if (displayMovies.length === 0) return null;

  return (
    <ContentCarousel
      title={title}
      action={{ label: "View all", href: viewAllHref }}
    >
      {displayMovies.map((movie) => (
        <MediaCard
          key={movie.id}
          type="movie"
          id={movie.id}
          title={movie.title}
          image={movie.poster_path}
          rating={movie.vote_average}
          year={movie.release_date?.substring(0, 4)}
          href={`/movie/${movie.id}`}
          variant="shelf"
        />
      ))}
    </ContentCarousel>
  );
}

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
      {/* 1. Popular Movies Carousel */}
      <CarouselRow
        title="Popular Movies"
        movies={popularData?.results}
        isLoading={isPopularLoading}
        viewAllHref="/movie/popular"
      />

      {/* 2. Trending Today Carousel */}
      <CarouselRow
        title="Trending Today"
        movies={trendingData?.results}
        isLoading={isTrendingLoading}
        viewAllHref="/movie/trending-today"
      />

      {/* 3. Now Playing in Theatres Carousel */}
      <CarouselRow
        title="Now Playing in Theatres"
        movies={nowPlayingData?.results}
        isLoading={isNowPlayingLoading}
        viewAllHref="/movie/now-playing"
      />

      {/* 4. Top Rated Movies Carousel */}
      <CarouselRow
        title="Top Rated Movies"
        movies={topRatedData?.results}
        isLoading={isTopRatedLoading}
        viewAllHref="/movie/top-rated"
      />

      {/* 5. Upcoming Releases Carousel */}
      <CarouselRow
        title="Upcoming Releases"
        movies={upcomingData?.results}
        isLoading={isUpcomingLoading}
        viewAllHref="/movie/upcoming"
      />
    </div>
  );
}

export default DiscoverSections;
