"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Iframe from "react-iframe";
import globalApiKey from "@/public/data/api-key";
import { Skeleton } from "./ui/skeleton";
import useMovieVideo from "@/hooks/use-movie-video";

interface MovieVideoProps {
  id: string;
  className?: string;
}

const MovieVideo: React.FC<MovieVideoProps> = ({ id, className }) => {
  const { movieVideos, isLoading, error } = useMovieVideo(id);

  if (error) {
    return (
      <section className="sm:rounded-xl aspect-video flex-none w-full lg:w-auto lg:h-[380px] xl:h-[480px] 2xl:h-[590px] flex items-center justify-center bg-card border">
        <h1>Failed to fetch data</h1>
      </section>
    );
  }

  if (isLoading || movieVideos === null) {
    return (
      <section>
        <Skeleton className="sm:rounded-xl aspect-video flex-none w-full lg:w-auto lg:h-[380px] xl:h-[480px] 2xl:h-[590px]" />
      </section>
    );
  }

  if (movieVideos.results.length === 0) {
    return (
      <section className="sm:rounded-xl aspect-video flex-none w-full lg:w-auto lg:h-[380px] xl:h-[480px] 2xl:h-[590px] flex items-center justify-center bg-card border">
        <h1>No Video Available</h1>
      </section>
    );
  }

  const youtubeUrl = `https://www.youtube.com/embed/${movieVideos?.results[0].key}`;

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
