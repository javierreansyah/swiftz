import { useState, useEffect } from "react";
import axios from "axios";
import globalApiKey from "@/public/data/api-key";

interface CastData {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

interface Cast {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

interface Crew {
  adult: boolean;
  credit_id: string;
  department: string;
  gender: number;
  id: number;
  job: string;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
}

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
