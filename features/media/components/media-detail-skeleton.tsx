import { Skeleton } from "@/components/ui/skeleton";

/** Route-level placeholder mirroring the movie/TV detail hero geometry. */
export function MediaDetailSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container py-20">
        <div
          role="status"
          className="grid grid-cols-1 items-start gap-8 lg:grid-cols-detail xl:grid-cols-detail-wide xl:gap-10"
        >
          <span className="sr-only">Loading details</span>
          <div className="min-w-0 space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-10 w-3/4 sm:w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-hero">
              <Skeleton className="hidden aspect-2/3 w-full lg:block" />
              <Skeleton className="-mx-4 aspect-video sm:mx-0" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
          <div className="hidden space-y-3 lg:block">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-9 w-full" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
