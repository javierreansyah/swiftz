import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import { StarRatingMovieCard } from "./star-rating";

export interface MovieCardProps {
  id: number;
  title: string;
  poster: string;
  rating: number;
}

export function MovieCard({ id, title, poster, rating }: MovieCardProps) {
  const posterUrl = `https://image.tmdb.org/t/p/w500${poster}`;
  const truncatedTitle = title.length > 35 ? title.slice(0, 35) + "..." : title;

  return (
    <Link href={`/movie/${id}`} prefetch={false} className="group block">
      <div className="overflow-clip rounded-lg border bg-card transition-all duration-200 group-hover:scale-[1.03] group-hover:shadow-lg">
        {poster ? (
          <div className="relative aspect-2/3 w-full bg-muted">
            <Image
              src={posterUrl}
              alt={title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-opacity duration-300"
            />
          </div>
        ) : (
          <div className="relative flex aspect-2/3 w-full items-center justify-center bg-secondary">
            <ImageOff className="size-10 text-muted-foreground" />
          </div>
        )}

        <div className="flex h-27.5 flex-col justify-between space-y-1 p-4">
          <h2 className="line-clamp-2 font-bold text-sm sm:text-base leading-tight">
            {truncatedTitle}
          </h2>
          <div className="flex items-center gap-2">
            <StarRatingMovieCard rating={rating} />
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              {rating.toFixed(1)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;
