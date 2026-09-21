"use client";

import React from "react";
import { Video } from "@/types";
import { MediaHeroMedia } from "@/components/common/media-hero-media";

export interface TVHeroMediaProps {
  showTitle: string;
  posterUrl: string;
  backdropUrl: string;
  playableVideos: Video[];
}

export function TVHeroMedia({
  showTitle,
  posterUrl,
  backdropUrl,
  playableVideos,
}: TVHeroMediaProps) {
  return (
    <MediaHeroMedia
      title={showTitle}
      posterUrl={posterUrl}
      backdropUrl={backdropUrl}
      playableVideos={playableVideos}
    />
  );
}

export default TVHeroMedia;
