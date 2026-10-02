import React from "react";
import { MovieCardSkeleton } from "./movie-card-skeleton";
import { cn } from "@/lib/utils";

export interface MediaListingSkeletonProps {
  hasSidebar?: boolean;
  cardCount?: number;
  className?: string;
}

export function MediaListingSkeleton({
  hasSidebar = true,
  cardCount = 10,
  className,
}: MediaListingSkeletonProps) {
  if (hasSidebar) {
    return (
      <main className={cn("container min-h-screen pt-20 pb-16", className)}>
        <div className="flex gap-8">
          <div className="hidden w-72 shrink-0 lg:block">
            <div className="h-96 animate-pulse rounded-xl bg-secondary/30" />
          </div>
          <div className="flex-1 space-y-8">
            <div className="h-8 w-48 animate-pulse rounded-xl bg-secondary" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: cardCount }, (_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className={cn("container min-h-screen space-y-8 pt-20 pb-16", className)}
    >
      <div className="h-8 w-48 animate-pulse rounded-xl bg-secondary" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5">
        {Array.from({ length: cardCount }, (_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}

export default MediaListingSkeleton;
