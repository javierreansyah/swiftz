import {
  ContentCarousel,
  type ContentCarouselProps,
} from "@/components/common/content-carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryFeedback } from "@/features/media/components/query-feedback";
export function HomeShelfLoading({
  title,
  action,
  tabs,
  activeTab,
  onTabChange,
  variant = "shelf",
  isError = false,
  onRetry,
}: Pick<
  ContentCarouselProps,
  "title" | "action" | "tabs" | "activeTab" | "onTabChange"
> & {
  variant?: "shelf" | "person-shelf";
  isError?: boolean;
  onRetry?: () => void;
}) {
  return (
    <div className="container">
      <ContentCarousel
        title={title}
        action={action}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
      >
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
            <Skeleton key={index} variant={variant} />
          ))
        )}
      </ContentCarousel>
    </div>
  );
}
