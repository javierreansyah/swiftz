import {
  PopularMoviesData,
  TrendingMoviesData,
  MovieDetailsData,
  CastData,
  RecommendationData,
  SearchData,
  MovieGenresSearchData,
} from "@/types";
import {
  TMDBAccount,
  TMDBSession,
  AccountStates,
  TMDBReviewsResponse,
} from "@/types/auth";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "";
const BASE_URL = "https://api.themoviedb.org/3";

async function fetchTMDBClient<T>(
  endpoint: string,
  params: Record<string, string | number> = {},
  options?: RequestInit
): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", API_KEY);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const res = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.status_message ||
        `Failed to fetch ${endpoint}: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}

// -------------------------------------------------------------
// Core Movie Fetchers
// -------------------------------------------------------------

export async function searchMoviesClient(
  query: string,
  page: number = 1
): Promise<SearchData> {
  if (!query.trim()) {
    return {
      page: 1,
      results: [],
      total_pages: 0,
      total_result: 0,
    };
  }
  return fetchTMDBClient<SearchData>("/search/movie", { query, page });
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
  page: number = 1
): Promise<PopularMoviesData> {
  return fetchTMDBClient<PopularMoviesData>("/movie/popular", { page });
}

export async function getTrendingMoviesClient(
  page: number = 1
): Promise<TrendingMoviesData> {
  return fetchTMDBClient<TrendingMoviesData>("/trending/movie/day", { page });
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
