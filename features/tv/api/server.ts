import "server-only";
import { cache } from "react";
import { TMDBError } from "@/lib/tmdb/error";
import type { PopularTVData, TVShowDetailsData } from "@/lib/tmdb/types/tv";
import { fetchTMDB } from "@/lib/tmdb/server";

export async function getPopularTVShows(
  page: number = 1,
): Promise<PopularTVData> {
  return fetchTMDB<PopularTVData>("/tv/popular", { page }, 86400);
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
