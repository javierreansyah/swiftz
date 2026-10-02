"use client";
import { useState } from "react";
import { Star, Trash2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRatingMutation } from "@/features/auth/hooks/queries";
export interface MediaRatingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mediaType?: "movie" | "tv";
  mediaId: number;
  title: string;
  sessionId?: string | null;
  currentRating?: number | null;
  onSuccess?: () => void;
}

export function MediaRatingDialog({
  isOpen,
  onClose,
  mediaType = "movie",
  mediaId,
  title,
  sessionId,
  currentRating,
  onSuccess,
}: MediaRatingDialogProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(
    currentRating || 8,
  );

  const rateMutation = useRatingMutation(mediaType);
  const deleteMutation = useRatingMutation(mediaType);
  const isPendingRate = rateMutation.isPending;
  const isPendingDelete = deleteMutation.isPending;

  const displayRating = hoverRating !== null ? hoverRating : selectedRating;

  const handleRate = async (ratingVal: number) => {
    if (!sessionId) return;
    try {
      await rateMutation.mutateAsync({ mediaId, rating: ratingVal, sessionId });
      onSuccess?.();
      onClose();
    } catch {
      // Error handled in mutation
    }
  };

  const handleDelete = async () => {
    if (!sessionId) return;
    try {
      await deleteMutation.mutateAsync({ mediaId, sessionId });
      onSuccess?.();
      onClose();
    } catch {
      // Error handled in mutation
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Star className="size-6 fill-current" />
        </div>

        <div className="text-center">
          <DialogTitle>
            {mediaType === "tv" ? "Rate this Series" : "Rate this Movie"}
          </DialogTitle>
          <DialogDescription className="mx-auto max-w-xs">
            {title}
          </DialogDescription>
        </div>

        {/* 10 Star Rating Selector */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex w-full items-center justify-center">
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
                  className="flex min-w-0 flex-1 items-center justify-center rounded-full py-2 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-ring"
                  aria-pressed={selectedRating === val}
                  aria-label={`Rate ${val} stars`}
                >
                  <Star
                    className={`size-6 transition-colors ${
                      isFilled
                        ? "fill-primary text-primary"
                        : "text-muted-foreground/40 hover:text-primary/70"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <span className="text-2xl font-black text-primary">
            {displayRating}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              / 10
            </span>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          {currentRating && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isPendingDelete}
            >
              {isPendingDelete ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Trash2 className="size-3.5" />
              )}
              <span>Remove</span>
            </Button>
          )}

          <Button
            onClick={() => handleRate(selectedRating)}
            disabled={isPendingRate}
            className="flex-1"
          >
            {isPendingRate ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            <span>Rate {selectedRating}★</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
