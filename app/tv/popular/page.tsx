"use client";

import React, { Suspense } from "react";
import { TVCategoryListing } from "@/components/tv";
import { MediaListingSkeleton } from "@/components/common/media-listing-skeleton";

export const dynamic = "force-dynamic";

export default function PopularTVPage() {
  return (
    <Suspense fallback={<MediaListingSkeleton />}>
      <TVCategoryListing category="popular" title="Popular TV Shows" />
    </Suspense>
  );
}
