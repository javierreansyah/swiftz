import "server-only";
import { TMDBError } from "@/lib/tmdb/error";
const API_KEY =
  process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY || "";
const BASE_URL = "https://api.themoviedb.org/3";

export async function fetchTMDB<T>(
  endpoint: string,
  params: Record<string, string | number> = {},
  revalidate: number = 86400, // 24 hours default
): Promise<T> {
  if (!API_KEY) throw new TMDBError("TMDB API key is not configured", 401);
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", API_KEY);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  const res = await fetch(url.toString(), {
    next: { revalidate },
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    throw new TMDBError(
      `Failed to fetch ${endpoint}: ${res.statusText}`,
      res.status,
    );
  }

  return res.json();
}
