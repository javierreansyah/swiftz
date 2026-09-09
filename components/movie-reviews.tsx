"use client";

import React, { useState } from "react";
import { useMovieReviewsQuery } from "@/hooks/use-tmdb";
import { Star, User, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";

interface MovieReviewsProps {
  id: string | number;
}

function ReviewCard({ review }: { review: any }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const content = review.content || "";
  const isLong = content.length > 380;

  let avatarUrl: string | null = null;
  const rawAvatar = review.author_details?.avatar_path;
  if (rawAvatar) {
    if (rawAvatar.startsWith("/https://") || rawAvatar.startsWith("https://")) {
      avatarUrl = rawAvatar.replace(/^\//, "");
    } else {
      avatarUrl = `https://image.tmdb.org/t/p/w185${rawAvatar}`;
    }
  }

  const rating = review.author_details?.rating;
  const dateFormatted = review.created_at
    ? new Date(review.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <article className="border rounded-xl p-5 bg-card/60 space-y-3 hover:border-primary/30 transition-colors">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <div className="relative h-10 w-10 rounded-full overflow-clip flex-none">
              <Image
                src={avatarUrl}
                alt={review.author}
                fill
                sizes="40px"
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center flex-none">
              <User size={20} className="text-muted-foreground" />
            </div>
          )}
          <div>
            <h4 className="font-bold text-sm sm:text-base">{review.author}</h4>
            {dateFormatted && (
              <p className="text-xs text-muted-foreground">{dateFormatted}</p>
            )}
          </div>
        </div>

        {rating !== null && rating !== undefined && (
          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-md text-amber-500 font-bold text-xs">
            <Star className="h-3 w-3 fill-current" />
            <span>{rating}/10</span>
          </div>
        )}
      </div>

      <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
        {isLong && !isExpanded ? `${content.slice(0, 380)}...` : content}
      </div>

      {isLong && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline"
        >
          {isExpanded ? (
            <>
              Show Less <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              Read Full Review <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      )}
    </article>
  );
}

export default function MovieReviews({ id }: MovieReviewsProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMovieReviewsQuery(id, page);

  const reviews = data?.results || [];
  const totalResults = data?.total_results || 0;
  const totalPages = data?.total_pages || 1;

  if (isLoading) {
    return (
      <section className="container space-y-4 pb-8">
        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          <span>Reviews</span>
        </h2>
        <div className="space-y-3">
          {Array.from({ length: 2 }, (_, i) => (
            <div
              key={i}
              className="h-36 rounded-xl border bg-card animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="container space-y-6 pb-12">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          <span>Reviews ({totalResults})</span>
        </h2>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Previous Reviews
          </Button>
          <span className="flex items-center px-3 text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next Reviews
          </Button>
        </div>
      )}
    </section>
  );
}
