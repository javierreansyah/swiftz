import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
export function MovieCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col space-y-3", className)}>
      <Skeleton className="aspect-2/3 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}
