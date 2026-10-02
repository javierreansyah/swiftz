import type { PaginatedResponse } from "@/lib/tmdb/types/pagination";
import type { Movie } from "@/lib/tmdb/types/movie";
export type SearchData = PaginatedResponse<Movie>;

export interface TMDBKeyword {
  id: number;
  name: string;
}

export type TMDBKeywordSearchResponse = PaginatedResponse<TMDBKeyword>;

export interface SearchCollectionItem {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  adult: boolean;
  original_language: string;
  original_name: string;
}

export interface SearchCompanyItem {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface MultiSearchResultItem {
  id: number;
  media_type: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  profile_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  popularity: number;
  known_for_department?: string;
}

export type MultiSearchResponse = PaginatedResponse<MultiSearchResultItem>;

export type SearchGenericResponse<T> = PaginatedResponse<T>;

export interface SearchTypeCounts {
  movies: number;
  tv: number;
  people: number;
  collections: number;
  keywords: number;
  companies: number;
  networks: number;
  awards: number;
}
