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
    <Link href={`/movie/${id}`}>
      <div className="border rounded-lg overflow-clip lg:hover:scale-105 lg:transition-all bg-card">
        {poster ? (
          <div className="relative w-full aspect-[2/3]">
            <Image src={posterUrl} alt={title} fill />
          </div>
        ) : (
          <div className="relative w-full aspect-[2/3] bg-secondary flex justify-center items-center">
            <ImageOff size={42} />
          </div>
        )}

        <div className="p-4 h-[110px] space-y-1 flex flex-col justify-between">
          <h2 className="font-bold">{truncatedTitle}</h2>
          <div className="flex gap-2 items-center">
            <StarRatingMovieCard rating={rating} />
            <p className="text-muted-foreground text-sm">{rating}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
