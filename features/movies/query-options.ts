import { queryOptions, keepPreviousData } from "@tanstack/react-query";
import { queryKeys } from "@/lib/tmdb/query-keys";
import {
  getMoviesByGenresClient,
  getPopularMoviesClient,
  getTrendingMoviesClient,
  getNowPlayingMoviesClient,
  getTopRatedMoviesClient,
  getUpcomingMoviesClient,
  discoverMoviesClient,
  getWatchProvidersClient,
  getMovieCastClient,
  getMovieRecommendationsClient,
  getMovieReviewsClient,
  getMovieVideosClient,
  getMovieImagesClient,
  getMovieCollectionClient,
} from "@/features/movies/api/browser";
import type { DiscoverMovieFilters } from "@/lib/tmdb/types/movie";
export function moviesByGenresOptions(genreQuery: string, page: number = 1) {
  return queryOptions({
    queryKey: queryKeys.genresMovies(genreQuery, page),
    queryFn: ({ signal }) => getMoviesByGenresClient(genreQuery, page, signal),
    enabled: Boolean(genreQuery && genreQuery.trim().length > 0),
    placeholderData: keepPreviousData,
  });
}

export function popularMoviesOptions(page: number = 1, enabled = true) {
  return queryOptions({
    queryKey: queryKeys.popularMovies(page),
    queryFn: ({ signal }) => getPopularMoviesClient(page, signal),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function trendingMoviesOptions(page: number = 1, enabled = true) {
  return queryOptions({
    queryKey: queryKeys.trendingMovies(page),
    queryFn: ({ signal }) => getTrendingMoviesClient(page, signal),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function nowPlayingMoviesOptions(page: number = 1, enabled = true) {
  return queryOptions({
    queryKey: queryKeys.nowPlayingMovies(page),
    queryFn: ({ signal }) => getNowPlayingMoviesClient(page, signal),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function topRatedMoviesOptions(page: number = 1, enabled = true) {
  return queryOptions({
    queryKey: queryKeys.topRatedMovies(page),
    queryFn: ({ signal }) => getTopRatedMoviesClient(page, signal),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function upcomingMoviesOptions(page: number = 1, enabled = true) {
  return queryOptions({
    queryKey: queryKeys.upcomingMovies(page),
    queryFn: ({ signal }) => getUpcomingMoviesClient(page, signal),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function discoverMoviesOptions(
  filters: DiscoverMovieFilters = {},
  enabled = true,
) {
  return queryOptions({
    queryKey: queryKeys.discoverMovies(filters),
    queryFn: ({ signal }) => discoverMoviesClient(filters, signal),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function watchProvidersOptions(region: string = "US") {
  return queryOptions({
    queryKey: queryKeys.watchProviders(region),
    queryFn: ({ signal }) => getWatchProvidersClient(region, signal),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export function movieCastOptions(id: string) {
  return queryOptions({
    queryKey: queryKeys.movieCast(id),
    queryFn: ({ signal }) => getMovieCastClient(id, signal),
    enabled: Boolean(id),
  });
}

export function movieRecommendationsOptions(
  id: string,
  page: number = 1,
  enabled = true,
) {
  return queryOptions({
    queryKey: queryKeys.movieRecommendations(id, page),
    queryFn: ({ signal }) => getMovieRecommendationsClient(id, page, signal),
    enabled: Boolean(id) && enabled,
    placeholderData: keepPreviousData,
  });
}

export function movieReviewsOptions(
  movieId: string | number,
  page: number = 1,
  enabled = true,
) {
  return queryOptions({
    queryKey: queryKeys.movieReviews(movieId, page),
    queryFn: ({ signal }) => getMovieReviewsClient(movieId, page, signal),
    enabled: Boolean(movieId) && enabled,
    placeholderData: keepPreviousData,
  });
}

export function movieVideosOptions(id: string | number, enabled = true) {
  return queryOptions({
    queryKey: queryKeys.movieVideos(id),
    queryFn: ({ signal }) => getMovieVideosClient(id, signal),
    enabled: Boolean(id) && enabled,
  });
}

export function movieImagesOptions(id: string | number, enabled = true) {
  return queryOptions({
    queryKey: queryKeys.movieImages(id),
    queryFn: ({ signal }) => getMovieImagesClient(id, signal),
    enabled: Boolean(id) && enabled,
  });
}

export function movieCollectionOptions(
  collectionId: string | number | null | undefined,
  enabled = true,
) {
  return queryOptions({
    queryKey: queryKeys.movieCollection(collectionId),
    queryFn: ({ signal }) => getMovieCollectionClient(collectionId!, signal),
    enabled: Boolean(collectionId) && enabled,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
