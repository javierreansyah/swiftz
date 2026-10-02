"use client";
import type { Video } from "@/lib/tmdb/types/common";
import { MediaHeroMedia } from "@/features/media/components/media-hero-media";
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
