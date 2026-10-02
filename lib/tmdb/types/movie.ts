import type { PaginatedResponse } from "@/lib/tmdb/types/pagination";
export interface Movie {
  adult: boolean;
  backdrop_path: string;
  id: number;
  title: string;
  original_language: string;
  original_title: string;
  overview: string;
  poster_path: string;
  media_type?: string;
  genre_ids: number[];
  popularity: number;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export type PopularMoviesData = PaginatedResponse<Movie>;

export type TrendingMoviesData = PaginatedResponse<Movie>;

export type MovieGenresSearchData = PaginatedResponse<Movie>;

export type RecommendationData = PaginatedResponse<Movie>;

export interface MovieDetailsData {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: null | {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  };
  budget: number;
  genres: {
    id: number;
    name: string;
  }[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface ReleaseDate {
  certification?: string;
  descriptors?: string[];
  iso_639_1?: string;
  note?: string;
  release_date: string;
  type: number;
}

export interface MovieReleaseDateData {
  id: number;
  results: {
    iso_3166_1: string;
    release_dates: ReleaseDate[];
  }[];
}

export type DiscoverMoviesData = PaginatedResponse<Movie>;

export interface WatchProviderItem {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority?: number;
}

export interface WatchProvidersResponse {
  results: WatchProviderItem[];
}

export interface DiscoverMovieFilters {
  page?: number;
  sort_by?: string;
  with_genres?: string;
  without_genres?: string;
  with_keywords?: string;
  with_original_language?: string;
  "primary_release_date.gte"?: string;
  "primary_release_date.lte"?: string;
  "vote_average.gte"?: number;
  "vote_average.lte"?: number;
  "vote_count.gte"?: number;
  "with_runtime.gte"?: number;
  "with_runtime.lte"?: number;
  certification_country?: string;
  certification?: string;
  watch_region?: string;
  with_watch_providers?: string;
  with_watch_monetization_types?: string;
  with_release_type?: string;
}

export interface MovieCollectionPart {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type?: string;
  genre_ids?: number[];
  popularity: number;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface MovieCollectionData {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  parts: MovieCollectionPart[];
}
