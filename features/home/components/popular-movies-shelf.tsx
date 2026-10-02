"use client";
import type { Movie } from "@/lib/tmdb/types/movie";
import {
  type MediaItem,
  HomeMediaCarousel,
} from "@/features/home/components/home-media-carousel";
export interface PopularMoviesShelfProps {
  movies: Movie[];
}

export function PopularMoviesShelf({ movies }: PopularMoviesShelfProps) {
  if (!movies || movies.length === 0) return null;

  const items: MediaItem[] = movies.map((movie) => ({
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
    release_year: movie.release_date
      ? movie.release_date.substring(0, 4)
      : undefined,
    media_type: "movie",
  }));

  return (
    <div className="relative z-10">
      <HomeMediaCarousel
        title="Popular Movies"
        items={items}
        viewAllHref="/movie/popular"
      />
    </div>
  );
}
