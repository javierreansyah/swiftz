import type { MovieDetailsData } from "@/lib/tmdb/types/movie";
export type MovieDetailView = Pick<
  MovieDetailsData,
  | "id"
  | "title"
  | "overview"
  | "poster_path"
  | "backdrop_path"
  | "release_date"
  | "vote_average"
  | "vote_count"
  | "popularity"
  | "belongs_to_collection"
>;
export function toMovieDetailView(data: MovieDetailsData): MovieDetailView {
  return {
    id: data.id,
    title: data.title,
    overview: data.overview,
    poster_path: data.poster_path,
    backdrop_path: data.backdrop_path,
    release_date: data.release_date,
    vote_average: data.vote_average,
    vote_count: data.vote_count,
    popularity: data.popularity,
    belongs_to_collection: data.belongs_to_collection
      ? {
          id: data.belongs_to_collection.id,
          name: data.belongs_to_collection.name,
          poster_path: data.belongs_to_collection.poster_path,
          backdrop_path: data.belongs_to_collection.backdrop_path,
        }
      : null,
  };
}
