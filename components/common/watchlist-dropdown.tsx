"use client";

import React from "react";
import {
  Bookmark,
  Heart,
  Star,
  Share2,
  Check,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface WatchlistDropdownProps {
  isWatchlist: boolean;
  isFavorite: boolean;
  userRating: number | null;
  isPendingWatchlist: boolean;
  voteCountFormatted: string;
  mediaTypeLabel?: string;
  onWatchlistClick: () => void;
  onFavoriteClick: () => void;
  onRateClick: () => void;
  onShareClick: () => void;
  className?: string;
}

export function WatchlistDropdown({
  isWatchlist,
  isFavorite,
  userRating,
  isPendingWatchlist,
  voteCountFormatted,
  mediaTypeLabel = "Title",
  onWatchlistClick,
  onFavoriteClick,
  onRateClick,
  onShareClick,
  className,
}: WatchlistDropdownProps) {
  return (
    <div className={cn("order-1 flex shrink-0 items-center justify-end self-start lg:order-2", className)}>
      <DropdownMenu>
        <div className="inline-flex items-center gap-1">
          <Button size="default"
            variant={isWatchlist ? "secondary" : "default"}
            onClick={onWatchlistClick}
            disabled={isPendingWatchlist}
          >
            {isPendingWatchlist ? (
              <Loader2 className="size-4 animate-spin" />
            ) : isWatchlist ? (
              <Check className="size-4" />
            ) : (
              <Bookmark className="size-4 fill-current" />
            )}
            <span>
              {voteCountFormatted} · {isWatchlist ? "In Watchlist" : "Add to Watchlist"}
            </span>
          </Button>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant={isWatchlist ? "secondary" : "default"}
            >
              <ChevronDown className="size-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
        </div>

        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem
            onClick={onWatchlistClick}
            className="cursor-pointer"
          >
            <Bookmark className="size-4 text-info" />
            <span>
              {isWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onFavoriteClick}
            className="cursor-pointer"
          >
            <Heart
              className={cn(
                "size-4 text-destructive",
                isFavorite && "fill-current"
              )}
            />
            <span>
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onRateClick}
            className="cursor-pointer"
          >
            <Star
              className={cn(
                "size-4 text-primary",
                userRating ? "fill-current" : ""
              )}
            />
            <span>
              {userRating
                ? `Your Rating: ${userRating}/10`
                : `Rate This ${mediaTypeLabel}`}
            </span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onShareClick}
            className="cursor-pointer"
          >
            <Share2 className="size-4" />
            <span>Share {mediaTypeLabel}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default WatchlistDropdown;
