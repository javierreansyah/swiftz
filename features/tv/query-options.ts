import { queryOptions, keepPreviousData } from "@tanstack/react-query";
import { queryKeys } from "@/lib/tmdb/query-keys";
import {
  getPopularTVShowsClient,
  getTrendingTVShowsClient,
  getTopRatedTVShowsClient,
  getOnTheAirTVShowsClient,
  getAiringTodayTVShowsClient,
  getTVDetailsClient,
  getTVCreditsClient,
  getTVVideosClient,
  getTVRecommendationsClient,
  discoverTVShowsClient,
  getTVReviewsClient,
  getTVSeasonDetailsClient,
} from "@/features/tv/api/browser";
import type { DiscoverTVFilters } from "@/lib/tmdb/types/tv";
export function popularTVShowsOptions(page: number = 1, enabled = true) {
  return queryOptions({
    queryKey: queryKeys.popularTv(page),
    queryFn: ({ signal }) => getPopularTVShowsClient(page, signal),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function trendingTVShowsOptions(page: number = 1, enabled = true) {
  return queryOptions({
    queryKey: queryKeys.trendingTv(page),
    queryFn: ({ signal }) => getTrendingTVShowsClient(page, signal),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function topRatedTVShowsOptions(page: number = 1, enabled = true) {
  return queryOptions({
    queryKey: queryKeys.topRatedTv(page),
    queryFn: ({ signal }) => getTopRatedTVShowsClient(page, signal),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function onTheAirTVShowsOptions(page: number = 1, enabled = true) {
  return queryOptions({
    queryKey: queryKeys.onTheAirTv(page),
    queryFn: ({ signal }) => getOnTheAirTVShowsClient(page, signal),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function airingTodayTVShowsOptions(page: number = 1, enabled = true) {
  return queryOptions({
    queryKey: queryKeys.airingTodayTv(page),
    queryFn: ({ signal }) => getAiringTodayTVShowsClient(page, signal),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function discoverTVShowsOptions(
  filters: DiscoverTVFilters = {},
  enabled = true,
) {
  return queryOptions({
    queryKey: queryKeys.discoverTv(filters),
    queryFn: ({ signal }) => discoverTVShowsClient(filters, signal),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function tvDetailsOptions(id: string | number) {
  return queryOptions({
    queryKey: queryKeys.tvDetails(id),
    queryFn: ({ signal }) => getTVDetailsClient(id, signal),
    enabled: Boolean(id),
  });
}

export function tvCreditsOptions(id: string | number) {
  return queryOptions({
    queryKey: queryKeys.tvCredits(id),
    queryFn: ({ signal }) => getTVCreditsClient(id, signal),
    enabled: Boolean(id),
  });
}

export function tvVideosOptions(id: string | number, enabled = true) {
  return queryOptions({
    queryKey: queryKeys.tvVideos(id),
    queryFn: ({ signal }) => getTVVideosClient(id, signal),
    enabled: Boolean(id) && enabled,
  });
}

export function tvRecommendationsOptions(
  id: string | number,
  page: number = 1,
  enabled = true,
) {
  return queryOptions({
    queryKey: queryKeys.tvRecommendations(id, page),
    queryFn: ({ signal }) => getTVRecommendationsClient(id, page, signal),
    enabled: Boolean(id) && enabled,
    placeholderData: keepPreviousData,
  });
}

export function tvReviewsOptions(
  tvId: string | number,
  page: number = 1,
  enabled = true,
) {
  return queryOptions({
    queryKey: queryKeys.tvReviews(tvId, page),
    queryFn: ({ signal }) => getTVReviewsClient(tvId, page, signal),
    enabled: Boolean(tvId) && enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function tvSeasonOptions(
  seriesId: string | number | undefined,
  seasonNumber: number | undefined,
  enabled = true,
) {
  return queryOptions({
    queryKey: queryKeys.tvSeasonDetails(seriesId, seasonNumber),
    queryFn: ({ signal }) =>
      getTVSeasonDetailsClient(seriesId!, seasonNumber!, signal),
    enabled:
      Boolean(seriesId !== undefined && seasonNumber !== undefined) && enabled,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}
