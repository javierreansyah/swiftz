import type { PaginatedResponse } from "@/lib/tmdb/types/pagination";
export interface TVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  genre_ids: number[];
  origin_country: string[];
  original_language: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  media_type?: string;
}

export type PopularTVData = PaginatedResponse<TVShow>;

export interface DiscoverTVFilters {
  page?: number;
  sort_by?: string;
  with_genres?: string;
  without_genres?: string;
  first_air_date_year?: number;
  "first_air_date.gte"?: string;
  "first_air_date.lte"?: string;
  "vote_average.gte"?: number;
  "vote_average.lte"?: number;
  with_networks?: string;
  with_watch_providers?: string;
  watch_region?: string;
  "air_date.gte"?: string;
  "air_date.lte"?: string;
}

export interface TVSeason {
  air_date: string | null;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  vote_average?: number;
}

export interface TVEpisode {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  runtime: number | null;
  crew?: {
    id: number;
    credit_id: string;
    name: string;
    department: string;
    job: string;
    profile_path: string | null;
  }[];
  guest_stars?: {
    id: number;
    name: string;
    credit_id: string;
    character: string;
    order: number;
    profile_path: string | null;
  }[];
}

export interface TVSeasonDetails extends TVSeason {
  _id?: string;
  episodes: TVEpisode[];
}

export interface TVNetwork {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface TVShowDetailsData {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  last_air_date: string;
  homepage: string;
  in_production: boolean;
  languages: string[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  popularity: number;
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
  genres: { id: number; name: string }[];
  created_by: {
    id: number;
    credit_id: string;
    name: string;
    gender: number;
    profile_path: string | null;
  }[];
  networks: TVNetwork[];
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  seasons: TVSeason[];
}
