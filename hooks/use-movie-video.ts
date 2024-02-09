"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import globalApiKey from "@/public/data/api-key";

interface VideoData {
  id: string;
  results: Video[];
}

interface Video {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

const useMovieVideo = (id: string) => {
  const [movieVideos, setVideos] = useState<VideoData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieVideo = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const videosResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/videos`,
          {
            params: {
              api_key: globalApiKey,
            },
          }
        );

        setVideos(videosResponse.data);
      } catch (error) {
        setError("Error Fetching Data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieVideo();
  }, [id]);

  return { movieVideos, isLoading, error };
};

export default useMovieVideo;
