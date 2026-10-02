import { TMDBError } from "@/lib/tmdb/error";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "";
const BASE_URL = "https://api.themoviedb.org/3";

export async function fetchTMDBClient<T>(
  endpoint: string,
  params: Record<string, string | number> = {},
  options?: RequestInit,
): Promise<T> {
  if (!API_KEY)
    throw new TMDBError("NEXT_PUBLIC_TMDB_API_KEY is not configured", 401);
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", API_KEY);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const headers = new Headers(options?.headers);
  if (options?.body && !headers.has("Content-Type"))
    headers.set("Content-Type", "application/json");
  const timeout =
    typeof AbortSignal.timeout === "function"
      ? AbortSignal.timeout(15000)
      : undefined;
  const signal =
    options?.signal && timeout && typeof AbortSignal.any === "function"
      ? AbortSignal.any([options.signal, timeout])
      : options?.signal || timeout;
  const isPrivate =
    Boolean(params.session_id) || endpoint.startsWith("/authentication/");
  const res = await fetch(url.toString(), {
    ...options,
    headers,
    signal,
    ...(isPrivate ? { cache: "no-store" } : {}),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new TMDBError(
      errorData.status_message ||
        `Failed to fetch ${endpoint}: ${res.status} ${res.statusText}`,
      res.status,
    );
  }

  return res.json();
}
