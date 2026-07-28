import { useState, useEffect } from "react";
import axios from "axios";
import globalApiKey from "@/public/data/api-key";

import { MovieDetailsData, MovieReleaseDateData, ReleaseDate } from "@/types";

const useMovieDetails = (id: string) => {
  const [movieDetails, setMovieDetails] = useState<MovieDetailsData | null>(
    null
  );
  const [movieReleaseDates, setMovieReleaseDates] =
    useState<MovieReleaseDateData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const detailResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}`,
          {
            params: {
              api_key: globalApiKey,
            },
          }
        );
        if (!detailResponse.data) {
          throw new Error("Movie details not found");
        }
        const releaseDateResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/release_dates`,
          {
            params: {
              api_key: globalApiKey,
            },
          }
        );
        if (!releaseDateResponse.data) {
          throw new Error("Release dates not found");
        }

        setMovieDetails(detailResponse.data);
        setMovieReleaseDates(releaseDateResponse.data);
      } catch (error) {
        setError("Error Fetching Data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  return { movieDetails, movieReleaseDates, isLoading, error };
};

export default useMovieDetails;
