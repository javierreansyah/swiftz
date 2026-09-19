import React from "react";
import { TVShow } from "@/types";
import { MediaCard } from "@/components/common/media-card";

export interface TVCardProps {
  show: TVShow;
  variant?: "shelf" | "grid";
  className?: string;
}

export function TVCard({ show, variant = "grid", className }: TVCardProps) {
  const year = show.first_air_date
    ? show.first_air_date.substring(0, 4)
    : undefined;

  return (
    <MediaCard
      type="tv"
      id={show.id}
      title={show.name}
      image={show.poster_path}
      rating={show.vote_average}
      year={year}
      href={`/tv/${show.id}`}
      variant={variant}
      className={className}
    />
  );
}

export default TVCard;
