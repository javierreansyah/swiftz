import "server-only";
import { fetchTMDB } from "@/lib/tmdb/server";
import "server-only";

export async function getTVContentRatings(id: string): Promise<{
  id: number;
  results: Array<{ iso_3166_1: string; rating: string }>;
}> {
  return fetchTMDB(`/tv/${id}/content_ratings`, {}, 604800);
}
