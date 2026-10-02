import { TVDiscoveryClient } from "@/features/tv/discovery/tv-discovery-client";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { MediaListingSkeleton } from "@/features/media/components/media-listing-skeleton";
export const metadata = pageMetadata({
  title: "Discover TV Shows",
  description:
    "Discover popular television series, top-rated shows, and what's airing today. Filter TV shows by genre, year, and rating.",
  path: "/tv",
});

export default function TVPage() {
  return (
    <Suspense fallback={<MediaListingSkeleton />}>
      <TVDiscoveryClient />
    </Suspense>
  );
}
