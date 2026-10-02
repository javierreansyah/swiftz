"use client";
import type { Video } from "@/lib/tmdb/types/common";
import { MediaHeroMedia } from "@/features/media/components/media-hero-media";
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
