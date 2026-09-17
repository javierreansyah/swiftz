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
        className="h-[90vh] max-h-[92vh] rounded-t-3xl border-t border-border/80 bg-background/95 p-0 shadow-2xl backdrop-blur-2xl sm:max-w-none"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
            <div className="flex items-center gap-3">
              <SheetTitle className="text-xl font-extrabold sm:text-2xl">
                User Reviews
              </SheetTitle>
              <Badge variant="secondary" className="rounded-full px-3 py-0.5">
                {rawReviews.length} Total
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="gap-1.5 rounded-full text-xs"
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
                  className="gap-1.5 rounded-full bg-amber-400 font-bold text-neutral-950 hover:bg-amber-300 dark:bg-amber-400 dark:text-neutral-950"
                >
                  <Plus className="size-4" />
                  <span>Review this title</span>
                </Button>
              )}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/30 px-6 py-3 text-xs sm:text-sm">
            <div className="flex flex-wrap items-center gap-3">
              {/* Sort Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">Sort by:</span>
                <select
                  value={reviewSort}
                  onChange={(e) => setReviewSort(e.target.value as any)}
                  className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
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
                  className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="all">All Stars</option>
                  <option value="9">9+ Stars</option>
                  <option value="8">8+ Stars</option>
                  <option value="7">7+ Stars</option>
                  <option value="5">5+ Stars</option>
                </select>
              </div>

              {/* Hide Spoilers Toggle */}
              <label className="flex cursor-pointer items-center gap-2 select-none text-muted-foreground hover:text-foreground">
                <input
                  type="checkbox"
                  checked={hideSpoilers}
                  onChange={(e) => setHideSpoilers(e.target.checked)}
                  className="rounded border-border accent-primary"
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
          <ScrollArea className="flex-1 p-6">
            {isLoadingReviews ? (
              <div className="space-y-4 py-8">
                {Array.from({ length: 3 }, (_, i) => (
                  <div
                    key={i}
                    className="h-44 animate-pulse rounded-2xl border border-border bg-card/50"
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
                    className="mt-4 gap-2 bg-amber-400 font-bold text-neutral-950 hover:bg-amber-300"
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
                      className="space-y-3 rounded-2xl border border-border/70 bg-card/60 p-5 shadow-sm transition-all hover:border-border"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {avatarUrl ? (
                            <div className="relative size-10 overflow-hidden rounded-full border border-border">
                              <Image
                                src={avatarUrl}
                                alt={rev.author}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex size-10 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-sm">
                              {rev.author.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-sm text-foreground">
                              {rev.author}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {dateFormatted}
                            </p>
                          </div>
                        </div>

                        {rating !== undefined && rating !== null && (
                          <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-500">
                            <Star className="size-3.5 fill-amber-400 text-amber-400" />
                            <span>{rating}/10</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="font-bold text-foreground text-sm sm:text-base">
                          {reviewHeadline}
                        </h4>
                        <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                          {reviewBody}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 pt-1 text-xs text-muted-foreground">
                        <span className="text-xs">Was this review helpful?</span>
                        <button
                          onClick={() => handleHelpfulVote(rev.id, "up")}
                          className={`flex items-center gap-1 rounded-md px-2 py-1 transition-colors hover:bg-muted ${
                            votes.voted === "up"
                              ? "text-emerald-500 font-bold bg-emerald-500/10"
                              : ""
                          }`}
                        >
                          <ThumbsUp className="size-3.5" />
                          <span>{votes.up}</span>
                        </button>
                        <button
                          onClick={() => handleHelpfulVote(rev.id, "down")}
                          className={`flex items-center gap-1 rounded-md px-2 py-1 transition-colors hover:bg-muted ${
                            votes.voted === "down"
                              ? "text-red-500 font-bold bg-red-500/10"
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
