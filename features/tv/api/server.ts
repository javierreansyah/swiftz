import "server-only";
import { cache } from "react";
import { TMDBError } from "@/lib/tmdb/error";
import type {
  CastData,
  VideoData,
  MovieImagesData,
} from "@/lib/tmdb/types/common";
import type {
  PopularTVData,
  TVShowDetailsData,
  DiscoverTVFilters,
  TVSeasonDetails,
} from "@/lib/tmdb/types/tv";
import type { TMDBReviewsResponse } from "@/lib/tmdb/types/account";
import { fetchTMDB } from "@/lib/tmdb/server";
import "server-only";

export async function getPopularTVShows(
  page: number = 1,
): Promise<PopularTVData> {
  return fetchTMDB<PopularTVData>("/tv/popular", { page }, 86400);
}

export async function getTrendingTVShows(
  page: number = 1,
): Promise<PopularTVData> {
  return fetchTMDB<PopularTVData>("/trending/tv/day", { page }, 86400);
}

export async function getTopRatedTVShows(
  page: number = 1,
): Promise<PopularTVData> {
  return fetchTMDB<PopularTVData>("/tv/top_rated", { page }, 86400);
}

export async function getOnTheAirTVShows(
  page: number = 1,
): Promise<PopularTVData> {
  return fetchTMDB<PopularTVData>("/tv/on_the_air", { page }, 86400);
}

export const getTVDetails = cache(
  async (
    id: string,
  ): Promise<
    TVShowDetailsData & {
      content_ratings: {
        results: Array<{ iso_3166_1: string; rating: string }>;
      };
    }
  > => {
    if (!/^[1-9]\d*$/.test(id)) throw new TMDBError("Invalid TV ID", 404);
    return fetchTMDB(
      `/tv/${id}`,
      { append_to_response: "content_ratings" },
      86400,
    );
  },
);

export async function getTVCredits(id: string): Promise<CastData> {
  return fetchTMDB<CastData>(`/tv/${id}/credits`, {}, 604800);
}

export async function getTVVideos(id: string): Promise<VideoData> {
  return fetchTMDB<VideoData>(`/tv/${id}/videos`, {}, 604800);
}

export async function getTVRecommendations(
  id: string,
  page: number = 1,
): Promise<PopularTVData> {
  return fetchTMDB<PopularTVData>(`/tv/${id}/recommendations`, { page }, 86400);
}

export async function getTVImages(id: string): Promise<MovieImagesData> {
  return fetchTMDB<MovieImagesData>(`/tv/${id}/images`, {}, 604800);
}

export async function getTVReviews(
  id: string,
  page: number = 1,
): Promise<TMDBReviewsResponse> {
  return fetchTMDB<TMDBReviewsResponse>(`/tv/${id}/reviews`, { page }, 86400);
}

export async function getTVSeasonDetails(
  seriesId: string | number,
  seasonNumber: number,
): Promise<TVSeasonDetails> {
  return fetchTMDB<TVSeasonDetails>(
    `/tv/${seriesId}/season/${seasonNumber}`,
    {},
    604800,
  );
}

export async function discoverTVShows(
  filters: DiscoverTVFilters = {},
): Promise<PopularTVData> {
  const params: Record<string, string | number> = {};
  for (const [key, val] of Object.entries(filters)) {
    if (val !== undefined && val !== "") {
      params[key] = val;
    }
  }
  return fetchTMDB<PopularTVData>("/discover/tv", params, 86400);
}
