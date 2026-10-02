"use client";
import { useQuery } from "@tanstack/react-query";
import {
  accountFavoritesOptions,
  accountWatchlistOptions,
  accountRatedOptions,
} from "@/features/library/query-options";
export function useAccountFavoritesQuery(
  accountId: number | undefined,
  sessionId: string | null,
  page: number = 1,
  enabled = true,
) {
  return useQuery(accountFavoritesOptions(accountId, sessionId, page, enabled));
}
export function useAccountWatchlistQuery(
  accountId: number | undefined,
  sessionId: string | null,
  page: number = 1,
  enabled = true,
) {
  return useQuery(accountWatchlistOptions(accountId, sessionId, page, enabled));
}
export function useAccountRatedQuery(
  accountId: number | undefined,
  sessionId: string | null,
  page: number = 1,
  enabled = true,
) {
  return useQuery(accountRatedOptions(accountId, sessionId, page, enabled));
}
