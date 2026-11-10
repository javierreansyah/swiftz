import type { TVShow } from "@/lib/tmdb/types/tv";
import { MediaCard } from "@/features/media/components/media-card";
export interface TVCardProps {
  show: TVShow;
  variant?: "shelf" | "grid";
  className?: string;
  priority?: boolean;
  titleAs?: "h2" | "h3";
}

export function TVCard({
  show,
  variant = "grid",
  className,
  priority,
  titleAs,
}: TVCardProps) {
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
      priority={priority}
      titleAs={titleAs}
    />
  );
}
