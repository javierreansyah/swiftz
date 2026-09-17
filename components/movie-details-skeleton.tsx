import React from "react";
import { Skeleton } from "./ui/skeleton";

const MovieDetailsSkeleton = () => {
  return (
    <>
      <div className="flex h-55 items-end bg-card sm:h-80 md:h-105 md:items-center lg:h-130 2xl:h-155">
        <div className="container items-end gap-4 md:flex">
          <Skeleton className="hidden aspect-2/3 rounded-sm md:block md:w-59.25 lg:w-75 2xl:w-92.5" />
          <div className="space-y-4 py-8">
            <Skeleton className="h-12 w-50 md:w-75 lg:w-100 2xl:w-130" />
            <Skeleton className="hidden h-6 sm:block sm:w-75 md:w-50 lg:w-75 2xl:w-100" />
            <Skeleton className="hidden h-4 sm:block sm:w-50 md:w-25 lg:w-50 2xl:w-75" />
            <Skeleton className="hidden h-20 sm:block sm:w-100 md:w-75 lg:w-100 2xl:w-150" />
          </div>
        </div>
      </div>
      <div className="container block space-y-4 py-4 sm:hidden">
        <Skeleton className="h-6 w-50" />
        <Skeleton className="h-4 w-25" />
        <Skeleton className="h-4 w-25" />
        <Skeleton className="size-50" />
      </div>
    </>
  );
};

export default MovieDetailsSkeleton;
