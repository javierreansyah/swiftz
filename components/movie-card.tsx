import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import StarRatingMovieCard from "./star-rating-movie-card";

interface MovieData {
  id: number;
  title: string;
  poster: string;
  rating: number;
}

const MovieCard: React.FC<MovieData> = ({ id, title, poster, rating }) => {
  const posterUrl = `https://image.tmdb.org/t/p/w500${poster}`;
  const truncatedTitle = title.length > 35 ? title.slice(0, 35) + "..." : title;
  return (
    <Link href={`/movie/${id}`} prefetch={false}>
      <div className="overflow-clip rounded-lg border bg-card lg:transition-all lg:hover:scale-105">
        {poster ? (
          <div className="relative aspect-2/3 w-full">
            <Image
              src={posterUrl}
              alt={title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          </div>
        ) : (
          <div className="relative flex aspect-2/3 w-full items-center justify-center bg-secondary">
            <ImageOff size={42} />
          </div>
        )}

        <div className="flex h-27.5 flex-col justify-between space-y-1 p-4">
          <h2 className="font-bold">{truncatedTitle}</h2>
          <div className="flex items-center gap-2">
            <StarRatingMovieCard rating={rating} />
            <p className="text-sm text-muted-foreground">{rating}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
