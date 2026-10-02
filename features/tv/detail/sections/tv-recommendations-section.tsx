"use client";
import type { TVShow } from "@/lib/tmdb/types/tv";
import { MediaRecommendationsSection } from "@/features/media/components/media-recommendations-section";
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
