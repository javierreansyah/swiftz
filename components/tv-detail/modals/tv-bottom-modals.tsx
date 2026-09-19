"use client";

import React from "react";
import { TVShowDetailsData, Cast, Crew, Video } from "@/types";
import { TVCastModal } from "./tv-cast-modal";
import { TVSeasonsModal } from "./tv-seasons-modal";
import { VideosModal } from "@/components/movie-detail/modals/videos-modal";
import { ReviewsModal } from "@/components/movie-detail/modals/reviews-modal";
import { RecommendationsModal } from "@/components/movie-detail/modals/recommendations-modal";

export type TVModalType =
  | "reviews"
  | "videos"
  | "photos"
  | "cast"
  | "seasons"
  | "recommendations"
  | null;

export interface TVBottomModalsProps {
  activeModal: TVModalType;
  onClose: () => void;
  show: TVShowDetailsData;
  cast: Cast[];
  crew: Crew[];
  videos: Video[];
  initialVideoIndex?: number;
  selectedSeasonNumber?: number;
}

export function TVBottomModals({
  activeModal,
  onClose,
  show,
  cast,
  crew,
  videos,
  initialVideoIndex,
  selectedSeasonNumber,
}: TVBottomModalsProps) {
  return (
    <>
      {/* TV Seasons & Episode Details Sheet Modal */}
      <TVSeasonsModal
        isOpen={activeModal === "seasons"}
        onClose={onClose}
        show={show}
        initialSeasonNumber={selectedSeasonNumber}
      />

      {/* Full Cast & Crew Sheet Modal */}
      <TVCastModal
        isOpen={activeModal === "cast"}
        onClose={onClose}
        show={show}
        cast={cast}
        crew={crew}
      />

      {/* Videos Bottom Sheet Modal */}
      <VideosModal
        isOpen={activeModal === "videos"}
        onClose={onClose}
        videos={videos}
        title={show.name}
        releaseYear={show.first_air_date ? show.first_air_date.substring(0, 4) : undefined}
        initialVideoIndex={initialVideoIndex}
      />

      {/* TV Reviews Bottom Sheet Modal */}
      <ReviewsModal
        isOpen={activeModal === "reviews"}
        onClose={onClose}
        mediaId={show.id}
        title={show.name}
        releaseYear={show.first_air_date ? show.first_air_date.substring(0, 4) : undefined}
        mediaType="tv"
      />

      {/* TV Recommendations Bottom Sheet Modal */}
      <RecommendationsModal
        isOpen={activeModal === "recommendations"}
        onClose={onClose}
        mediaId={show.id}
        title={show.name}
        releaseYear={show.first_air_date ? show.first_air_date.substring(0, 4) : undefined}
        mediaType="tv"
      />
    </>
  );
}

export default TVBottomModals;
