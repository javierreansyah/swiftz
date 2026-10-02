import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/lib/tmdb/query-keys";
import {
  getAccountFavoriteMovies,
  getAccountWatchlistMovies,
  getAccountRatedMovies,
} from "@/features/library/api/browser";
export function accountFavoritesOptions(
  accountId: number | undefined,
  sessionId: string | null,
  page: number = 1,
  enabled = true,
) {
  return queryOptions({
    queryKey: queryKeys.accountFavorites(accountId, sessionId, page),
    queryFn: ({ signal }) =>
      getAccountFavoriteMovies(accountId!, sessionId!, page, signal),
    enabled: Boolean(accountId && sessionId) && enabled,
    placeholderData: (previous, previousQuery) =>
      previousQuery &&
      previousQuery.queryKey[1] === accountId &&
      previousQuery.queryKey[2] === sessionId
        ? previous
        : undefined,
  });
}
export function accountWatchlistOptions(
  accountId: number | undefined,
  sessionId: string | null,
  page: number = 1,
  enabled = true,
) {
  return queryOptions({
    queryKey: queryKeys.accountWatchlist(accountId, sessionId, page),
    queryFn: ({ signal }) =>
      getAccountWatchlistMovies(accountId!, sessionId!, page, signal),
    enabled: Boolean(accountId && sessionId) && enabled,
    placeholderData: (previous, previousQuery) =>
      previousQuery &&
      previousQuery.queryKey[1] === accountId &&
      previousQuery.queryKey[2] === sessionId
        ? previous
        : undefined,
  });
}
export function accountRatedOptions(
  accountId: number | undefined,
  sessionId: string | null,
  page: number = 1,
  enabled = true,
) {
  return queryOptions({
    queryKey: queryKeys.accountRated(accountId, sessionId, page),
    queryFn: ({ signal }) =>
      getAccountRatedMovies(accountId!, sessionId!, page, signal),
    enabled: Boolean(accountId && sessionId) && enabled,
    placeholderData: (previous, previousQuery) =>
      previousQuery &&
      previousQuery.queryKey[1] === accountId &&
      previousQuery.queryKey[2] === sessionId
        ? previous
        : undefined,
  });
}
