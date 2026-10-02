import { ContentCarousel } from "@/components/common/content-carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryFeedback } from "@/features/media/components/query-feedback";
export function HomeShelfLoading({
  title,
  isError = false,
  onRetry,
}: {
  title: string;
  isError?: boolean;
  onRetry?: () => void;
}) {
  return (
    <ContentCarousel title={title}>
      {isError ? (
        onRetry ? (
          <QueryFeedback hasData={false} onRetry={onRetry} />
        ) : (
          <p className="text-sm text-muted-foreground">
            Unable to load this section. Please try again later.
          </p>
        )
      ) : (
        Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="h-hero-xl w-52 shrink-0">
            <Skeleton className="size-full" />
          </div>
        ))
      )}
    </ContentCarousel>
  );
}
