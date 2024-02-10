import React from "react";
import { Star, StarHalf } from "lucide-react";

interface MovieRatingProps {
  rating: number;
}

const StarRatingMovieCard: React.FC<MovieRatingProps> = ({ rating }) => {
  const DisplayHalfStar = () => {
    return (
      <div className="relative">
        <Star fill="black" strokeWidth={0} size={20} />
        <StarHalf
          fill="#E11D48"
          strokeWidth={0.4}
          color="#E11D48"
          className="absolute top-0"
          size={20}
        />
      </div>
    );
  };
  const roundedRating = Math.floor(rating);
  const fullStars = Math.floor(roundedRating / 2);
  const hasHalfStar = roundedRating % 2 !== 0;

  return (
    <div className="h-5 flex items-center opacity-80">
      <div className="flex">
        {Array.from({ length: fullStars }, (_, index) => (
          <Star key={index} fill="#E11D48" strokeWidth={0} size={20} />
        ))}
        {hasHalfStar && <DisplayHalfStar />}
        {Array.from(
          { length: 5 - fullStars - (hasHalfStar ? 1 : 0) },
          (_, index) => (
            <Star
              key={fullStars + index}
              fill="black"
              size={20}
              strokeWidth={0}
            />
          )
        )}
      </div>
    </div>
  );
};

export default StarRatingMovieCard;
