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
  MovieImagesData,
} from "@/types";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "";
const BASE_URL = "https://api.themoviedb.org/3";

async function fetchTMDB<T>(
  endpoint: string,
  params: Record<string, string | number> = {},
  revalidate: number = 86400 // 24 hours default
): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", API_KEY);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  const res = await fetch(url.toString(), {
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${res.statusText}`);
  }

  return res.json();
}

export async function getPopularMovies(
  page: number = 1
): Promise<PopularMoviesData> {
  return fetchTMDB<PopularMoviesData>("/movie/popular", { page }, 86400);
}

export async function getTrendingMovies(
  page: number = 1
): Promise<TrendingMoviesData> {
  return fetchTMDB<TrendingMoviesData>("/trending/movie/day", { page }, 86400);
}

// 7 days (604,800s) revalidation for movie details and sub-resources
export async function getMovieDetails(id: string): Promise<MovieDetailsData> {
  return fetchTMDB<MovieDetailsData>(`/movie/${id}`, {}, 604800);
}

export async function getMovieReleaseDates(
  id: string
): Promise<MovieReleaseDateData> {
  return fetchTMDB<MovieReleaseDateData>(
    `/movie/${id}/release_dates`,
    {},
    604800
  );
}

export async function getMovieCast(id: string): Promise<CastData> {
  return fetchTMDB<CastData>(`/movie/${id}/credits`, {}, 604800);
}

export async function getMovieVideos(id: string): Promise<VideoData> {
  return fetchTMDB<VideoData>(`/movie/${id}/videos`, {}, 604800);
}

export async function getMovieImages(id: string): Promise<MovieImagesData> {
  return fetchTMDB<MovieImagesData>(`/movie/${id}/images`, {}, 604800);
}

export async function getMovieRecommendations(
  id: string,
  page: number = 1
): Promise<RecommendationData> {
  return fetchTMDB<RecommendationData>(
    `/movie/${id}/recommendations`,
    { page },
    86400
  );
}

export async function searchMovies(
  query: string,
  page: number = 1
): Promise<SearchData> {
  return fetchTMDB<SearchData>("/search/movie", { query, page }, 86400);
}

export async function getMoviesByGenres(
  genreQuery: string,
  page: number = 1
): Promise<MovieGenresSearchData> {
  return fetchTMDB<MovieGenresSearchData>(
    "/discover/movie",
    {
      with_genres: genreQuery,
      page,
    },
    86400
  );
}
