import {
  PopularMoviesData,
  TrendingMoviesData,
  MovieDetailsData,
  MovieReleaseDateData,
  CastData,
  VideoData,
  RecommendationData,
  SearchData,
  MovieGenresSearchData,
  MovieImagesData,
  DiscoverMoviesData,
  DiscoverMovieFilters,
  PopularTVData,
  TVShowDetailsData,
  DiscoverTVFilters,
  PopularPeopleData,
  PersonDetailsData,
  PersonCombinedCredits,
  PersonExternalIds,
  TVSeasonDetails,
  MovieCollectionData,
} from "@/types";
import { TMDBReviewsResponse } from "@/types/auth";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "";
const BASE_URL = "https://api.themoviedb.org/3";

async function fetchTMDB<T>(
  endpoint: string,
  params: Record<string, string | number> = {},
  revalidate: number = 86400 // 24 hours default
): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", API_KEY);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  const res = await fetch(url.toString(), {
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${res.statusText}`);
  }

  return res.json();
}

export async function getPopularMovies(
  page: number = 1
): Promise<PopularMoviesData> {
  return fetchTMDB<PopularMoviesData>("/movie/popular", { page }, 86400);
}

export async function getTrendingMovies(
  page: number = 1
): Promise<TrendingMoviesData> {
  return fetchTMDB<TrendingMoviesData>("/trending/movie/day", { page }, 86400);
}

// 7 days (604,800s) revalidation for movie details and sub-resources
export async function getMovieDetails(id: string): Promise<MovieDetailsData> {
  return fetchTMDB<MovieDetailsData>(`/movie/${id}`, {}, 604800);
}

export async function getMovieReleaseDates(
  id: string
): Promise<MovieReleaseDateData> {
  return fetchTMDB<MovieReleaseDateData>(
    `/movie/${id}/release_dates`,
    {},
    604800
  );
}

export async function getMovieCast(id: string): Promise<CastData> {
  return fetchTMDB<CastData>(`/movie/${id}/credits`, {}, 604800);
}

export async function getMovieVideos(id: string): Promise<VideoData> {
  return fetchTMDB<VideoData>(`/movie/${id}/videos`, {}, 604800);
}

export async function getMovieImages(id: string): Promise<MovieImagesData> {
  return fetchTMDB<MovieImagesData>(`/movie/${id}/images`, {}, 604800);
}

export async function getMovieRecommendations(
  id: string,
  page: number = 1
): Promise<RecommendationData> {
  return fetchTMDB<RecommendationData>(
    `/movie/${id}/recommendations`,
    { page },
    86400
  );
}

export async function searchMovies(
  query: string,
  page: number = 1
): Promise<SearchData> {
  return fetchTMDB<SearchData>("/search/movie", { query, page }, 86400);
}

export async function getMoviesByGenres(
  genreQuery: string,
  page: number = 1
): Promise<MovieGenresSearchData> {
  return fetchTMDB<MovieGenresSearchData>(
    "/discover/movie",
    {
      with_genres: genreQuery,
      page,
    },
    86400
  );
}

export async function getNowPlayingMovies(
  page: number = 1
): Promise<DiscoverMoviesData> {
  return fetchTMDB<DiscoverMoviesData>("/movie/now_playing", { page }, 86400);
}

export async function getTopRatedMovies(
  page: number = 1
): Promise<DiscoverMoviesData> {
  return fetchTMDB<DiscoverMoviesData>("/movie/top_rated", { page }, 86400);
}

export async function getUpcomingMovies(
  page: number = 1
): Promise<DiscoverMoviesData> {
  return fetchTMDB<DiscoverMoviesData>("/movie/upcoming", { page }, 86400);
}

export async function discoverMovies(
  filters: DiscoverMovieFilters = {}
): Promise<DiscoverMoviesData> {
  const params: Record<string, string | number> = {};
  for (const [key, val] of Object.entries(filters)) {
    if (val !== undefined && val !== "") {
      params[key] = val;
    }
  }
  return fetchTMDB<DiscoverMoviesData>("/discover/movie", params, 86400);
}

// -------------------------------------------------------------
// TV Shows Server Fetchers
// -------------------------------------------------------------

export async function getPopularTVShows(
  page: number = 1
): Promise<PopularTVData> {
  return fetchTMDB<PopularTVData>("/tv/popular", { page }, 86400);
}

export async function getTrendingTVShows(
  page: number = 1
): Promise<PopularTVData> {
  return fetchTMDB<PopularTVData>("/trending/tv/day", { page }, 86400);
}

export async function getTopRatedTVShows(
  page: number = 1
): Promise<PopularTVData> {
  return fetchTMDB<PopularTVData>("/tv/top_rated", { page }, 86400);
}

export async function getOnTheAirTVShows(
  page: number = 1
): Promise<PopularTVData> {
  return fetchTMDB<PopularTVData>("/tv/on_the_air", { page }, 86400);
}

export async function getTVDetails(id: string): Promise<TVShowDetailsData> {
  return fetchTMDB<TVShowDetailsData>(`/tv/${id}`, {}, 604800);
}

export async function getTVCredits(id: string): Promise<CastData> {
  return fetchTMDB<CastData>(`/tv/${id}/credits`, {}, 604800);
}

export async function getTVVideos(id: string): Promise<VideoData> {
  return fetchTMDB<VideoData>(`/tv/${id}/videos`, {}, 604800);
}

export async function getTVRecommendations(
  id: string,
  page: number = 1
): Promise<PopularTVData> {
  return fetchTMDB<PopularTVData>(`/tv/${id}/recommendations`, { page }, 86400);
}

export async function getTVImages(id: string): Promise<MovieImagesData> {
  return fetchTMDB<MovieImagesData>(`/tv/${id}/images`, {}, 604800);
}

export async function getTVReviews(
  id: string,
  page: number = 1
): Promise<TMDBReviewsResponse> {
  return fetchTMDB<TMDBReviewsResponse>(`/tv/${id}/reviews`, { page }, 86400);
}

export async function getTVContentRatings(id: string): Promise<{
  id: number;
  results: Array<{ iso_3166_1: string; rating: string }>;
}> {
  return fetchTMDB(`/tv/${id}/content_ratings`, {}, 604800);
}

export async function getTVSeasonDetails(
  seriesId: string | number,
  seasonNumber: number
): Promise<TVSeasonDetails> {
  return fetchTMDB<TVSeasonDetails>(
    `/tv/${seriesId}/season/${seasonNumber}`,
    {},
    604800
  );
}

export async function getMovieCollection(
  collectionId: string | number
): Promise<MovieCollectionData> {
  return fetchTMDB<MovieCollectionData>(`/collection/${collectionId}`, {}, 604800);
}

export async function discoverTVShows(
  filters: DiscoverTVFilters = {}
): Promise<PopularTVData> {
  const params: Record<string, string | number> = {};
  for (const [key, val] of Object.entries(filters)) {
    if (val !== undefined && val !== "") {
      params[key] = val;
    }
  }
  return fetchTMDB<PopularTVData>("/discover/tv", params, 86400);
}

// -------------------------------------------------------------
// People Server Fetchers
// -------------------------------------------------------------

export async function getPopularPeople(
  page: number = 1
): Promise<PopularPeopleData> {
  return fetchTMDB<PopularPeopleData>("/person/popular", { page }, 86400);
}

export async function getPersonDetails(
  id: string
): Promise<PersonDetailsData> {
  return fetchTMDB<PersonDetailsData>(`/person/${id}`, {}, 604800);
}

export async function getPersonCombinedCredits(
  id: string
): Promise<PersonCombinedCredits> {
  return fetchTMDB<PersonCombinedCredits>(
    `/person/${id}/combined_credits`,
    {},
    604800
  );
}

export async function getPersonExternalIds(
  id: string
): Promise<PersonExternalIds> {
  return fetchTMDB<PersonExternalIds>(
    `/person/${id}/external_ids`,
    {},
    604800
  );
}


