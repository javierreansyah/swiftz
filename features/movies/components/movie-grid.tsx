import { MovieCard } from "@/features/movies/components/movie-card";
import type { Movie } from "@/lib/tmdb/types/movie";
import { cn } from "@/lib/utils";
export interface MovieGridProps {
  movies: Movie[];
  count?: number;
  className?: string;
}

export function MovieGrid({ movies, count, className }: MovieGridProps) {
  const displayMovies = count ? movies.slice(0, count) : movies;

  return (
    <ul
      className={cn(
        "grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
        className,
      )}
    >
      {displayMovies.map((movie) => (
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
}
