import { useState, useEffect } from "react";
import axios from "axios";
import globalApiKey from "@/public/data/api-key";

import { Movie, TrendingMoviesData } from "@/types";

const useTrendingMovies = (page: number) => {
  const [trendingMovies, setTrendingMovies] =
    useState<TrendingMoviesData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const apiKey = globalApiKey;
        const response = await axios.get(
          "https://api.themoviedb.org/3/trending/movie/day",
          {
            params: {
              api_key: apiKey,
              page: page,
            },
          }
        );
        setTrendingMovies(response.data);
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
  }, [page]);

  return { trendingMovies, isLoading, error };
};

export default useTrendingMovies;
