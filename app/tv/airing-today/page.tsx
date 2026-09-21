"use client";

import React, { Suspense } from "react";
import { TVCategoryListing } from "@/components/tv";
import { MediaListingSkeleton } from "@/components/common/media-listing-skeleton";

export const dynamic = "force-dynamic";

export default function AiringTodayTVPage() {
  return (
    <Suspense fallback={<MediaListingSkeleton />}>
      <TVCategoryListing category="airing-today" title="TV Shows Airing Today" />
    </Suspense>
  );
}
