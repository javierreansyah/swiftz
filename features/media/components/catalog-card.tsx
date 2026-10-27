import type { Movie } from "@/lib/tmdb/types/movie";
import type { TVShow } from "@/lib/tmdb/types/tv";
import { MediaCard } from "@/features/media/components/media-card";

/** Shared catalog projection for movie and television shelves. */
export function CatalogCard({
  item,
  type,
}: {
  item: Movie | TVShow;
  type: "movie" | "tv";
}) {
  const title =
    type === "movie" ? (item as Movie).title : (item as TVShow).name;
  const date =
    type === "movie"
      ? (item as Movie).release_date
      : (item as TVShow).first_air_date;

  return (
    <MediaCard
      type={type}
      id={item.id}
      title={title}
      image={item.poster_path}
      rating={item.vote_average}
      year={date ? date.substring(0, 4) : undefined}
      href={`/${type}/${item.id}`}
      variant="shelf"
    />
  );
}
