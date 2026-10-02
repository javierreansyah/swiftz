import {
  PopularMoviesData,
  TrendingMoviesData,
  MovieDetailsData,
  CastData,
  RecommendationData,
  SearchData,
  MovieGenresSearchData,
  VideoData,
  MovieImagesData,
  DiscoverMoviesData,
  DiscoverMovieFilters,
  TMDBKeywordSearchResponse,
  WatchProvidersResponse,
  PopularTVData,
  TVShowDetailsData,
  DiscoverTVFilters,
  PopularPeopleData,
  PersonDetailsData,
  PersonCombinedCredits,
  PersonExternalIds,
  MultiSearchResponse,
  SearchGenericResponse,
  SearchCollectionItem,
  SearchCompanyItem,
  TVSeasonDetails,
  MovieCollectionData,
} from "@/types";
import {
  TMDBAccount,
  TMDBSession,
  AccountStates,
  TMDBReviewsResponse,
} from "@/types/auth";
import { TMDBError } from "@/lib/tmdb-error";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "";
const BASE_URL = "https://api.themoviedb.org/3";

async function fetchTMDBClient<T>(
  endpoint: string,
  params: Record<string, string | number> = {},
  options?: RequestInit
): Promise<T> {
  if (!API_KEY) throw new TMDBError("NEXT_PUBLIC_TMDB_API_KEY is not configured", 401);
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", API_KEY);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const headers = new Headers(options?.headers);
  if (options?.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const timeout = typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(15000) : undefined;
  const signal = options?.signal && timeout && typeof AbortSignal.any === "function"
    ? AbortSignal.any([options.signal, timeout]) : options?.signal || timeout;
  const isPrivate = Boolean(params.session_id) || endpoint.startsWith("/authentication/");
  const res = await fetch(url.toString(), {
    ...options,
    headers,
    signal,
    ...(isPrivate ? { cache: "no-store" } : {}),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new TMDBError(
      errorData.status_message ||
        `Failed to fetch ${endpoint}: ${res.status} ${res.statusText}`,
      res.status
    );
  }

  return res.json();
}

// -------------------------------------------------------------
// Core Movie Fetchers
// -------------------------------------------------------------

export async function searchMoviesClient(
  query: string,
  page: number = 1,
  signal?: AbortSignal
): Promise<SearchData> {
  if (!query.trim()) {
    return {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }
  return fetchTMDBClient<SearchData>("/search/movie", { query: query.trim(), page }, { signal });
}

export async function getMoviesByGenresClient(
  genreQuery: string,
  page: number = 1
): Promise<MovieGenresSearchData> {
  return fetchTMDBClient<MovieGenresSearchData>("/discover/movie", {
    with_genres: genreQuery,
    page,
  });
}

export async function getPopularMoviesClient(
  page: number = 1,
  signal?: AbortSignal
): Promise<PopularMoviesData> {
  return fetchTMDBClient<PopularMoviesData>("/movie/popular", { page }, { signal });
}

export async function getTrendingMoviesClient(
  page: number = 1,
  signal?: AbortSignal
): Promise<TrendingMoviesData> {
  return fetchTMDBClient<TrendingMoviesData>("/trending/movie/day", { page }, { signal });
}

export async function getNowPlayingMoviesClient(
  page: number = 1,
  signal?: AbortSignal
): Promise<DiscoverMoviesData> {
  return fetchTMDBClient<DiscoverMoviesData>("/movie/now_playing", { page }, { signal });
}

export async function getTopRatedMoviesClient(
  page: number = 1,
  signal?: AbortSignal
): Promise<DiscoverMoviesData> {
  return fetchTMDBClient<DiscoverMoviesData>("/movie/top_rated", { page }, { signal });
}

export async function getUpcomingMoviesClient(
  page: number = 1,
  signal?: AbortSignal
): Promise<DiscoverMoviesData> {
  return fetchTMDBClient<DiscoverMoviesData>("/movie/upcoming", { page }, { signal });
}

export async function discoverMoviesClient(
  filters: DiscoverMovieFilters = {},
  signal?: AbortSignal
): Promise<DiscoverMoviesData> {
  const params: Record<string, string | number> = {};
  for (const [key, val] of Object.entries(filters)) {
    if (val !== undefined && val !== "") {
      params[key] = val;
    }
  }
  return fetchTMDBClient<DiscoverMoviesData>("/discover/movie", params, { signal });
}

export async function searchKeywordsClient(
  query: string,
  signal?: AbortSignal
): Promise<TMDBKeywordSearchResponse> {
  if (!query.trim()) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
  return fetchTMDBClient<TMDBKeywordSearchResponse>("/search/keyword", {
    query: query.trim(),
  }, { signal });
}

export async function getWatchProvidersClient(
  region: string = "US"
): Promise<WatchProvidersResponse> {
  return fetchTMDBClient<WatchProvidersResponse>("/watch/providers/movie", {
    watch_region: region,
  });
}


export async function getMovieCastClient(id: string): Promise<CastData> {
  return fetchTMDBClient<CastData>(`/movie/${id}/credits`);
}

export async function getMovieRecommendationsClient(
  id: string,
  page: number = 1
): Promise<RecommendationData> {
  return fetchTMDBClient<RecommendationData>(`/movie/${id}/recommendations`, {
    page,
  });
}

export async function getMovieDetailsClient(
  id: string
): Promise<MovieDetailsData> {
  return fetchTMDBClient<MovieDetailsData>(`/movie/${id}`);
}

export async function getMovieReviewsClient(
  movieId: string | number,
  page: number = 1
): Promise<TMDBReviewsResponse> {
  return fetchTMDBClient<TMDBReviewsResponse>(`/movie/${movieId}/reviews`, {
    page,
  });
}

export async function getMovieVideosClient(
  id: string | number
): Promise<VideoData> {
  return fetchTMDBClient<VideoData>(`/movie/${id}/videos`);
}

export async function getMovieImagesClient(
  id: string | number
): Promise<MovieImagesData> {
  return fetchTMDBClient<MovieImagesData>(`/movie/${id}/images`);
}

// -------------------------------------------------------------
// Authentication & User Account Operations
// -------------------------------------------------------------

export async function createRequestToken(): Promise<string> {
  const data = await fetchTMDBClient<{ success: boolean; request_token: string }>(
    "/authentication/token/new"
  );
  return data.request_token;
}

export async function createSession(requestToken: string): Promise<string> {
  const data = await fetchTMDBClient<TMDBSession>(
    "/authentication/session/new",
    {},
    {
      method: "POST",
      body: JSON.stringify({ request_token: requestToken }),
    }
  );
  return data.session_id;
}

export async function deleteSession(sessionId: string): Promise<boolean> {
  try {
    const data = await fetchTMDBClient<{ success: boolean }>(
      "/authentication/session",
      {},
      {
        method: "DELETE",
        body: JSON.stringify({ session_id: sessionId }),
      }
    );
    return data.success;
  } catch {
    return false;
  }
}

export async function getAccountDetails(
  sessionId: string
): Promise<TMDBAccount> {
  return fetchTMDBClient<TMDBAccount>("/account", {
    session_id: sessionId,
  });
}

export async function getMovieAccountStates(
  movieId: string | number,
  sessionId: string
): Promise<AccountStates> {
  return fetchTMDBClient<AccountStates>(`/movie/${movieId}/account_states`, {
    session_id: sessionId,
  });
}

export async function setMovieFavorite(
  accountId: number,
  sessionId: string,
  movieId: number,
  favorite: boolean
): Promise<{ success: boolean; status_message: string }> {
  return fetchTMDBClient(
    `/account/${accountId}/favorite`,
    { session_id: sessionId },
    {
      method: "POST",
      body: JSON.stringify({
        media_type: "movie",
        media_id: movieId,
        favorite,
      }),
    }
  );
}

export async function setMovieWatchlist(
  accountId: number,
  sessionId: string,
  movieId: number,
  watchlist: boolean
): Promise<{ success: boolean; status_message: string }> {
  return fetchTMDBClient(
    `/account/${accountId}/watchlist`,
    { session_id: sessionId },
    {
      method: "POST",
      body: JSON.stringify({
        media_type: "movie",
        media_id: movieId,
        watchlist,
      }),
    }
  );
}

export async function setMovieRating(
  movieId: number,
  sessionId: string,
  rating: number
): Promise<{ success: boolean; status_message: string }> {
  return fetchTMDBClient(
    `/movie/${movieId}/rating`,
    { session_id: sessionId },
    {
      method: "POST",
      body: JSON.stringify({ value: rating }),
    }
  );
}

export async function deleteMovieRating(
  movieId: number,
  sessionId: string
): Promise<{ success: boolean; status_message: string }> {
  return fetchTMDBClient(
    `/movie/${movieId}/rating`,
    { session_id: sessionId },
    {
      method: "DELETE",
    }
  );
}

export async function getTVAccountStates(
  tvId: string | number,
  sessionId: string
): Promise<AccountStates> {
  return fetchTMDBClient<AccountStates>(`/tv/${tvId}/account_states`, {
    session_id: sessionId,
  });
}

export async function setTVFavorite(
  accountId: number,
  sessionId: string,
  tvId: number,
  favorite: boolean
): Promise<{ success: boolean; status_message: string }> {
  return fetchTMDBClient(
    `/account/${accountId}/favorite`,
    { session_id: sessionId },
    {
      method: "POST",
      body: JSON.stringify({
        media_type: "tv",
        media_id: tvId,
        favorite,
      }),
    }
  );
}

export async function setTVWatchlist(
  accountId: number,
  sessionId: string,
  tvId: number,
  watchlist: boolean
): Promise<{ success: boolean; status_message: string }> {
  return fetchTMDBClient(
    `/account/${accountId}/watchlist`,
    { session_id: sessionId },
    {
      method: "POST",
      body: JSON.stringify({
        media_type: "tv",
        media_id: tvId,
        watchlist,
      }),
    }
  );
}

export async function setTVRating(
  tvId: number,
  sessionId: string,
  rating: number
): Promise<{ success: boolean; status_message: string }> {
  return fetchTMDBClient(
    `/tv/${tvId}/rating`,
    { session_id: sessionId },
    {
      method: "POST",
      body: JSON.stringify({ value: rating }),
    }
  );
}

export async function deleteTVRating(
  tvId: number,
  sessionId: string
): Promise<{ success: boolean; status_message: string }> {
  return fetchTMDBClient(
    `/tv/${tvId}/rating`,
    { session_id: sessionId },
    {
      method: "DELETE",
    }
  );
}

export async function getTVReviewsClient(
  tvId: string | number,
  page: number = 1
): Promise<TMDBReviewsResponse> {
  return fetchTMDBClient<TMDBReviewsResponse>(`/tv/${tvId}/reviews`, { page });
}

export async function getAccountFavoriteMovies(
  accountId: number,
  sessionId: string,
  page: number = 1
): Promise<PopularMoviesData> {
  return fetchTMDBClient<PopularMoviesData>(
    `/account/${accountId}/favorite/movies`,
    { session_id: sessionId, page, sort_by: "created_at.desc" }
  );
}

export async function getAccountWatchlistMovies(
  accountId: number,
  sessionId: string,
  page: number = 1
): Promise<PopularMoviesData> {
  return fetchTMDBClient<PopularMoviesData>(
    `/account/${accountId}/watchlist/movies`,
    { session_id: sessionId, page, sort_by: "created_at.desc" }
  );
}

export async function getAccountRatedMovies(
  accountId: number,
  sessionId: string,
  page: number = 1
): Promise<PopularMoviesData> {
  return fetchTMDBClient<PopularMoviesData>(
    `/account/${accountId}/rated/movies`,
    { session_id: sessionId, page, sort_by: "created_at.desc" }
  );
}

// -------------------------------------------------------------
// TV Shows Client Fetchers
// -------------------------------------------------------------

export async function getPopularTVShowsClient(
  page: number = 1,
  signal?: AbortSignal
): Promise<PopularTVData> {
  return fetchTMDBClient<PopularTVData>("/tv/popular", { page }, { signal });
}

export async function getTrendingTVShowsClient(
  page: number = 1,
  signal?: AbortSignal
): Promise<PopularTVData> {
  return fetchTMDBClient<PopularTVData>("/trending/tv/day", { page }, { signal });
}

export async function getTopRatedTVShowsClient(
  page: number = 1,
  signal?: AbortSignal
): Promise<PopularTVData> {
  return fetchTMDBClient<PopularTVData>("/tv/top_rated", { page }, { signal });
}

export async function getOnTheAirTVShowsClient(
  page: number = 1,
  signal?: AbortSignal
): Promise<PopularTVData> {
  return fetchTMDBClient<PopularTVData>("/tv/on_the_air", { page }, { signal });
}

export async function getAiringTodayTVShowsClient(
  page: number = 1,
  signal?: AbortSignal
): Promise<PopularTVData> {
  return fetchTMDBClient<PopularTVData>("/tv/airing_today", { page }, { signal });
}

export async function getTVDetailsClient(
  id: string | number
): Promise<TVShowDetailsData> {
  return fetchTMDBClient<TVShowDetailsData>(`/tv/${id}`);
}

export async function getTVCreditsClient(
  id: string | number
): Promise<CastData> {
  return fetchTMDBClient<CastData>(`/tv/${id}/credits`);
}

export async function getTVVideosClient(
  id: string | number
): Promise<VideoData> {
  return fetchTMDBClient<VideoData>(`/tv/${id}/videos`);
}

export async function getTVRecommendationsClient(
  id: string | number,
  page: number = 1
): Promise<PopularTVData> {
  return fetchTMDBClient<PopularTVData>(`/tv/${id}/recommendations`, { page });
}

export async function discoverTVShowsClient(
  filters: DiscoverTVFilters = {},
  signal?: AbortSignal
): Promise<PopularTVData> {
  const params: Record<string, string | number> = {};
  for (const [key, val] of Object.entries(filters)) {
    if (val !== undefined && val !== "") {
      params[key] = val;
    }
  }
  return fetchTMDBClient<PopularTVData>("/discover/tv", params, { signal });
}

export async function getTVSeasonDetailsClient(
  seriesId: string | number,
  seasonNumber: number
): Promise<TVSeasonDetails> {
  return fetchTMDBClient<TVSeasonDetails>(
    `/tv/${seriesId}/season/${seasonNumber}`
  );
}

export async function getMovieCollectionClient(
  collectionId: string | number
): Promise<MovieCollectionData> {
  return fetchTMDBClient<MovieCollectionData>(`/collection/${collectionId}`);
}

// -------------------------------------------------------------
// People Client Fetchers
// -------------------------------------------------------------

export async function getPopularPeopleClient(
  page: number = 1,
  signal?: AbortSignal
): Promise<PopularPeopleData> {
  return fetchTMDBClient<PopularPeopleData>("/person/popular", { page }, { signal });
}

export async function getPersonDetailsClient(
  id: string | number
): Promise<PersonDetailsData> {
  return fetchTMDBClient<PersonDetailsData>(`/person/${id}`);
}

export async function getPersonCombinedCreditsClient(
  id: string | number
): Promise<PersonCombinedCredits> {
  return fetchTMDBClient<PersonCombinedCredits>(
    `/person/${id}/combined_credits`
  );
}

export async function getPersonExternalIdsClient(
  id: string | number
): Promise<PersonExternalIds> {
  return fetchTMDBClient<PersonExternalIds>(`/person/${id}/external_ids`);
}

// -------------------------------------------------------------
// Categorized & Multi-Search Client Fetchers
// -------------------------------------------------------------

export async function searchMultiClient(
  query: string,
  page: number = 1,
  signal?: AbortSignal
): Promise<MultiSearchResponse> {
  if (!query.trim()) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
  return fetchTMDBClient<MultiSearchResponse>("/search/multi", {
    query: query.trim(),
    page,
  }, { signal });
}

export async function searchTVClient(
  query: string,
  page: number = 1,
  signal?: AbortSignal
): Promise<PopularTVData> {
  if (!query.trim()) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
  return fetchTMDBClient<PopularTVData>("/search/tv", { query: query.trim(), page }, { signal });
}

export async function searchPeopleClient(
  query: string,
  page: number = 1,
  signal?: AbortSignal
): Promise<PopularPeopleData> {
  if (!query.trim()) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
  return fetchTMDBClient<PopularPeopleData>("/search/person", { query: query.trim(), page }, { signal });
}

export async function searchCollectionsClient(
  query: string,
  page: number = 1,
  signal?: AbortSignal
): Promise<SearchGenericResponse<SearchCollectionItem>> {
  if (!query.trim()) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
  return fetchTMDBClient<SearchGenericResponse<SearchCollectionItem>>(
    "/search/collection",
    { query: query.trim(), page },
    { signal }
  );
}

export async function searchCompaniesClient(
  query: string,
  page: number = 1,
  signal?: AbortSignal
): Promise<SearchGenericResponse<SearchCompanyItem>> {
  if (!query.trim()) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
  return fetchTMDBClient<SearchGenericResponse<SearchCompanyItem>>(
    "/search/company",
    { query: query.trim(), page },
    { signal }
  );
}
