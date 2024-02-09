import React from "react";
import { Skeleton } from "./ui/skeleton";

const MovieCastSkeleton = () => {
  return (
    <div>
      <div className="flex bg-card rounded-md overflow-clip sm:border">
        <Skeleton className="aspect-[2/3] h-[150px] sm:h-[200px] rounded-none" />
        <div className="p-6 space-y-2">
          <Skeleton className="w-36 h-6" />
          <Skeleton className="w-24 h-4" />
        </div>
      </div>
    </div>
  );
};

export default MovieCastSkeleton;
