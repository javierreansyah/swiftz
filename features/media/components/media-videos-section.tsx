"use client";
import type { Video } from "@/lib/tmdb/types/common";
import { ContentCarousel } from "@/components/common/content-carousel";
import { MediaCard } from "@/features/media/components/media-card";
export interface MediaVideosSectionProps {
  videos: Video[];
  onOpenVideosModal: (index?: number) => void;
  title?: string;
}

export function MediaVideosSection({
  videos,
  onOpenVideosModal,
  title = "Videos",
}: MediaVideosSectionProps) {
  if (!videos || videos.length === 0) return null;

  return (
    <ContentCarousel
      id="section-videos"
      title={title}
      action={{
        label: `See all ${videos.length}`,
        onClick: () => onOpenVideosModal(),
      }}
    >
      {videos.map((vid, idx) => {
        const thumb = `https://img.youtube.com/vi/${vid.key}/hqdefault.jpg`;
        return (
          <MediaCard
            key={vid.id || vid.key}
            type="video"
            id={vid.id || vid.key}
            title={vid.name}
            badge={vid.type || "Video"}
            image={thumb}
            onClick={() => onOpenVideosModal(idx)}
            variant="shelf"
          />
        );
      })}
    </ContentCarousel>
  );
}
