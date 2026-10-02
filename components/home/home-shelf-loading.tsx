import { ContentCarousel } from "@/components/common/content-carousel";
import { Skeleton } from "@/components/ui/skeleton";

export function HomeShelfLoading({ title, isError = false }: { title: string; isError?: boolean }) {
  return (
    <ContentCarousel title={title}>
      {isError ? <p className="text-sm text-muted-foreground">Unable to load this section. Please try again later.</p> :
        Array.from({ length: 5 }, (_, index) => <div key={index} className="h-hero-xl w-52 shrink-0"><Skeleton className="size-full" /></div>)}
    </ContentCarousel>
  );
}
