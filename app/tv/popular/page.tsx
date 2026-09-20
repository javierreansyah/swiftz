"use client";

import React, { Suspense } from "react";
import { TVCategoryListing } from "@/components/tv";
import { MovieCardSkeleton } from "@/components/common/movie-card-skeleton";

export const dynamic = "force-dynamic";

export default function PopularTVPage() {
  return (
    <Suspense
      fallback={
        <main className="container min-h-screen pt-20 pb-16">
          <div className="flex gap-8">
            <div className="hidden w-72 shrink-0 lg:block">
              <div className="h-96 animate-pulse rounded-none bg-secondary/30" />
            </div>
            <div className="flex-1 space-y-8">
              <div className="h-8 w-48 animate-pulse rounded-none bg-secondary" />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {Array.from({ length: 10 }, (_, i) => (
                  <MovieCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </main>
      }
    >
      <TVCategoryListing category="popular" title="Popular TV Shows" />
    </Suspense>
  );
}
