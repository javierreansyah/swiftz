import React from "react";
import { Skeleton } from "./ui/skeleton";

const MovieCardSkeleton = () => {
  return (
    <div>
      <div className="rounded-lg overflow-clip bg-card">
        <Skeleton className="relative w-full aspect-[2/3] rounded-none" />
        <div className="p-4 h-[120px] space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  );
};

export default MovieCardSkeleton;
