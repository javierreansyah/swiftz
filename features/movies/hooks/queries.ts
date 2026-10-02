"use client";
import { useQuery } from "@tanstack/react-query";
import type { DiscoverMovieFilters } from "@/lib/tmdb/types/movie";
import {
  moviesByGenresOptions,
  popularMoviesOptions,
  trendingMoviesOptions,
  nowPlayingMoviesOptions,
  topRatedMoviesOptions,
  upcomingMoviesOptions,
  discoverMoviesOptions,
  watchProvidersOptions,
  movieCastOptions,
  movieRecommendationsOptions,
  movieReviewsOptions,
  movieVideosOptions,
  movieImagesOptions,
  movieCollectionOptions,
} from "@/features/movies/query-options";
export function useMoviesByGenresQuery(genreQuery: string, page: number = 1) {
  return useQuery(moviesByGenresOptions(genreQuery, page));
}

export function usePopularMoviesQuery(page: number = 1, enabled = true) {
  return useQuery(popularMoviesOptions(page, enabled));
}

export function useTrendingMoviesQuery(page: number = 1, enabled = true) {
  return useQuery(trendingMoviesOptions(page, enabled));
}

export function useNowPlayingMoviesQuery(page: number = 1, enabled = true) {
  return useQuery(nowPlayingMoviesOptions(page, enabled));
}

export function useTopRatedMoviesQuery(page: number = 1, enabled = true) {
  return useQuery(topRatedMoviesOptions(page, enabled));
}

export function useUpcomingMoviesQuery(page: number = 1, enabled = true) {
  return useQuery(upcomingMoviesOptions(page, enabled));
}

export function useDiscoverMoviesQuery(
  filters: DiscoverMovieFilters = {},
  enabled = true,
) {
  return useQuery(discoverMoviesOptions(filters, enabled));
}

export function useWatchProvidersQuery(region: string = "US") {
  return useQuery(watchProvidersOptions(region));
}

export function useMovieCastQuery(id: string) {
  return useQuery(movieCastOptions(id));
}

export function useMovieRecommendationsQuery(
  id: string,
  page: number = 1,
  enabled = true,
) {
  return useQuery(movieRecommendationsOptions(id, page, enabled));
}

export function useMovieReviewsQuery(
  movieId: string | number,
  page: number = 1,
  enabled = true,
) {
  return useQuery(movieReviewsOptions(movieId, page, enabled));
}

export function useMovieVideosQuery(id: string | number, enabled = true) {
  return useQuery(movieVideosOptions(id, enabled));
}

export function useMovieImagesQuery(id: string | number, enabled = true) {
  return useQuery(movieImagesOptions(id, enabled));
}

export function useMovieCollectionQuery(
  collectionId: string | number | null | undefined,
  enabled = true,
) {
  return useQuery(movieCollectionOptions(collectionId, enabled));
}
