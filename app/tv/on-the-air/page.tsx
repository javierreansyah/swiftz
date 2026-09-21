"use client";

import React, { Suspense } from "react";
import { TVCategoryListing } from "@/components/tv";
import { MediaListingSkeleton } from "@/components/common/media-listing-skeleton";

export const dynamic = "force-dynamic";

export default function OnTheAirTVPage() {
  return (
    <Suspense fallback={<MediaListingSkeleton />}>
      <TVCategoryListing
        category="on-the-air"
        title="Currently Airing TV Shows"
      />
    </Suspense>
  );
}
