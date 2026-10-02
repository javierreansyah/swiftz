import type {
  PopularMoviesData,
  TrendingMoviesData,
  MovieDetailsData,
  RecommendationData,
  MovieGenresSearchData,
  DiscoverMoviesData,
  DiscoverMovieFilters,
  WatchProvidersResponse,
  MovieCollectionData,
} from "@/lib/tmdb/types/movie";
import type {
  CastData,
  VideoData,
  MovieImagesData,
} from "@/lib/tmdb/types/common";
import type { TMDBReviewsResponse } from "@/lib/tmdb/types/account";
import { fetchTMDBClient } from "@/lib/tmdb/browser";
export async function getMoviesByGenresClient(
  genreQuery: string,
  page: number = 1,
  signal?: AbortSignal,
): Promise<MovieGenresSearchData> {
  return fetchTMDBClient<MovieGenresSearchData>(
    "/discover/movie",
    {
      with_genres: genreQuery,
      page,
    },
    { signal },
  );
}

export async function getPopularMoviesClient(
  page: number = 1,
  signal?: AbortSignal,
): Promise<PopularMoviesData> {
  return fetchTMDBClient<PopularMoviesData>(
    "/movie/popular",
    { page },
    { signal },
  );
}

export async function getTrendingMoviesClient(
  page: number = 1,
  signal?: AbortSignal,
): Promise<TrendingMoviesData> {
  return fetchTMDBClient<TrendingMoviesData>(
    "/trending/movie/day",
    { page },
    { signal },
  );
}

export async function getNowPlayingMoviesClient(
  page: number = 1,
  signal?: AbortSignal,
): Promise<DiscoverMoviesData> {
  return fetchTMDBClient<DiscoverMoviesData>(
    "/movie/now_playing",
    { page },
    { signal },
  );
}

export async function getTopRatedMoviesClient(
  page: number = 1,
  signal?: AbortSignal,
): Promise<DiscoverMoviesData> {
  return fetchTMDBClient<DiscoverMoviesData>(
    "/movie/top_rated",
    { page },
    { signal },
  );
}

export async function getUpcomingMoviesClient(
  page: number = 1,
  signal?: AbortSignal,
): Promise<DiscoverMoviesData> {
  return fetchTMDBClient<DiscoverMoviesData>(
    "/movie/upcoming",
    { page },
    { signal },
  );
}

export async function discoverMoviesClient(
  filters: DiscoverMovieFilters = {},
  signal?: AbortSignal,
): Promise<DiscoverMoviesData> {
  const params: Record<string, string | number> = {};
  for (const [key, val] of Object.entries(filters)) {
    if (val !== undefined && val !== "") {
      params[key] = val;
    }
  }
  return fetchTMDBClient<DiscoverMoviesData>("/discover/movie", params, {
    signal,
  });
}

export async function getWatchProvidersClient(
  region: string = "US",
  signal?: AbortSignal,
): Promise<WatchProvidersResponse> {
  return fetchTMDBClient<WatchProvidersResponse>(
    "/watch/providers/movie",
    {
      watch_region: region,
    },
    { signal },
  );
}

export async function getMovieCastClient(
  id: string,
  signal?: AbortSignal,
): Promise<CastData> {
  return fetchTMDBClient<CastData>(`/movie/${id}/credits`, {}, { signal });
}

export async function getMovieRecommendationsClient(
  id: string,
  page: number = 1,
  signal?: AbortSignal,
): Promise<RecommendationData> {
  return fetchTMDBClient<RecommendationData>(
    `/movie/${id}/recommendations`,
    {
      page,
    },
    { signal },
  );
}

export async function getMovieDetailsClient(
  id: string,
  signal?: AbortSignal,
): Promise<MovieDetailsData> {
  return fetchTMDBClient<MovieDetailsData>(`/movie/${id}`, {}, { signal });
}

export async function getMovieReviewsClient(
  movieId: string | number,
  page: number = 1,
  signal?: AbortSignal,
): Promise<TMDBReviewsResponse> {
  return fetchTMDBClient<TMDBReviewsResponse>(
    `/movie/${movieId}/reviews`,
    {
      page,
    },
    { signal },
  );
}

export async function getMovieVideosClient(
  id: string | number,
  signal?: AbortSignal,
): Promise<VideoData> {
  return fetchTMDBClient<VideoData>(`/movie/${id}/videos`, {}, { signal });
}

export async function getMovieImagesClient(
  id: string | number,
  signal?: AbortSignal,
): Promise<MovieImagesData> {
  return fetchTMDBClient<MovieImagesData>(
    `/movie/${id}/images`,
    {},
    { signal },
  );
}

export async function getMovieCollectionClient(
  collectionId: string | number,
  signal?: AbortSignal,
): Promise<MovieCollectionData> {
  return fetchTMDBClient<MovieCollectionData>(
    `/collection/${collectionId}`,
    {},
    { signal },
  );
}
