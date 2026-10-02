"use client";
import type { Movie } from "@/lib/tmdb/types/movie";
import { MediaRecommendationsSection } from "@/features/media/components/media-recommendations-section";
export interface MovieRecommendationsSectionProps {
  movies: Movie[];
  onOpenRecommendationsModal: () => void;
}

export function MovieRecommendationsSection({
  movies,
  onOpenRecommendationsModal,
}: MovieRecommendationsSectionProps) {
  return (
    <MediaRecommendationsSection
      items={movies}
      type="movie"
      title="Recommendations"
      onOpenRecommendationsModal={onOpenRecommendationsModal}
    />
  );
}
