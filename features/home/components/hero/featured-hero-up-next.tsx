"use client";
import Image from "@/components/ui/image";
import { Play } from "lucide-react";
import type { Movie } from "@/lib/tmdb/types/movie";
export interface FeaturedHeroUpNextProps {
  upNextMovies: Movie[];
  onSelectMovie: (offset: number) => void;
}

export function FeaturedHeroUpNext({
  upNextMovies,
  onSelectMovie,
}: FeaturedHeroUpNextProps) {
  if (upNextMovies.length === 0) return null;

  return (
    <div className="hidden flex-col gap-3 py-1 lg:col-span-4 lg:flex lg:h-158 xl:h-176">
      {upNextMovies.map((movie, idx) => {
        const itemBackdrop = movie.backdrop_path
          ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
          : movie.poster_path
            ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
            : "/assets/images/movie-placeholder.svg";

        const itemPoster = movie.poster_path
          ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
          : null;

        return (
          <div
            key={movie.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelectMovie(idx + 1)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectMovie(idx + 1);
              }
            }}
            className="group/item relative flex min-h-0 flex-1 cursor-pointer items-stretch overflow-hidden rounded-2xl p-2.5 shadow-xl transition-all duration-300 xl:p-3"
          >
            {/* Backdrop as Card Container */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image
                src={itemBackdrop}
                alt={movie.title}
                fill
                sizes="(max-width: 1280px) 360px, 420px"
                variant="card"
                className="object-center"
              />
              {/* Dark overlay for contrast and text readability */}
              <div className="absolute inset-0 bg-media/80 transition-colors duration-300 group-hover/item:bg-media/70" />
              <div className="absolute inset-0 bg-linear-to-r from-scrim/80 via-scrim/60 to-scrim/40" />
            </div>

            {/* Card Content */}
            <div className="relative z-1 flex size-full items-start gap-3.5 sm:gap-4">
              {/* 2x Enlarged Thumbnail with play overlay */}
              <div className="relative aspect-2/3 h-full shrink-0 overflow-hidden rounded-xl bg-media/80 shadow-lg">
                {itemPoster && (
                  <Image
                    src={itemPoster}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 1280px) 112px, 128px"
                    variant="card"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-scrim/40 opacity-0 transition-opacity duration-300 group-hover/item:opacity-100">
                  <Play className="size-6 fill-current text-media-foreground drop-shadow-md" />
                </div>
              </div>

              {/* Top-aligned Info Column */}
              <div className="flex min-w-0 flex-1 flex-col justify-start space-y-1.5 pt-0.5">
                <div className="flex items-center gap-1.5 text-xs text-primary">
                  <Play className="size-3 fill-current" />
                  <span className="font-semibold">Watch Trailer</span>
                </div>
                <h3 className="line-clamp-2 heading-card text-media-foreground transition-colors group-hover/item:text-primary">
                  {movie.title}
                </h3>
                <p className="line-clamp-3 text-xs text-media-foreground/80">
                  {movie.overview || "Watch the latest trailer & info"}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
