import { useState, useEffect } from "react";
import axios from "axios";
import globalApiKey from "@/public/data/api-key";

interface Movie {
  adult: boolean;
  backdrop_path: string;
  id: number;
  title: string;
  original_language: string;
  original_title: string;
  overview: string;
  poster_path: string;
  media_type: string;
  genre_ids: number[];
  popularity: number;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface PopularMoviesData {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const usePopularMovies = (page: number) => {
  const [popularMovies, setPopularMovies] = useState<PopularMoviesData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const apiKey = globalApiKey;
        const response = await axios.get(
          "https://api.themoviedb.org/3/movie/popular",
          {
            params: {
              api_key: apiKey,
              page: page,
            },
          }
        );
        setPopularMovies(response.data);
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

  return { popularMovies, isLoading, error };
};

export default usePopularMovies;
