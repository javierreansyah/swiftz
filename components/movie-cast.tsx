import React from "react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { User } from "lucide-react";
import { getMovieCast } from "@/lib/tmdb";

interface MovieCastsProps {
  id: string;
}

const MovieCast: React.FC<MovieCastsProps> = async ({ id }) => {
  const movieCast = await getMovieCast(id);
  const movieCastPageUrl = `/movie/${id}/casts`;

  const topCast = movieCast?.cast?.slice(0, 15) || [];

  return (
    <section className="w-full space-y-4">
      <ScrollArea className="h-94.5 w-full bg-card sm:rounded-lg sm:border lg:h-81 xl:h-106 2xl:h-133.5">
        <ul className="flex gap-2 p-4 lg:block lg:h-auto lg:space-y-3">
          <h1 className="hidden text-3xl font-bold lg:block">Top Cast</h1>
          {topCast.map((cast, index) => {
            const castProfileUrl = `https://image.tmdb.org/t/p/w185${cast.profile_path}`;
            return (
              <li
                key={cast.id || index}
                className="w-40 overflow-clip rounded-md border lg:w-auto"
              >
                <div>
                  {cast.profile_path ? (
                    <div className="relative aspect-185/278">
                      <Image
                        src={castProfileUrl}
                        alt={cast.original_name}
                        fill
                        sizes="185px"
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-185/278 items-center justify-center bg-secondary lg:w-full">
                      <User size={58} />
                    </div>
                  )}
                </div>
                <div className="h-26 bg-background px-4 pt-3 pb-4 lg:w-auto">
                  <h2 className="truncate text-sm font-bold">{cast.name}</h2>
                  <p className="truncate text-sm font-light">{cast.character}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="w-full">
        <Button size="full" className="font-bold" asChild>
          <Link href={movieCastPageUrl} prefetch={false}>
            See Full Cast & Crew
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default MovieCast;
