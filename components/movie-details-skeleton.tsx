import React from "react";
import { Skeleton } from "./ui/skeleton";

const MovieDetailsSkeleton = () => {
  return (
    <>
      <div className="h-[220px] sm:h-[320px] md:h-[420px] lg:h-[520px] 2xl:h-[620px] bg-card flex md:items-center items-end">
        <div className="container md:flex items-end gap-4">
          <Skeleton className="aspect-[2/3] md:w-[237px] lg:w-[300px] 2xl:w-[370px] rounded-sm hidden md:block" />
          <div className="py-8 space-y-4">
            <Skeleton className="h-12 2xl:w-[520px] lg:w-[400px] md:w-[300px] w-[200px]" />
            <Skeleton className="h-6 2xl:w-[400px] lg:w-[300px] md:w-[200px] sm:w-[300px] hidden sm:block" />
            <Skeleton className="h-4 2xl:w-[300px] lg:w-[200px] md:w-[100px] sm:w-[200px] hidden sm:block" />
            <Skeleton className="h-20 2xl:w-[600px] lg:w-[400px] md:w-[300px] sm:w-[400px] hidden sm:block" />
          </div>
        </div>
      </div>
      <div className="container py-4 space-y-4 block sm:hidden">
        <Skeleton className="h-6 w-[200px]" />
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-[200px] w-[200px]" />
      </div>
    </>
  );
};

export default MovieDetailsSkeleton;
