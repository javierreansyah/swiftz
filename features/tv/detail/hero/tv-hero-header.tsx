"use client";
import type { DetailStaticContent } from "@/features/media/detail-static-content";
import { Star, TrendingUp, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { TVDetailView } from "@/features/tv/detail/payload";
import { formatNumberShort } from "@/lib/format";
export interface TVHeroHeaderProps {
  staticContent: DetailStaticContent;
  show: TVDetailView;
  userRating: number | null;
  onRateClick: () => void;
  onShareClick: () => void;
  copiedShare: boolean;
}

export function TVHeroHeader({
  staticContent,
  show,
  userRating,
  onRateClick,
  onShareClick,
  copiedShare,
}: TVHeroHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
      {staticContent.heading}
      {/* Right side header badges & rate action (Desktop only) */}
      <div className="hidden flex-wrap items-center gap-3 lg:flex">
        {/* Rate button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="default"
              onClick={onRateClick}
              className={`${userRating ? "" : ""}`}
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
            {userRating ? "Change your rating" : "Rate this series"}
          </TooltipContent>
        </Tooltip>

        {/* TMDB Score Badge: ★ 8.9/10 (200K) */}
        <div className="flex h-9 items-center gap-2 rounded-xl bg-primary/10 px-3.5 text-primary backdrop-blur-sm">
          <Star className="size-4 fill-primary text-primary" />
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-foreground">
              {show.vote_average.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">/10</span>
            <span className="ml-1 text-xs text-muted-foreground">
              ({formatNumberShort(show.vote_count)})
            </span>
          </div>
        </div>

        {/* Popularity / Trending Badge */}
        <div className="flex h-9 items-center gap-1.5 rounded-xl bg-background/60 px-3.5 text-sm font-semibold text-muted-foreground backdrop-blur-sm">
          <TrendingUp className="size-4 text-primary" />
          <span>{Math.round(show.popularity)}</span>
        </div>

        {/* Share button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="secondary" onClick={onShareClick}>
              {copiedShare ? (
                <Check className="size-3.5 text-success" />
              ) : (
                <Share2 className="size-3.5 text-muted-foreground" />
              )}
              <span className="sr-only">Share</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share series</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
