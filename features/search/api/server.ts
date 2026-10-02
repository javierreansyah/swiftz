import "server-only";
import type { SearchData } from "@/lib/tmdb/types/search";
import { fetchTMDB } from "@/lib/tmdb/server";
import "server-only";

export async function searchMovies(
  query: string,
  page: number = 1,
): Promise<SearchData> {
  return fetchTMDB<SearchData>("/search/movie", { query, page }, 86400);
}
