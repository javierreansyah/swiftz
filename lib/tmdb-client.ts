import {
  PopularMoviesData,
  TrendingMoviesData,
  MovieDetailsData,
  CastData,
  RecommendationData,
  SearchData,
  MovieGenresSearchData,
} from "@/types";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "";
const BASE_URL = "https://api.themoviedb.org/3";

async function fetchTMDBClient<T>(
  endpoint: string,
  params: Record<string, string | number> = {}
): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", API_KEY);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${res.statusText}`);
  }

  return res.json();
}

export async function searchMoviesClient(
  query: string,
  page: number = 1
): Promise<SearchData> {
  if (!query.trim()) {
    return {
      page: 1,
      results: [],
      total_pages: 0,
      total_result: 0,
    };
  }
  return fetchTMDBClient<SearchData>("/search/movie", { query, page });
}

export async function getMoviesByGenresClient(
  genreQuery: string,
  page: number = 1
): Promise<MovieGenresSearchData> {
  return fetchTMDBClient<MovieGenresSearchData>("/discover/movie", {
    with_genres: genreQuery,
    page,
  });
}

export async function getPopularMoviesClient(
  page: number = 1
): Promise<PopularMoviesData> {
  return fetchTMDBClient<PopularMoviesData>("/movie/popular", { page });
}

export async function getTrendingMoviesClient(
  page: number = 1
): Promise<TrendingMoviesData> {
  return fetchTMDBClient<TrendingMoviesData>("/trending/movie/day", { page });
}

export async function getMovieCastClient(id: string): Promise<CastData> {
  return fetchTMDBClient<CastData>(`/movie/${id}/credits`);
}

export async function getMovieRecommendationsClient(
  id: string,
  page: number = 1
): Promise<RecommendationData> {
  return fetchTMDBClient<RecommendationData>(`/movie/${id}/recommendations`, {
    page,
  });
}

export async function getMovieDetailsClient(
  id: string
): Promise<MovieDetailsData> {
  return fetchTMDBClient<MovieDetailsData>(`/movie/${id}`);
}
