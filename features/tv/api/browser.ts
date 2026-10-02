import type { CastData, VideoData } from "@/lib/tmdb/types/common";
import type {
  PopularTVData,
  TVShowDetailsData,
  DiscoverTVFilters,
  TVSeasonDetails,
} from "@/lib/tmdb/types/tv";
import type { TMDBReviewsResponse } from "@/lib/tmdb/types/account";
import { fetchTMDBClient } from "@/lib/tmdb/browser";
export async function getTVReviewsClient(
  tvId: string | number,
  page: number = 1,
  signal?: AbortSignal,
): Promise<TMDBReviewsResponse> {
  return fetchTMDBClient<TMDBReviewsResponse>(
    `/tv/${tvId}/reviews`,
    { page },
    { signal },
  );
}

export async function getPopularTVShowsClient(
  page: number = 1,
  signal?: AbortSignal,
): Promise<PopularTVData> {
  return fetchTMDBClient<PopularTVData>("/tv/popular", { page }, { signal });
}

export async function getTrendingTVShowsClient(
  page: number = 1,
  signal?: AbortSignal,
): Promise<PopularTVData> {
  return fetchTMDBClient<PopularTVData>(
    "/trending/tv/day",
    { page },
    { signal },
  );
}

export async function getTopRatedTVShowsClient(
  page: number = 1,
  signal?: AbortSignal,
): Promise<PopularTVData> {
  return fetchTMDBClient<PopularTVData>("/tv/top_rated", { page }, { signal });
}

export async function getOnTheAirTVShowsClient(
  page: number = 1,
  signal?: AbortSignal,
): Promise<PopularTVData> {
  return fetchTMDBClient<PopularTVData>("/tv/on_the_air", { page }, { signal });
}

export async function getAiringTodayTVShowsClient(
  page: number = 1,
  signal?: AbortSignal,
): Promise<PopularTVData> {
  return fetchTMDBClient<PopularTVData>(
    "/tv/airing_today",
    { page },
    { signal },
  );
}

export async function getTVDetailsClient(
  id: string | number,
  signal?: AbortSignal,
): Promise<TVShowDetailsData> {
  return fetchTMDBClient<TVShowDetailsData>(`/tv/${id}`, {}, { signal });
}

export async function getTVCreditsClient(
  id: string | number,
  signal?: AbortSignal,
): Promise<CastData> {
  return fetchTMDBClient<CastData>(`/tv/${id}/credits`, {}, { signal });
}

export async function getTVVideosClient(
  id: string | number,
  signal?: AbortSignal,
): Promise<VideoData> {
  return fetchTMDBClient<VideoData>(`/tv/${id}/videos`, {}, { signal });
}

export async function getTVRecommendationsClient(
  id: string | number,
  page: number = 1,
  signal?: AbortSignal,
): Promise<PopularTVData> {
  return fetchTMDBClient<PopularTVData>(
    `/tv/${id}/recommendations`,
    { page },
    { signal },
  );
}

export async function discoverTVShowsClient(
  filters: DiscoverTVFilters = {},
  signal?: AbortSignal,
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
  seasonNumber: number,
  signal?: AbortSignal,
): Promise<TVSeasonDetails> {
  return fetchTMDBClient<TVSeasonDetails>(
    `/tv/${seriesId}/season/${seasonNumber}`,
    {},
    { signal },
  );
}
