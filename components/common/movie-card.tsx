import React from "react";
import { MediaCard } from "./media-card";

export interface MovieCardProps {
  id: number;
  title: string;
  poster: string;
  rating: number;
  year?: string;
  variant?: "shelf" | "grid";
  className?: string;
}

export function MovieCard({
  id,
  title,
  poster,
  rating,
  year,
  variant = "grid",
  className,
}: MovieCardProps) {
  return (
    <MediaCard
      type="movie"
      id={id}
      title={title}
      image={poster}
      rating={rating}
      year={year}
      href={`/movie/${id}`}
      variant={variant}
      className={className}
    />
  );
}

export default MovieCard;
