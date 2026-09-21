"use client";

import React from "react";
import { Video } from "@/types";
import { MediaVideosSection } from "@/components/common/media-videos-section";

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

export default TVVideosSection;
