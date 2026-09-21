"use client";

import React from "react";
import { Video } from "@/types";
import { MediaHeroMedia } from "@/components/common/media-hero-media";

export interface MovieHeroMediaProps {
  movieTitle: string;
  posterUrl: string;
  backdropUrl: string;
  playableVideos: Video[];
}

export function MovieHeroMedia({
  movieTitle,
  posterUrl,
  backdropUrl,
  playableVideos,
}: MovieHeroMediaProps) {
  return (
    <MediaHeroMedia
      title={movieTitle}
      posterUrl={posterUrl}
      backdropUrl={backdropUrl}
      playableVideos={playableVideos}
    />
  );
}

export default MovieHeroMedia;
