"use client";

import React from "react";
import {
  MovieDetailsData,
  Cast,
  Crew,
  Video,
  MovieImagesData,
} from "@/types";
import { ReviewsModal } from "./reviews-modal";
import { VideosModal } from "./videos-modal";
import { PhotosModal } from "./photos-modal";
import { CastModal } from "./cast-modal";
import { RecommendationsModal } from "./recommendations-modal";

export type ModalType =
  | "reviews"
  | "videos"
  | "photos"
  | "cast"
  | "recommendations"
  | null;

export interface MovieBottomModalsProps {
  activeModal: ModalType;
  onClose: () => void;
  movie: MovieDetailsData;
  cast: Cast[];
  crew: Crew[];
  videos: Video[];
  images?: MovieImagesData;
  initialPhotoIndex?: number;
  initialVideoIndex?: number;
  onOpenRating?: () => void;
  onToggleWatchlist?: () => void;
  isWatchlist?: boolean;
}

export function MovieBottomModals({
  activeModal,
  onClose,
  movie,
  cast,
  crew,
  videos,
  images,
  initialPhotoIndex = 0,
  initialVideoIndex = 0,
  onOpenRating,
  onToggleWatchlist,
  isWatchlist = false,
}: MovieBottomModalsProps) {
  if (!activeModal) return null;

  return (
    <>
      <ReviewsModal
        isOpen={activeModal === "reviews"}
        onClose={onClose}
        movie={movie}
        onOpenRating={onOpenRating}
      />

      <VideosModal
        isOpen={activeModal === "videos"}
        onClose={onClose}
        movie={movie}
        videos={videos}
        initialVideoIndex={initialVideoIndex}
        onToggleWatchlist={onToggleWatchlist}
        isWatchlist={isWatchlist}
      />

      <PhotosModal
        isOpen={activeModal === "photos"}
        onClose={onClose}
        movie={movie}
        images={images}
        initialPhotoIndex={initialPhotoIndex}
      />

      <CastModal
        isOpen={activeModal === "cast"}
        onClose={onClose}
        movie={movie}
        cast={cast}
        crew={crew}
      />

      <RecommendationsModal
        isOpen={activeModal === "recommendations"}
        onClose={onClose}
        movie={movie}
      />
    </>
  );
}

export default MovieBottomModals;
