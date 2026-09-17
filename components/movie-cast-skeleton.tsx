import React from "react";
import { Skeleton } from "./ui/skeleton";

const MovieCastSkeleton = () => {
  return (
    <div>
      <div className="flex overflow-clip rounded-md bg-card sm:border">
        <Skeleton className="aspect-2/3 h-37.5 rounded-none sm:h-50" />
        <div className="space-y-2 p-6">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
};

export default MovieCastSkeleton;
