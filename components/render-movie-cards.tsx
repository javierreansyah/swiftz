import React from "react";
import MovieCard from "./movie-card";
import { Movie } from "@/types";

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
    <ul
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 ${className}`}
    >
      {movies.slice(0, count).map((movie) => (
        <li key={movie.id}>
          <MovieCard
            id={movie.id}
            title={movie.title}
            poster={movie.poster_path}
            rating={movie.vote_average}
          />
        </li>
      ))}
    </ul>
  );
};

export default RenderMovieCards;
