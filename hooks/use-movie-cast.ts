import { useState, useEffect } from "react";
import axios from "axios";
import globalApiKey from "@/public/data/api-key";

import { CastData, Cast, Crew } from "@/types";

const useMovieCast = (id: string) => {
  const [movieCast, setMovieCast] = useState<CastData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieCast = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const castResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/credits`,
          {
            params: {
              api_key: globalApiKey,
            },
          }
        );

        setMovieCast(castResponse.data);
      } catch (error) {
        setError("Error Fetching Data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieCast();
  }, [id]);

  return { movieCast, isLoading, error };
};

export default useMovieCast;
