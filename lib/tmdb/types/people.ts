import type { PaginatedResponse } from "@/lib/tmdb/types/pagination";
export interface PersonKnownFor {
  id: number;
  title?: string;
  name?: string;
  media_type: "movie" | "tv";
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  overview: string;
  release_date?: string;
  first_air_date?: string;
}

export interface Person {
  id: number;
  name: string;
  original_name: string;
  media_type?: string;
  profile_path: string | null;
  adult: boolean;
  popularity: number;
  gender: number;
  known_for_department: string;
  known_for?: PersonKnownFor[];
}

export type PopularPeopleData = PaginatedResponse<Person>;

export interface PersonDetailsData {
  id: number;
  name: string;
  also_known_as: string[];
  biography: string;
  birthday: string | null;
  deathday: string | null;
  gender: number;
  homepage: string | null;
  imdb_id: string | null;
  known_for_department: string;
  place_of_birth: string | null;
  popularity: number;
  profile_path: string | null;
  adult: boolean;
}

export interface PersonCastCredit {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  character: string;
  credit_id: string;
  media_type: "movie" | "tv";
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  genre_ids: number[];
  episode_count?: number;
  order?: number;
}

export interface PersonCrewCredit {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  department: string;
  job: string;
  credit_id: string;
  media_type: "movie" | "tv";
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  genre_ids: number[];
  episode_count?: number;
}

export interface PersonCombinedCredits {
  id: number;
  cast: PersonCastCredit[];
  crew: PersonCrewCredit[];
}

export interface PersonExternalIds {
  id: number;
  imdb_id?: string | null;
  facebook_id?: string | null;
  instagram_id?: string | null;
  twitter_id?: string | null;
  tiktok_id?: string | null;
  wikidata_id?: string | null;
}
