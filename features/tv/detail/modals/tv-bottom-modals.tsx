"use client";
import type { ReactNode } from "react";
import type { TVDetailView } from "@/features/tv/detail/payload";
import type { Cast, Crew, Video } from "@/lib/tmdb/types/common";
import { CastModal } from "@/features/media/components/cast-modal";
import { TVSeasonsModal } from "@/features/tv/detail/modals/tv-seasons-modal";
import { VideosModal } from "@/features/media/components/videos-modal";
import { ReviewsModal } from "@/features/media/components/reviews-modal";
import { RecommendationsModal } from "@/features/media/components/recommendations-modal";
export type TVModalType =
  | "reviews"
  | "videos"
  | "photos"
  | "cast"
  | "seasons"
  | "recommendations"
  | null;

export interface TVBottomModalsProps {
  castError?: ReactNode;
  videosError?: ReactNode;
  activeModal: TVModalType;
  onClose: () => void;
  show: TVDetailView;
  cast: Cast[];
  crew: Crew[];
  videos: Video[];
  initialVideoIndex?: number;
  selectedSeasonNumber?: number;
  selectedPersonId?: number | null;
}

export function TVBottomModals({
  castError,
  videosError,
  activeModal,
  onClose,
  show,
  cast,
  crew,
  videos,
  initialVideoIndex,
  selectedSeasonNumber,
  selectedPersonId,
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
      <CastModal
        loadError={castError}
        isOpen={activeModal === "cast"}
        onClose={onClose}
        movie={show}
        initialPersonId={selectedPersonId}
        cast={cast}
        crew={crew}
      />

      {/* Videos Bottom Sheet Modal */}
      <VideosModal
        loadError={videosError}
        isOpen={activeModal === "videos"}
        onClose={onClose}
        videos={videos}
        title={show.name}
        releaseYear={
          show.first_air_date ? show.first_air_date.substring(0, 4) : undefined
        }
        initialVideoIndex={initialVideoIndex}
      />

      {/* TV Reviews Bottom Sheet Modal */}
      <ReviewsModal
        isOpen={activeModal === "reviews"}
        onClose={onClose}
        mediaId={show.id}
        title={show.name}
        releaseYear={
          show.first_air_date ? show.first_air_date.substring(0, 4) : undefined
        }
        mediaType="tv"
      />

      {/* TV Recommendations Bottom Sheet Modal */}
      <RecommendationsModal
        isOpen={activeModal === "recommendations"}
        onClose={onClose}
        mediaId={show.id}
        title={show.name}
        releaseYear={
          show.first_air_date ? show.first_air_date.substring(0, 4) : undefined
        }
        mediaType="tv"
      />
    </>
  );
}
