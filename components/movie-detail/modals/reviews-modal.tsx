"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  X,
  Share2,
  Star,
  ThumbsUp,
  ThumbsDown,
  User,
  Check,
  Plus,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MovieDetailsData } from "@/types";
import { useMovieReviewsQuery } from "@/hooks/use-tmdb";

export interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: MovieDetailsData;
  onOpenRating?: () => void;
}

export function ReviewsModal({
  isOpen,
  onClose,
  movie,
  onOpenRating,
}: ReviewsModalProps) {
  const releaseYear = movie.release_date
    ? movie.release_date.substring(0, 4)
    : "";

  const [copiedShare, setCopiedShare] = useState(false);
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${movie.title} (${releaseYear}) Reviews`,
          text: movie.overview,
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

  const { data: reviewsData, isLoading: isLoadingReviews } =
    useMovieReviewsQuery(movie.id, 1);
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
      const minScore = parseInt(ratingFilter, 10);
      list = list.filter(
        (r) => r.author_details?.rating && r.author_details.rating >= minScore
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

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="inset-x-0 bottom-0 mx-auto h-[90vh] max-h-[92vh] w-full max-w-(--max-container) overflow-hidden rounded-none border-x border-t border-b-0 border-border/80 bg-background/95 p-0 shadow-2xl backdrop-blur-2xl"
      >
        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-border/60 px-6 py-4 sm:px-10 sm:py-5">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="shrink-0 rounded-none hover:bg-muted"
              >
                <X className="size-5" />
                <span className="sr-only">Close</span>
              </Button>
              <div>
                <SheetTitle className="text-xl font-extrabold sm:text-2xl">
                  User Reviews
                </SheetTitle>
                <p className="text-xs text-muted-foreground">
                  {movie.title} {releaseYear ? `(${releaseYear})` : ""}
                </p>
              </div>
              <Badge variant="secondary" className="rounded-none px-3 py-0.5">
                {rawReviews.length} Total
              </Badge>
            </div>

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
          </div>

          {/* Filter Bar */}
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/30 px-6 py-3 text-xs sm:px-10 sm:text-sm">
            <div className="flex flex-wrap items-center gap-3">
              {/* Sort Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">Sort by:</span>
                <select
                  value={reviewSort}
                  onChange={(e) => setReviewSort(e.target.value as any)}
                  className="rounded-none border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="rating_desc">Highest Rating</option>
                  <option value="rating_asc">Lowest Rating</option>
                  <option value="date_desc">Most Recent</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">Rating:</span>
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="rounded-none border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="all">All Stars</option>
                  <option value="9">9+ Stars</option>
                  <option value="8">8+ Stars</option>
                  <option value="7">7+ Stars</option>
                  <option value="5">5+ Stars</option>
                </select>
              </div>

              {/* Hide Spoilers Toggle */}
              <label className="flex cursor-pointer items-center gap-2 text-muted-foreground select-none hover:text-foreground">
                <input
                  type="checkbox"
                  checked={hideSpoilers}
                  onChange={(e) => setHideSpoilers(e.target.checked)}
                  className="rounded-none border-border accent-primary"
                />
                <span>Hide Spoilers</span>
              </label>
            </div>

            <div className="text-xs text-muted-foreground">
              {filteredReviews.length > 0
                ? `1-${filteredReviews.length} of ${rawReviews.length}`
                : "0 reviews"}
            </div>
          </div>

          {/* Reviews List */}
          <ScrollArea className="min-h-0 flex-1 p-6 sm:p-10">
            {isLoadingReviews ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-44 animate-pulse rounded-none border border-border bg-card/50"
                  />
                ))}
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Star className="size-12 text-muted-foreground/40" />
                <h3 className="mt-4 text-lg font-bold text-foreground">
                  No reviews found
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Be the first to share your thoughts on {movie.title}!
                </p>
                {onOpenRating && (
                  <Button
                    onClick={() => {
                      onClose();
                      onOpenRating();
                    }}
                    className="mt-4 gap-2 bg-primary font-bold text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="size-4" />
                    <span>Review this title</span>
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReviews.map((rev) => {
                  const rating = rev.author_details?.rating;
                  const dateFormatted = rev.created_at
                    ? new Date(rev.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "";

                  let avatarUrl: string | null = null;
                  const rawAvatar = rev.author_details?.avatar_path;
                  if (rawAvatar) {
                    if (
                      rawAvatar.startsWith("/https://") ||
                      rawAvatar.startsWith("https://")
                    ) {
                      avatarUrl = rawAvatar.replace(/^\//, "");
                    } else {
                      avatarUrl = `https://image.tmdb.org/t/p/w185${rawAvatar}`;
                    }
                  }

                  const lines = rev.content.split("\n").filter(Boolean);
                  const reviewHeadline =
                    lines.length > 0 && lines[0].length < 120
                      ? lines[0]
                      : `Review by ${rev.author}`;
                  const reviewBody =
                    lines.length > 1 && lines[0] === reviewHeadline
                      ? lines.slice(1).join("\n\n")
                      : rev.content;

                  const votes = helpfulVotes[rev.id] || {
                    up: 210 + (rev.author.charCodeAt(0) % 80),
                    down: 14 + (rev.author.charCodeAt(0) % 10),
                  };

                  return (
                    <article
                      key={rev.id}
                      className="space-y-3 rounded-none border border-border/70 bg-card/60 p-5 shadow-sm transition-all hover:border-border"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {avatarUrl ? (
                            <div className="relative size-10 overflow-hidden rounded-none border border-border">
                              <Image
                                src={avatarUrl}
                                alt={rev.author}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex size-10 items-center justify-center rounded-none bg-primary/20 text-sm font-bold text-primary">
                              {rev.author.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-bold text-foreground">
                              {rev.author}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {dateFormatted}
                            </p>
                          </div>
                        </div>

                        {rating !== undefined && rating !== null && (
                          <div className="flex items-center gap-1 rounded-none bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                            <Star className="size-3.5 fill-primary text-primary" />
                            <span>{rating}/10</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-foreground sm:text-base">
                          {reviewHeadline}
                        </h4>
                        <p className="mt-1.5 text-xs leading-relaxed whitespace-pre-line text-muted-foreground sm:text-sm">
                          {reviewBody}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 pt-1 text-xs text-muted-foreground">
                        <span className="text-xs">Was this review helpful?</span>
                        <button
                          onClick={() => handleHelpfulVote(rev.id, "up")}
                          className={`flex items-center gap-1 rounded-none px-2 py-1 transition-colors hover:bg-muted ${
                            votes.voted === "up"
                              ? "bg-emerald-500/10 font-bold text-emerald-500"
                              : ""
                          }`}
                        >
                          <ThumbsUp className="size-3.5" />
                          <span>{votes.up}</span>
                        </button>
                        <button
                          onClick={() => handleHelpfulVote(rev.id, "down")}
                          className={`flex items-center gap-1 rounded-none px-2 py-1 transition-colors hover:bg-muted ${
                            votes.voted === "down"
                              ? "bg-red-500/10 font-bold text-red-500"
                              : ""
                          }`}
                        >
                          <ThumbsDown className="size-3.5" />
                          <span>{votes.down}</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ReviewsModal;
