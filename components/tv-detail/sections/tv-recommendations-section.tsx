"use client";

import React from "react";
import { TVShow } from "@/types";
import { MediaRecommendationsSection } from "@/components/common/media-recommendations-section";

export interface TVRecommendationsSectionProps {
  shows: TVShow[];
  onOpenRecommendationsModal?: () => void;
}

export function TVRecommendationsSection({
  shows,
  onOpenRecommendationsModal,
}: TVRecommendationsSectionProps) {
  return (
    <MediaRecommendationsSection
      items={shows}
      type="tv"
      title="More Like This"
      onOpenRecommendationsModal={onOpenRecommendationsModal}
    />
  );
}

export default TVRecommendationsSection;
