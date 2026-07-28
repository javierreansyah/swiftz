import { useState, useEffect } from "react";
import axios from "axios";
import globalApiKey from "@/public/data/api-key";

import { Movie, RecommendationData } from "@/types";

const useMovieRecommendation = (id: string, page: number) => {
  const [movieRecommendation, setMovies] = useState<RecommendationData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const apiKey = globalApiKey;
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/recommendations`,
          {
            params: {
              api_key: apiKey,
              page: page,
            },
          }
        );
        setMovies(response.data);
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
  }, [id, page]);

  return { movieRecommendation, isLoading, error };
};

export default useMovieRecommendation;
