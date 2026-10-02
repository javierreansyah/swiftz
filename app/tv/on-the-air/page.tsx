import { pageMetadata } from "@/lib/seo";
import React, { Suspense } from "react";
import { TVCategoryListing } from "@/components/tv";
import { MediaListingSkeleton } from "@/components/common/media-listing-skeleton";

export const metadata = pageMetadata({ title: "TV Shows On the Air", description: "Explore television shows currently airing and discover their latest seasons and episodes.", path: "/tv/on-the-air" });

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
