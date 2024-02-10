import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";

interface MovieData {
  id: number;
  title: string;
  poster: string;
  rating: number;
}

const MovieCard: React.FC<MovieData> = ({ id, title, poster, rating }) => {
  const posterUrl = `https://image.tmdb.org/t/p/w500${poster}`;
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

        <div className="p-4 h-[120px]">
          <h2 className="font-bold">{title}</h2>
          <p className="text-muted-foreground">Rating: {rating}</p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
