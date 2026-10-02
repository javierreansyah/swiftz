"use client";
import type { Video } from "@/lib/tmdb/types/common";
import { MediaVideosSection } from "@/features/media/components/media-videos-section";
export interface MovieVideosSectionProps {
  videos: Video[];
  onOpenVideosModal: (index?: number) => void;
}

export function MovieVideosSection({
  videos,
  onOpenVideosModal,
}: MovieVideosSectionProps) {
  return (
    <MediaVideosSection
      videos={videos}
      onOpenVideosModal={onOpenVideosModal}
      title="Videos"
    />
  );
}
