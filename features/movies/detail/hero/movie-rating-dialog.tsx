"use client";
import { MediaRatingDialog } from "@/features/media/components/media-rating-dialog";
export interface MovieRatingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  movieId: number;
  movieTitle: string;
  sessionId?: string | null;
  currentRating?: number | null;
  onSuccess?: () => void;
}

export function MovieRatingDialog({
  isOpen,
  onClose,
  movieId,
  movieTitle,
  sessionId,
  currentRating,
  onSuccess,
}: MovieRatingDialogProps) {
  return (
    <MediaRatingDialog
      isOpen={isOpen}
      onClose={onClose}
      mediaType="movie"
      mediaId={movieId}
      title={movieTitle}
      sessionId={sessionId}
      currentRating={currentRating}
      onSuccess={onSuccess}
    />
  );
}
