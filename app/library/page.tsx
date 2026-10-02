import React, { Suspense } from "react";
import { pageMetadata } from "@/lib/seo";
import { LibraryContent } from "@/components/library/library-content";
import { LibrarySkeleton } from "@/components/library/library-skeleton";

export const metadata = pageMetadata({ title: "My Library", description: "Manage your favorite films, watchlist, and movie ratings.", path: "/library", noIndex: true });

export default function LibraryPage() {
  return (
    <Suspense fallback={<LibrarySkeleton />}>
      <LibraryContent />
    </Suspense>
  );
}
