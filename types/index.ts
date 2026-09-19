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

export interface PopularMoviesData {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface TrendingMoviesData {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface MovieGenresSearchData {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface RecommendationData {
  page: number;
  results: Movie[];
  total_pages: number;
  total_result: number;
}

export interface SearchData {
  page: number;
  results: Movie[];
  total_pages: number;
  total_result: number;
}

export interface CastData {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

export interface Cast {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface Crew {
  adult: boolean;
  credit_id: string;
  department: string;
  gender: number;
  id: number;
  job: string;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
}

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

export interface VideoData {
  id: string;
  results: Video[];
}

export interface Video {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

export interface MovieImageItem {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface MovieImagesData {
  id: number;
  backdrops: MovieImageItem[];
  posters: MovieImageItem[];
  logos: MovieImageItem[];
}

export interface DiscoverMoviesData {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface TMDBKeyword {
  id: number;
  name: string;
}

export interface TMDBKeywordSearchResponse {
  page: number;
  results: TMDBKeyword[];
  total_pages: number;
  total_results: number;
}

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
}

// -------------------------------------------------------------
// TV Shows Types
// -------------------------------------------------------------

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

export interface PopularTVData {
  page: number;
  results: TVShow[];
  total_pages: number;
  total_results: number;
}

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

// -------------------------------------------------------------
// People Types
// -------------------------------------------------------------

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

export interface PopularPeopleData {
  page: number;
  results: Person[];
  total_pages: number;
  total_results: number;
}

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

// -------------------------------------------------------------
// Categorized Search Types
// -------------------------------------------------------------

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

export interface MultiSearchResponse {
  page: number;
  results: MultiSearchResultItem[];
  total_pages: number;
  total_results: number;
}

export interface SearchGenericResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

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


