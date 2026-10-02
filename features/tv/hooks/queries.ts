"use client";
import { useQuery } from "@tanstack/react-query";
import type { DiscoverTVFilters } from "@/lib/tmdb/types/tv";
import {
  popularTVShowsOptions,
  trendingTVShowsOptions,
  topRatedTVShowsOptions,
  onTheAirTVShowsOptions,
  airingTodayTVShowsOptions,
  discoverTVShowsOptions,
  tvDetailsOptions,
  tvCreditsOptions,
  tvVideosOptions,
  tvRecommendationsOptions,
  tvReviewsOptions,
  tvSeasonOptions,
} from "@/features/tv/query-options";
export function usePopularTVShowsQuery(page: number = 1, enabled = true) {
  return useQuery(popularTVShowsOptions(page, enabled));
}

export function useTrendingTVShowsQuery(page: number = 1, enabled = true) {
  return useQuery(trendingTVShowsOptions(page, enabled));
}

export function useTopRatedTVShowsQuery(page: number = 1, enabled = true) {
  return useQuery(topRatedTVShowsOptions(page, enabled));
}

export function useOnTheAirTVShowsQuery(page: number = 1, enabled = true) {
  return useQuery(onTheAirTVShowsOptions(page, enabled));
}

export function useAiringTodayTVShowsQuery(page: number = 1, enabled = true) {
  return useQuery(airingTodayTVShowsOptions(page, enabled));
}

export function useDiscoverTVShowsQuery(
  filters: DiscoverTVFilters = {},
  enabled = true,
) {
  return useQuery(discoverTVShowsOptions(filters, enabled));
}

export function useTVDetailsQuery(id: string | number) {
  return useQuery(tvDetailsOptions(id));
}

export function useTVCreditsQuery(id: string | number) {
  return useQuery(tvCreditsOptions(id));
}

export function useTVVideosQuery(id: string | number, enabled = true) {
  return useQuery(tvVideosOptions(id, enabled));
}

export function useTVRecommendationsQuery(
  id: string | number,
  page: number = 1,
  enabled = true,
) {
  return useQuery(tvRecommendationsOptions(id, page, enabled));
}

export function useTVReviewsQuery(
  tvId: string | number,
  page: number = 1,
  enabled = true,
) {
  return useQuery(tvReviewsOptions(tvId, page, enabled));
}

export function useTVSeasonQuery(
  seriesId: string | number | undefined,
  seasonNumber: number | undefined,
  enabled = true,
) {
  return useQuery(tvSeasonOptions(seriesId, seasonNumber, enabled));
}
