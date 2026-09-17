import React from "react";
import { getMovieVideos } from "@/lib/tmdb";

interface MovieVideoProps {
  id: string;
  className?: string;
}

const MovieVideo: React.FC<MovieVideoProps> = async ({ id, className }) => {
  const movieVideos = await getMovieVideos(id);

  if (!movieVideos.results || movieVideos.results.length === 0) {
    return (
      <section className="flex aspect-video w-full flex-none items-center justify-center border bg-card sm:rounded-xl lg:h-95 lg:w-auto xl:h-120 2xl:h-147.5">
        <h1>No Video Available</h1>
      </section>
    );
  }

  const trailer =
    movieVideos.results.find(
      (video) => video.type?.toLowerCase() === "trailer" && video.official
    ) ||
    movieVideos.results.find(
      (video) => video.type?.toLowerCase() === "trailer"
    ) ||
    movieVideos.results[0];

  const youtubeUrl = `https://www.youtube.com/embed/${trailer.key}`;

  return (
    <section>
      <iframe
        src={youtubeUrl}
        title="Movie Trailer"
        className={`aspect-video w-full flex-none border-0 sm:rounded-xl lg:h-95 lg:w-auto xl:h-120 2xl:h-147.5 ${
          className ? className : ""
        }`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </section>
  );
};

export default MovieVideo;
