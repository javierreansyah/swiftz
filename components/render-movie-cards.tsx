import React from "react";
import MovieCard from "./movie-card";
import MovieCardSkeleton from "./movie-card-skeleton";

interface Movie {
  adult: boolean;
  backdrop_path: string;
  id: number;
  title: string;
  original_language: string;
  original_title: string;
  overview: string;
  poster_path: string;
  media_type: string;
  genre_ids: number[];
  popularity: number;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface RenderCardsProps {
  movies: Movie[];
  count: number;
  className?: string;
}

const RenderMovieCards: React.FC<RenderCardsProps> = ({
  movies,
  count,
  className,
}) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 ${className}`}
    >
      {movies.slice(0, count).map((movie) => (
        <div key={movie.id}>
          <MovieCard
            id={movie.id}
            title={movie.title}
            poster={movie.poster_path}
            rating={movie.vote_average}
          />
        </div>
      ))}
    </div>
  );
};

export default RenderMovieCards;
