"use client";

import React from "react";
import { Video } from "@/types";
import { MediaVideosSection } from "@/components/common/media-videos-section";

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

export default MovieVideosSection;
