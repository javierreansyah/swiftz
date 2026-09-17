import React from "react";
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  starColor?: string;
  showRatingText?: boolean;
  className?: string;
}

export function StarRating({
  rating,
  maxStars = 5,
  size = 18,
  starColor = "#E11D48",
  showRatingText = false,
  className,
}: StarRatingProps) {
  const roundedRating = Math.floor(rating);
  const fullStars = Math.floor(roundedRating / 2);
  const hasHalfStar = roundedRating % 2 !== 0;
  const emptyStars = Math.max(0, maxStars - fullStars - (hasHalfStar ? 1 : 0));

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {Array.from({ length: fullStars }, (_, index) => (
          <Star
            key={`full-${index}`}
            fill={starColor}
            color={starColor}
            strokeWidth={0}
            size={size}
          />
        ))}

        {hasHalfStar && (
          <div className="relative" style={{ width: size, height: size }}>
            <Star
              fill="currentColor"
              className="text-muted/30"
              strokeWidth={0}
              size={size}
            />
            <StarHalf
              fill={starColor}
              color={starColor}
              strokeWidth={0}
              className="absolute top-0 left-0"
              size={size}
            />
          </div>
        )}

        {Array.from({ length: emptyStars }, (_, index) => (
          <Star
            key={`empty-${index}`}
            fill="currentColor"
            className="text-muted/30"
            strokeWidth={0}
            size={size}
          />
        ))}
      </div>

      {showRatingText && (
        <span className="pl-1 text-xs font-bold text-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

// Backward-compatible named export for movie card rating
export function StarRatingMovieCard({ rating }: { rating: number }) {
  return <StarRating rating={rating} size={18} starColor="#E11D48" />;
}

export default StarRating;
