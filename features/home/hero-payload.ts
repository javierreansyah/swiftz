import type { Movie } from "@/lib/tmdb/types/movie";
export type HeroMovie = Pick<
  Movie,
  | "id"
  | "title"
  | "overview"
  | "poster_path"
  | "backdrop_path"
  | "vote_average"
  | "release_date"
>;
export function toHeroMovie(movie: Movie): HeroMovie {
  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path,
    vote_average: movie.vote_average,
    release_date: movie.release_date,
  };
}
