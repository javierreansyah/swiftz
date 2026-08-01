import React from "react";
import Iframe from "react-iframe";
import { getMovieVideos } from "@/lib/tmdb";

interface MovieVideoProps {
  id: string;
  className?: string;
}

const MovieVideo: React.FC<MovieVideoProps> = async ({ id, className }) => {
  const movieVideos = await getMovieVideos(id);

  if (!movieVideos.results || movieVideos.results.length === 0) {
    return (
      <section className="sm:rounded-xl aspect-video flex-none w-full lg:w-auto lg:h-[380px] xl:h-[480px] 2xl:h-[590px] flex items-center justify-center bg-card border">
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
      <Iframe
        url={youtubeUrl}
        className={`sm:rounded-xl aspect-video flex-none w-full lg:w-auto lg:h-[380px] xl:h-[480px] 2xl:h-[590px] ${
          className ? className : ""
        }`}
        display="block"
        position="relative"
      />
    </section>
  );
};

export default MovieVideo;
