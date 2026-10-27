import "server-only";
import { cache } from "react";
import { TMDBError } from "@/lib/tmdb/error";
import type {
  PopularMoviesData,
  MovieDetailsData,
  MovieReleaseDateData,
} from "@/lib/tmdb/types/movie";
import { fetchTMDB } from "@/lib/tmdb/server";

export async function getPopularMovies(
  page: number = 1,
): Promise<PopularMoviesData> {
  return fetchTMDB<PopularMoviesData>("/movie/popular", { page }, 86400);
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
