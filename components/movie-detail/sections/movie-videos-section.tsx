"use client";

import React from "react";
import { Video } from "@/types";
import { ContentCarousel } from "@/components/common/content-carousel";
import { MediaCard } from "@/components/common/media-card";

export interface MovieVideosSectionProps {
  videos: Video[];
  onOpenVideosModal: (index?: number) => void;
}

export function MovieVideosSection({
  videos,
  onOpenVideosModal,
}: MovieVideosSectionProps) {
  if (!videos || videos.length === 0) return null;

  return (
    <ContentCarousel
      id="section-videos"
      title="Videos"
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

export default MovieVideosSection;
