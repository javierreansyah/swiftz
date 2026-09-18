import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Tv, Star } from "lucide-react";
import { TVShow } from "@/types";

export interface TVCardProps {
  show: TVShow;
}

export function TVCard({ show }: TVCardProps) {
  const posterUrl = show.poster_path
    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
    : null;

  const year = show.first_air_date
    ? show.first_air_date.substring(0, 4)
    : "";

  return (
    <Link href={`/tv/${show.id}`} prefetch={false} className="group block">
      <div className="overflow-clip rounded-none border border-border bg-card transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg">
        {posterUrl ? (
          <div className="relative aspect-2/3 w-full bg-muted">
            <Image
              src={posterUrl}
              alt={show.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-opacity duration-300"
            />
          </div>
        ) : (
          <div className="relative flex aspect-2/3 w-full items-center justify-center bg-secondary">
            <Tv className="size-10 text-muted-foreground" />
          </div>
        )}

        <div className="flex h-24 flex-col justify-between space-y-1 p-3.5">
          <h2 className="line-clamp-2 text-sm leading-tight font-bold text-foreground transition-colors group-hover:text-primary">
            {show.name}
          </h2>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1 font-semibold text-primary">
              <Star className="size-3 fill-current" />
              <span>{show.vote_average.toFixed(1)}</span>
            </div>
            {year && <span>{year}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default TVCard;
