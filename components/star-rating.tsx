import React from "react";
import { Star, StarHalf } from "lucide-react";

interface MovieRatingProps {
  rating: number;
}

const StarRating: React.FC<MovieRatingProps> = ({ rating }) => {
  const DisplayHalfStar = () => {
    return (
      <div className="relative">
        <Star fill="black" strokeWidth={0} />
        <StarHalf
          fill="#fff220"
          strokeWidth={0.5}
          color="#fff220"
          className="absolute top-0"
        />
      </div>
    );
  };
  const roundedRating = Math.floor(rating);
  const fullStars = Math.floor(roundedRating / 2);
  const hasHalfStar = roundedRating % 2 !== 0;

  return (
    <div className="h-5 flex items-center">
      <div className="flex">
        {Array.from({ length: fullStars }, (_, index) => (
          <Star key={index} fill="#fff220" strokeWidth={0} />
        ))}
        {hasHalfStar && <DisplayHalfStar />}
        {Array.from(
          { length: 5 - fullStars - (hasHalfStar ? 1 : 0) },
          (_, index) => (
            <Star key={fullStars + index} fill="black" strokeWidth={0} />
          )
        )}
        <p className="pl-2 font-bold text-white">{rating}</p>
      </div>
    </div>
  );
};

export default StarRating;
