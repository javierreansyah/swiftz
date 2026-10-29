"use client";
import type { ReactNode } from "react";
import type { MovieDetailView } from "@/features/movies/detail/payload";
import type {
  Cast,
  Crew,
  Video,
  MovieImagesData,
} from "@/lib/tmdb/types/common";
import { ReviewsModal } from "@/features/media/components/reviews-modal";
import { VideosModal } from "@/features/media/components/videos-modal";
import { PhotosModal } from "@/features/media/components/photos-modal";
import { CastModal } from "@/features/media/components/cast-modal";
import { RecommendationsModal } from "@/features/media/components/recommendations-modal";
import { CollectionModal } from "@/features/movies/detail/modals/collection-modal";
export type ModalType =
  | "reviews"
  | "videos"
  | "photos"
  | "cast"
  | "recommendations"
  | "collection"
  | null;

export interface MovieBottomModalsProps {
  castError?: ReactNode;
  videosError?: ReactNode;
  photosError?: ReactNode;
  activeModal: ModalType;
  onClose: () => void;
  movie: MovieDetailView;
  cast: Cast[];
  crew: Crew[];
  videos: Video[];
  images?: MovieImagesData;
  initialPhotoIndex?: number;
  initialVideoIndex?: number;
  selectedPersonId?: number | null;
  onToggleWatchlist?: () => void;
  isWatchlist?: boolean;
}

export function MovieBottomModals({
  castError,
  videosError,
  photosError,
  activeModal,
  onClose,
  movie,
  cast,
  crew,
  videos,
  images,
  initialPhotoIndex,
  initialVideoIndex,
  selectedPersonId = null,
  onToggleWatchlist,
  isWatchlist = false,
}: MovieBottomModalsProps) {
  return (
    <>
      <ReviewsModal
        isOpen={activeModal === "reviews"}
        onClose={onClose}
        movie={movie}
      />

      <VideosModal
        loadError={videosError}
        isOpen={activeModal === "videos"}
        onClose={onClose}
        movie={movie}
        videos={videos}
        initialVideoIndex={initialVideoIndex}
        onToggleWatchlist={onToggleWatchlist}
        isWatchlist={isWatchlist}
      />

      <PhotosModal
        loadError={photosError}
        isOpen={activeModal === "photos"}
        onClose={onClose}
        movie={movie}
        images={images}
        initialPhotoIndex={initialPhotoIndex}
      />

      <CastModal
        loadError={castError}
        isOpen={activeModal === "cast"}
        onClose={onClose}
        movie={movie}
        cast={cast}
        crew={crew}
        initialPersonId={selectedPersonId}
      />

      <RecommendationsModal
        isOpen={activeModal === "recommendations"}
        onClose={onClose}
        movie={movie}
      />

      {movie.belongs_to_collection && (
        <CollectionModal
          isOpen={activeModal === "collection"}
          onClose={onClose}
          collectionId={movie.belongs_to_collection.id}
          collectionName={movie.belongs_to_collection.name}
          currentMovieId={movie.id}
        />
      )}
    </>
  );
}
