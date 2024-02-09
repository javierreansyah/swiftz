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
      <div className="sm:rounded-xl aspect-video flex-none w-full lg:w-auto lg:h-[380px] xl:h-[480px] 2xl:h-[590px] flex items-center justify-center bg-card border">
        <h1>Failed to fetch data</h1>
      </div>
    );
  }

  if (isLoading || movieVideos === null) {
    return (
      <div>
        <Skeleton className="sm:rounded-xl aspect-video flex-none w-full lg:w-auto lg:h-[380px] xl:h-[480px] 2xl:h-[590px]" />
      </div>
    );
  }

  if (movieVideos.results.length === 0) {
    return (
      <div className="sm:rounded-xl aspect-video flex-none w-full lg:w-auto lg:h-[380px] xl:h-[480px] 2xl:h-[590px] flex items-center justify-center bg-card border">
        <h1>No Video Available</h1>
      </div>
    );
  }

  const youtubeUrl = `https://www.youtube.com/embed/${movieVideos?.results[0].key}`;

  return (
    <Iframe
      url={youtubeUrl}
      id=""
      className={`sm:rounded-xl aspect-video flex-none w-full lg:w-auto lg:h-[380px] xl:h-[480px] 2xl:h-[590px] ${
        className ? className : ""
      }`}
      display="block"
      position="relative"
    />
  );
};

export default MovieVideo;
