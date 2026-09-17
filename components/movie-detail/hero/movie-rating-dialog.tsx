"use client";

import React, { useState } from "react";
import { Star, X, Trash2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRateMovieMutation, useDeleteRatingMutation } from "@/hooks/use-tmdb";

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
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(
    currentRating || 8
  );

  const rateMutation = useRateMovieMutation();
  const deleteRatingMutation = useDeleteRatingMutation();

  if (!isOpen) return null;

  const displayRating = hoverRating !== null ? hoverRating : selectedRating;

  const handleRate = async (ratingVal: number) => {
    if (!sessionId) return;
    try {
      await rateMutation.mutateAsync({
        movieId,
        rating: ratingVal,
        sessionId,
      });
      onSuccess?.();
      onClose();
    } catch {
      // Error handled in mutation
    }
  };

  const handleDelete = async () => {
    if (!sessionId) return;
    try {
      await deleteRatingMutation.mutateAsync({
        movieId,
        sessionId,
      });
      onSuccess?.();
      onClose();
    } catch {
      // Error handled in mutation
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl text-center space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-1 text-muted-foreground hover:bg-muted"
        >
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
          <Star className="size-6 fill-current" />
        </div>

        <div>
          <h3 className="text-lg font-bold">Rate this Movie</h3>
          <p className="text-xs text-muted-foreground truncate max-w-xs mx-auto">
            {movieTitle}
          </p>
        </div>

        {/* 10 Star Rating Selector */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center gap-1">
            {Array.from({ length: 10 }, (_, i) => {
              const val = i + 1;
              const isFilled = val <= displayRating;
              return (
                <button
                  key={val}
                  type="button"
                  onMouseEnter={() => setHoverRating(val)}
                  onMouseLeave={() => setHoverRating(null)}
                  onClick={() => setSelectedRating(val)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  aria-label={`Rate ${val} stars`}
                >
                  <Star
                    className={`size-6 transition-colors ${
                      isFilled
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/40 hover:text-amber-400/70"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <span className="text-2xl font-black text-amber-400">
            {displayRating}{" "}
            <span className="text-sm font-normal text-muted-foreground">/ 10</span>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          {currentRating && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={deleteRatingMutation.isPending}
              className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10 text-xs"
            >
              {deleteRatingMutation.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Trash2 className="size-3.5" />
              )}
              <span>Remove</span>
            </Button>
          )}

          <Button
            onClick={() => handleRate(selectedRating)}
            disabled={rateMutation.isPending}
            className="flex-1 gap-2 bg-amber-500 font-bold text-black hover:bg-amber-400"
          >
            {rateMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            <span>Rate {selectedRating}★</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MovieRatingDialog;
