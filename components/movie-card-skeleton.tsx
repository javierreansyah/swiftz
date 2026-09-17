import React from "react";
import { Skeleton } from "./ui/skeleton";

const MovieCardSkeleton = () => {
  return (
    <div>
      <div className="overflow-clip rounded-lg bg-card">
        <Skeleton className="relative aspect-2/3 w-full rounded-none" />
        <div className="h-30 space-y-4 p-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  );
};

export default MovieCardSkeleton;
