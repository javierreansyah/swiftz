"use client";
import type { TVShow } from "@/lib/tmdb/types/tv";
import { MediaRecommendationsSection } from "@/features/media/components/media-recommendations-section";
export interface TVRecommendationsSectionProps {
  shows: TVShow[];
  totalCount?: number;
  onOpenRecommendationsModal?: () => void;
}

export function TVRecommendationsSection({
  shows,
  totalCount,
  onOpenRecommendationsModal,
}: TVRecommendationsSectionProps) {
  return (
    <MediaRecommendationsSection
      items={shows}
      totalCount={totalCount}
      type="tv"
      title="More Like This"
      onOpenRecommendationsModal={onOpenRecommendationsModal}
    />
  );
}
