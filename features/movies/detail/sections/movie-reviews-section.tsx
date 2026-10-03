"use client";
import { ChevronRight, Star } from "lucide-react";
import { SectionHeader } from "@/components/common/section-header";
import type { TMDBReview } from "@/lib/tmdb/types/account";
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
  const displayReviews = reviews.slice(0, 2);

  return (
    <section id="section-reviews" className="scroll-mt-24 space-y-4">
      <SectionHeader
        title="User Reviews"
        action={{
          label: totalReviews > 0 ? `See all ${totalReviews}` : "See all",
          onClick: onOpenReviewsModal,
        }}
      />

      {/* 2 Reviews Side by Side */}
      {displayReviews.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {displayReviews.map((rev) => (
            <div
              key={rev.id}
              onClick={onOpenReviewsModal}
              className="group flex cursor-pointer flex-col justify-between space-y-3 rounded-3xl border border-border/80 bg-card/70 p-5 transition-all hover:border-primary/40 hover:shadow-xl"
            >
              <div className="space-y-2.5">
                {/* Author & Rating Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                    <div className="flex size-7 items-center justify-center rounded-xl bg-secondary font-bold text-foreground">
                      {rev.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">
                        {rev.author}
                      </span>
                      <span className="ml-2 text-xs">
                        {new Date(rev.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {rev.author_details?.rating && (
                    <div className="flex items-center gap-1 text-xs font-bold text-primary">
                      <Star className="size-3.5 fill-primary text-primary" />
                      <span>{rev.author_details.rating}/10</span>
                    </div>
                  )}
                </div>

                {/* Content with line-clamp ellipsis */}
                <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                  {rev.content}
                </p>
              </div>

              {/* Click to open full review in sheet */}
              <div className="flex items-center gap-1 text-xs font-semibold text-primary group-hover:underline">
                <span>Read full review</span>
                <ChevronRight className="size-3.5" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border/80 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No reviews yet for this title.
          </p>
        </div>
      )}
    </section>
  );
}
