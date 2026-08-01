import {
  PopularMoviesData,
  TrendingMoviesData,
  MovieDetailsData,
  MovieReleaseDateData,
  CastData,
  VideoData,
  RecommendationData,
  SearchData,
  MovieGenresSearchData,
} from "@/types";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "";
const BASE_URL = "https://api.themoviedb.org/3";

async function fetchTMDB<T>(
  endpoint: string,
  params: Record<string, string | number> = {}
): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", API_KEY);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${res.statusText}`);
  }

  return res.json();
}

export async function getPopularMovies(
  page: number = 1
): Promise<PopularMoviesData> {
  return fetchTMDB<PopularMoviesData>("/movie/popular", { page });
}

export async function getTrendingMovies(
  page: number = 1
): Promise<TrendingMoviesData> {
  return fetchTMDB<TrendingMoviesData>("/trending/movie/day", { page });
}

export async function getMovieDetails(id: string): Promise<MovieDetailsData> {
  return fetchTMDB<MovieDetailsData>(`/movie/${id}`);
}

export async function getMovieReleaseDates(
  id: string
): Promise<MovieReleaseDateData> {
  return fetchTMDB<MovieReleaseDateData>(`/movie/${id}/release_dates`);
}

export async function getMovieCast(id: string): Promise<CastData> {
  return fetchTMDB<CastData>(`/movie/${id}/credits`);
}

export async function getMovieVideos(id: string): Promise<VideoData> {
  return fetchTMDB<VideoData>(`/movie/${id}/videos`);
}

export async function getMovieRecommendations(
  id: string,
  page: number = 1
): Promise<RecommendationData> {
  return fetchTMDB<RecommendationData>(`/movie/${id}/recommendations`, { page });
}

export async function searchMovies(
  query: string,
  page: number = 1
): Promise<SearchData> {
  return fetchTMDB<SearchData>("/search/movie", { query, page });
}

export async function getMoviesByGenres(
  genreQuery: string,
  page: number = 1
): Promise<MovieGenresSearchData> {
  return fetchTMDB<MovieGenresSearchData>("/discover/movie", {
    with_genres: genreQuery,
    page,
  });
}
