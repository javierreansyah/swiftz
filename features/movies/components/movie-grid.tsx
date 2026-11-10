import { MovieCard } from "@/features/movies/components/movie-card";
import type { Movie } from "@/lib/tmdb/types/movie";
import { cn } from "@/lib/utils";
import { EAGER_GRID_CARDS } from "@/features/media/components/media-card";
export interface MovieGridProps {
  movies: Movie[];
  count?: number;
  className?: string;
  /** Cards are page-level results: titles become h2 and the first row loads eagerly. */
  pageResults?: boolean;
}

export function MovieGrid({
  movies,
  count,
  className,
  pageResults = true,
}: MovieGridProps) {
  const displayMovies = count ? movies.slice(0, count) : movies;

  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
        className,
      )}
    >
      {displayMovies.map((movie, index) => (
        <li key={movie.id}>
          <MovieCard
            id={movie.id}
            title={movie.title}
            poster={movie.poster_path}
            rating={movie.vote_average}
            priority={pageResults && index < EAGER_GRID_CARDS}
            titleAs={pageResults ? "h2" : "h3"}
          />
        </li>
      ))}
    </ul>
  );
}
