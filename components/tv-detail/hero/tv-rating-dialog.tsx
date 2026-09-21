"use client";

import React from "react";
import { MediaRatingDialog } from "@/components/common/media-rating-dialog";

export interface TVRatingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tvId: number;
  showTitle: string;
  sessionId?: string | null;
  currentRating?: number | null;
  onSuccess?: () => void;
}

export function TVRatingDialog({
  isOpen,
  onClose,
  tvId,
  showTitle,
  sessionId,
  currentRating,
  onSuccess,
}: TVRatingDialogProps) {
  return (
    <MediaRatingDialog
      isOpen={isOpen}
      onClose={onClose}
      mediaType="tv"
      mediaId={tvId}
      title={showTitle}
      sessionId={sessionId}
      currentRating={currentRating}
      onSuccess={onSuccess}
    />
  );
}

export default TVRatingDialog;
