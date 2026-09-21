"use client";

import React from "react";
import { Movie } from "@/types";
import { MediaRecommendationsSection } from "@/components/common/media-recommendations-section";

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

export default MovieRecommendationsSection;
