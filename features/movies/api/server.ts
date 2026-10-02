import "server-only";
import { cache } from "react";
import { TMDBError } from "@/lib/tmdb/error";
import type {
  PopularMoviesData,
  TrendingMoviesData,
  MovieDetailsData,
  MovieReleaseDateData,
  RecommendationData,
  MovieGenresSearchData,
  DiscoverMoviesData,
  DiscoverMovieFilters,
  MovieCollectionData,
} from "@/lib/tmdb/types/movie";
import type {
  CastData,
  VideoData,
  MovieImagesData,
} from "@/lib/tmdb/types/common";
import { fetchTMDB } from "@/lib/tmdb/server";
import "server-only";

export async function getPopularMovies(
  page: number = 1,
): Promise<PopularMoviesData> {
  return fetchTMDB<PopularMoviesData>("/movie/popular", { page }, 86400);
}

export async function getTrendingMovies(
  page: number = 1,
): Promise<TrendingMoviesData> {
  return fetchTMDB<TrendingMoviesData>("/trending/movie/day", { page }, 86400);
}

export const getMovieDetails = cache(
  async (
    id: string,
  ): Promise<MovieDetailsData & { release_dates: MovieReleaseDateData }> => {
    if (!/^[1-9]\d*$/.test(id)) throw new TMDBError("Invalid movie ID", 404);
    return fetchTMDB(
      `/movie/${id}`,
      { append_to_response: "release_dates" },
      604800,
    );
  },
);

export async function getMovieReleaseDates(
  id: string,
): Promise<MovieReleaseDateData> {
  return fetchTMDB<MovieReleaseDateData>(
    `/movie/${id}/release_dates`,
    {},
    604800,
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
  page: number = 1,
): Promise<RecommendationData> {
  return fetchTMDB<RecommendationData>(
    `/movie/${id}/recommendations`,
    { page },
    86400,
  );
}

export async function getMoviesByGenres(
  genreQuery: string,
  page: number = 1,
): Promise<MovieGenresSearchData> {
  return fetchTMDB<MovieGenresSearchData>(
    "/discover/movie",
    {
      with_genres: genreQuery,
      page,
    },
    86400,
  );
}

export async function getNowPlayingMovies(
  page: number = 1,
): Promise<DiscoverMoviesData> {
  return fetchTMDB<DiscoverMoviesData>("/movie/now_playing", { page }, 86400);
}

export async function getTopRatedMovies(
  page: number = 1,
): Promise<DiscoverMoviesData> {
  return fetchTMDB<DiscoverMoviesData>("/movie/top_rated", { page }, 86400);
}

export async function getUpcomingMovies(
  page: number = 1,
): Promise<DiscoverMoviesData> {
  return fetchTMDB<DiscoverMoviesData>("/movie/upcoming", { page }, 86400);
}

export async function discoverMovies(
  filters: DiscoverMovieFilters = {},
): Promise<DiscoverMoviesData> {
  const params: Record<string, string | number> = {};
  for (const [key, val] of Object.entries(filters)) {
    if (val !== undefined && val !== "") {
      params[key] = val;
    }
  }
  return fetchTMDB<DiscoverMoviesData>("/discover/movie", params, 86400);
}

export async function getMovieCollection(
  collectionId: string | number,
): Promise<MovieCollectionData> {
  return fetchTMDB<MovieCollectionData>(
    `/collection/${collectionId}`,
    {},
    604800,
  );
}
