import { useState, useEffect } from "react";
import axios from "axios";
import globalApiKey from "@/public/data/api-key";

interface MovieDetailsData {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: null | {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  };
  budget: number;
  genres: {
    id: number;
    name: string;
  }[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface ReleaseDate {
  certification?: string;
  descriptors?: string[];
  iso_639_1?: string;
  note?: string;
  release_date: string;
  type: number;
}

interface MovieReleaseDateData {
  id: number;
  results: {
    iso_3166_1: string;
    release_dates: ReleaseDate[];
  }[];
}

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
