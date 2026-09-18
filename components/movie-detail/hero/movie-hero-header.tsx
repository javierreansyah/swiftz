"use client";

import React from "react";
import { Star, TrendingUp, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MovieDetailsData } from "@/types";

function formatNumberShort(num: number): string {
  if (!num) return "0";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toString();
}

export interface MovieHeroHeaderProps {
  movie: MovieDetailsData;
  certification: string;
  releaseYear: string;
  runtimeFormatted: string;
  userRating: number | null;
  onRateClick: () => void;
  onShareClick: () => void;
  copiedShare: boolean;
}

export function MovieHeroHeader({
  movie,
  certification,
  releaseYear,
  runtimeFormatted,
  userRating,
  onRateClick,
  onShareClick,
  copiedShare,
}: MovieHeroHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {movie.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-muted-foreground sm:text-base">
          {releaseYear && <span>{releaseYear}</span>}
          {releaseYear && <span>·</span>}
          {certification && (
            <>
              <span>{certification}</span>
              <span>·</span>
            </>
          )}
          <span>{runtimeFormatted}</span>
        </div>
      </div>

      {/* Right side header badges & rate action */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Rate button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onRateClick}
              className={`h-9 gap-1.5 rounded-none border-border/80 bg-background/60 px-3.5 backdrop-blur-sm transition-colors ${
                userRating
                  ? "border-primary/50 text-primary hover:text-primary/80"
                  : "hover:border-primary/50 hover:text-primary"
              }`}
            >
              <Star
                className={`size-4 ${
                  userRating
                    ? "fill-primary text-primary"
                    : "text-muted-foreground"
                }`}
              />
              <span className="font-semibold">
                {userRating ? `${userRating}/10` : "Rate"}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {userRating ? "Change your rating" : "Rate this movie"}
          </TooltipContent>
        </Tooltip>

        {/* IMDb / TMDB Score Badge: ★ 8.9/10 (200K) */}
        <div className="flex h-9 items-center gap-2 rounded-none border border-primary/30 bg-primary/10 px-3.5 text-primary backdrop-blur-sm">
          <Star className="size-4 fill-primary text-primary" />
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-foreground">
              {movie.vote_average.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">/10</span>
            <span className="ml-1 text-xs text-muted-foreground">
              ({formatNumberShort(movie.vote_count)})
            </span>
          </div>
        </div>

        {/* Popularity / Trending Badge: ↗ 1 */}
        <div className="flex h-9 items-center gap-1.5 rounded-none border border-border/80 bg-background/60 px-3.5 text-sm font-semibold text-muted-foreground backdrop-blur-sm">
          <TrendingUp className="size-4 text-primary" />
          <span>{Math.round(movie.popularity)}</span>
        </div>

        {/* Share button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              onClick={onShareClick}
              className="size-9 rounded-none border-border/80 bg-background/60 p-0 backdrop-blur-sm"
            >
              {copiedShare ? (
                <Check className="size-3.5 text-emerald-500" />
              ) : (
                <Share2 className="size-3.5 text-muted-foreground" />
              )}
              <span className="sr-only">Share</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share movie</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

export default MovieHeroHeader;
