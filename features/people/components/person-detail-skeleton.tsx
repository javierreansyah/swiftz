import { Skeleton } from "@/components/ui/skeleton";

/** Route-level placeholder mirroring the person overview geometry. */
export function PersonDetailSkeleton() {
  return (
    <main className="container min-h-screen py-20">
      <div
        role="status"
        className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12"
      >
        <span className="sr-only">Loading profile</span>
        <div className="space-y-6 lg:col-span-4 xl:col-span-3">
          <Skeleton className="aspect-2/3 w-full max-w-xs sm:max-w-sm lg:max-w-none" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="space-y-6 lg:col-span-8 xl:col-span-9">
          <Skeleton className="h-10 w-2/3 sm:w-1/2" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={index} variant="shelf" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
