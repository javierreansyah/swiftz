import type { PopularMoviesData } from "@/lib/tmdb/types/movie";
import { fetchTMDBClient } from "@/lib/tmdb/browser";
export async function getAccountFavoriteMovies(
  accountId: number,
  sessionId: string,
  page: number = 1,
  signal?: AbortSignal,
): Promise<PopularMoviesData> {
  return fetchTMDBClient<PopularMoviesData>(
    `/account/${accountId}/favorite/movies`,
    { session_id: sessionId, page, sort_by: "created_at.desc" },
    { signal },
  );
}

export async function getAccountWatchlistMovies(
  accountId: number,
  sessionId: string,
  page: number = 1,
  signal?: AbortSignal,
): Promise<PopularMoviesData> {
  return fetchTMDBClient<PopularMoviesData>(
    `/account/${accountId}/watchlist/movies`,
    { session_id: sessionId, page, sort_by: "created_at.desc" },
    { signal },
  );
}

export async function getAccountRatedMovies(
  accountId: number,
  sessionId: string,
  page: number = 1,
  signal?: AbortSignal,
): Promise<PopularMoviesData> {
  return fetchTMDBClient<PopularMoviesData>(
    `/account/${accountId}/rated/movies`,
    { session_id: sessionId, page, sort_by: "created_at.desc" },
    { signal },
  );
}
