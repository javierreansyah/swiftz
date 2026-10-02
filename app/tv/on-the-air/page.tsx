import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { TVCategoryListing } from "@/features/tv/discovery/tv-category-listing";
import { MediaListingSkeleton } from "@/features/media/components/media-listing-skeleton";
export const metadata = pageMetadata({
  title: "TV Shows On the Air",
  description:
    "Explore television shows currently airing and discover their latest seasons and episodes.",
  path: "/tv/on-the-air",
});

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
