"use client";
import type { Movie } from "@/lib/tmdb/types/movie";
import { MediaRecommendationsSection } from "@/features/media/components/media-recommendations-section";
export interface MovieRecommendationsSectionProps {
  movies: Movie[];
  totalCount?: number;
  onOpenRecommendationsModal: () => void;
}

export function MovieRecommendationsSection({
  movies,
  totalCount,
  onOpenRecommendationsModal,
}: MovieRecommendationsSectionProps) {
  return (
    <MediaRecommendationsSection
      items={movies}
      totalCount={totalCount}
      type="movie"
      title="Recommendations"
      onOpenRecommendationsModal={onOpenRecommendationsModal}
    />
  );
}
