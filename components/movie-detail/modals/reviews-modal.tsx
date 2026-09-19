"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Share2,
  Star,
  ThumbsUp,
  ThumbsDown,
  User,
  Check,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DetailBottomSheet } from "@/components/common/detail-bottom-sheet";
import { useMovieReviewsQuery, useTVReviewsQuery } from "@/hooks/use-tmdb";

export interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie?: {
    id?: number;
    title?: string;
    name?: string;
    release_date?: string;
    first_air_date?: string;
    overview?: string;
  };
  mediaId?: number;
  mediaType?: "movie" | "tv";
  title?: string;
  releaseYear?: string;
  onOpenRating?: () => void;
}

export function ReviewsModal({
  isOpen,
  onClose,
  movie,
  mediaId: customMediaId,
  mediaType = "movie",
  title: customTitle,
  releaseYear: customReleaseYear,
  onOpenRating,
}: ReviewsModalProps) {
  const targetId = customMediaId || movie?.id || 0;
  const displayTitle =
    customTitle || movie?.title || movie?.name || "Reviews";
  const rawDate = movie?.release_date || movie?.first_air_date;
  const displayYear =
    customReleaseYear || (rawDate ? rawDate.substring(0, 4) : "");

  const [copiedShare, setCopiedShare] = useState(false);
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${displayTitle} (${displayYear}) Reviews`,
          text: movie?.overview || "",
          url: window.location.href,
        });
        return;
      } catch {
        // fall back
      }
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  // Movie or TV Reviews Query
  const movieReviews = useMovieReviewsQuery(
    mediaType === "movie" ? targetId : 0,
    1
  );
  const tvReviews = useTVReviewsQuery(
    mediaType === "tv" ? targetId : 0,
    1
  );

  const reviewsData =
    mediaType === "tv" ? tvReviews.data : movieReviews.data;
  const isLoadingReviews =
    mediaType === "tv" ? tvReviews.isLoading : movieReviews.isLoading;
  const rawReviews = reviewsData?.results || [];

  const [reviewSort, setReviewSort] = useState<
    "featured" | "rating_desc" | "rating_asc" | "date_desc"
  >("featured");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [hideSpoilers, setHideSpoilers] = useState(false);
  const [helpfulVotes, setHelpfulVotes] = useState<
    Record<string, { up: number; down: number; voted?: "up" | "down" }>
  >({});

  const filteredReviews = useMemo(() => {
    let list = [...rawReviews];

    if (ratingFilter !== "all") {
      const minRating = Number(ratingFilter);
      list = list.filter(
        (r) =>
          r.author_details?.rating !== null &&
          r.author_details?.rating !== undefined &&
          r.author_details.rating >= minRating
      );
    }

    if (hideSpoilers) {
      list = list.filter(
        (r) => !r.content.toLowerCase().includes("spoiler")
      );
    }

    if (reviewSort === "rating_desc") {
      list.sort(
        (a, b) =>
          (b.author_details?.rating || 0) - (a.author_details?.rating || 0)
      );
    } else if (reviewSort === "rating_asc") {
      list.sort(
        (a, b) =>
          (a.author_details?.rating || 0) - (b.author_details?.rating || 0)
      );
    } else if (reviewSort === "date_desc") {
      list.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    return list;
  }, [rawReviews, ratingFilter, hideSpoilers, reviewSort]);

  const handleHelpfulVote = (reviewId: string, type: "up" | "down") => {
    setHelpfulVotes((prev) => {
      const current = prev[reviewId] || {
        up: 180 + (reviewId.charCodeAt(0) % 50),
        down: 12,
      };
      if (current.voted === type) return prev;
      return {
        ...prev,
        [reviewId]: {
          up:
            type === "up"
              ? current.up + 1
              : current.voted === "up"
              ? current.up - 1
              : current.up,
          down:
            type === "down"
              ? current.down + 1
              : current.voted === "down"
              ? current.down - 1
              : current.down,
          voted: type,
        },
      };
    });
  };

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
        className="gap-1.5 rounded-none text-xs"
      >
        {copiedShare ? (
          <Check className="size-4 text-emerald-500" />
        ) : (
          <Share2 className="size-4" />
        )}
        <span>Share</span>
      </Button>

      {onOpenRating && (
        <Button
          size="sm"
          onClick={() => {
            onClose();
            onOpenRating();
          }}
          className="gap-1.5 rounded-none bg-primary font-bold text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="size-4" />
          <span>Review this title</span>
        </Button>
      )}
    </div>
  );

  const subHeader = (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/30 px-6 py-3 text-xs sm:px-10 sm:text-sm">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Sort by:</span>
          <select
            value={reviewSort}
            onChange={(e) => setReviewSort(e.target.value as any)}
            className="rounded-none border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground focus:ring-1 focus:ring-primary focus:outline-hidden"
          >
            <option value="featured">Featured</option>
            <option value="rating_desc">Highest Rating</option>
            <option value="rating_asc">Lowest Rating</option>
            <option value="date_desc">Most Recent</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Rating:</span>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="rounded-none border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground focus:ring-1 focus:ring-primary focus:outline-hidden"
          >
            <option value="all">All Stars</option>
            <option value="9">9+ Stars</option>
            <option value="8">8+ Stars</option>
            <option value="7">7+ Stars</option>
            <option value="5">5+ Stars</option>
          </select>
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-muted-foreground select-none hover:text-foreground">
          <input
            type="checkbox"
            checked={hideSpoilers}
            onChange={(e) => setHideSpoilers(e.target.checked)}
            className="rounded-none border-border accent-primary"
          >
          </input>
          <span>Hide Spoilers</span>
        </label>
      </div>

      <div className="text-xs text-muted-foreground">
        {filteredReviews.length > 0
          ? `1-${filteredReviews.length} of ${rawReviews.length}`
          : "0 reviews"}
      </div>
    </div>
  );

  return (
    <DetailBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="User Reviews"
      subtitle={`${displayTitle} ${displayYear ? `(${displayYear})` : ""}`}
      badge={`${rawReviews.length} Total`}
      headerActions={headerActions}
      subHeader={subHeader}
    >
      {isLoadingReviews ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse space-y-3 border border-border/50 bg-card/40 p-5"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-muted" />
                <div className="space-y-1.5">
                  <div className="h-4 w-32 bg-muted" />
                  <div className="h-3 w-20 bg-muted" />
                </div>
              </div>
              <div className="h-16 w-full bg-muted" />
            </div>
          ))}
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Star className="size-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            No reviews match your filters.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredReviews.map((review) => {
            const author = review.author_details;
            const authorRating = author?.rating;
            const dateFormatted = new Date(
              review.created_at
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });

            const avatarUrl = author?.avatar_path
              ? author.avatar_path.startsWith("/http")
                ? author.avatar_path.slice(1)
                : `https://image.tmdb.org/t/p/w185${author.avatar_path}`
              : null;

            const votes = helpfulVotes[review.id] || {
              up: 180 + (review.id.charCodeAt(0) % 50),
              down: 12,
            };

            return (
              <article
                key={review.id}
                className="rounded-none border border-border/70 bg-card/60 p-5 transition-colors hover:border-primary/40 sm:p-6"
              >
                {/* Author row */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt={review.author}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <User className="size-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">
                        {review.author}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {dateFormatted}
                      </p>
                    </div>
                  </div>

                  {authorRating !== null && authorRating !== undefined && (
                    <div className="flex items-center gap-1.5 rounded-none border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                      <Star className="size-3.5 fill-primary text-primary" />
                      <span>{authorRating}/10</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="pt-4 text-xs leading-relaxed whitespace-pre-line text-foreground/90 sm:text-sm">
                  {review.content}
                </div>

                {/* Helpful voting row */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-3 text-xs text-muted-foreground">
                  <span className="font-medium">
                    {votes.up} out of {votes.up + votes.down} found this helpful
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={votes.voted === "up" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleHelpfulVote(review.id, "up")}
                      className="h-7 gap-1 rounded-none px-2.5 text-xs font-semibold"
                    >
                      <ThumbsUp className="size-3" />
                      <span>Helpful ({votes.up})</span>
                    </Button>
                    <Button
                      variant={votes.voted === "down" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleHelpfulVote(review.id, "down")}
                      className="h-7 gap-1 rounded-none px-2 text-xs"
                    >
                      <ThumbsDown className="size-3" />
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </DetailBottomSheet>
  );
}

export default ReviewsModal;
