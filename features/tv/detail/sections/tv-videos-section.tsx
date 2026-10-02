"use client";
import type { Video } from "@/lib/tmdb/types/common";
import { MediaVideosSection } from "@/features/media/components/media-videos-section";
export interface TVVideosSectionProps {
  videos: Video[];
  onOpenVideosModal: (index?: number) => void;
}

export function TVVideosSection({
  videos,
  onOpenVideosModal,
}: TVVideosSectionProps) {
  return (
    <MediaVideosSection
      videos={videos}
      onOpenVideosModal={onOpenVideosModal}
      title="Videos"
    />
  );
}
