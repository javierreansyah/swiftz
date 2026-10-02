import { Skeleton } from "@/components/ui/skeleton";
import { MovieCardSkeleton } from "@/features/media/components/movie-card-skeleton";
export function LibrarySkeleton() {
  return (
    <div className="container min-h-screen animate-pulse space-y-8 pt-24 pb-16">
      {/* Profile Header Skeleton */}
      <div className="flex flex-col items-center gap-6 rounded-3xl border bg-card/50 p-6 sm:flex-row sm:items-start sm:p-8">
        <Skeleton className="size-20 flex-none" />
        <div className="flex-1 space-y-3 text-center sm:text-left">
          <Skeleton className="mx-auto h-6 w-48 sm:mx-0" />
          <Skeleton className="mx-auto h-4 w-32 sm:mx-0" />
          <div className="flex justify-center gap-4 pt-2 sm:justify-start">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>

      {/* Section Header Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-8 w-72" />
        </div>
      </div>

      {/* Movie Grid Skeleton */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }, (_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
