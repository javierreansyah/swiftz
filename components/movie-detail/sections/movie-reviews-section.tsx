import { MessageSquare, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TMDBReview } from "@/types/auth";

export interface MovieReviewsSectionProps {
  reviews: TMDBReview[];
  totalReviews: number;
  onOpenReviewsModal: () => void;
}

export function MovieReviewsSection({
  reviews,
  totalReviews,
  onOpenReviewsModal,
}: MovieReviewsSectionProps) {
  const featuredReview = reviews[0] || null;

  return (
    <section id="section-reviews" className="space-y-4">
      <div className="flex items-center justify-between border-b border-border/70 pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-5 text-primary" />
          <h2 className="text-xl font-bold sm:text-2xl">User Reviews</h2>
          <span className="text-xs text-muted-foreground">({totalReviews})</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenReviewsModal}
          className="gap-1 text-xs font-semibold text-primary hover:text-primary"
        >
          <span>View all reviews ({totalReviews})</span>
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {featuredReview ? (
        <div
          onClick={onOpenReviewsModal}
          className="group cursor-pointer space-y-3 rounded-2xl border border-border/80 bg-card/70 p-6 transition-all hover:border-primary/40 hover:shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
              <div className="flex size-7 items-center justify-center rounded-full bg-secondary font-bold text-foreground">
                {featuredReview.author.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="font-semibold text-foreground">
                  {featuredReview.author}
                </span>
                <span className="ml-2 text-[11px]">
                  {new Date(featuredReview.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {featuredReview.author_details?.rating && (
              <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                <span>{featuredReview.author_details.rating}/10</span>
              </div>
            )}
          </div>

          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {featuredReview.content}
          </p>

          <div className="flex items-center gap-1 text-xs font-semibold text-primary group-hover:underline">
            <span>Read full review</span>
            <ChevronRight className="size-3.5" />
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border/80 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No reviews yet. Click below to view or submit the first review!
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenReviewsModal}
            className="mt-3 rounded-full"
          >
            Open Reviews Modal
          </Button>
        </div>
      )}
    </section>
  );
}

export default MovieReviewsSection;
