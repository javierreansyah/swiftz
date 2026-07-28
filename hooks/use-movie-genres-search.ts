import { useState, useEffect } from "react";
import axios from "axios";
import globalApiKey from "@/public/data/api-key";

import { Movie, MovieGenresSearchData } from "@/types";

const useMovieGenresSearch = (page: number, genres: string) => {
  const [moviesWithGenres, setMoviesWithGenres] =
    useState<MovieGenresSearchData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const apiKey = globalApiKey;
        console.log(genres);

        const response = await axios.get(
          "https://api.themoviedb.org/3/discover/movie",
          {
            params: {
              api_key: apiKey,
              page: page,
              with_genres: genres,
            },
          }
        );
        setMoviesWithGenres(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setError(
          "An error occurred while fetching movies. Please try again later."
        );
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [page, genres]);

  return { moviesWithGenres, isLoading, error };
};

export default useMovieGenresSearch;
