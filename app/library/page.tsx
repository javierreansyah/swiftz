import React, { Suspense } from "react";
import type { Metadata } from "next";
import { LibraryContent } from "@/components/library/library-content";
import { LibrarySkeleton } from "@/components/library/library-skeleton";

export const metadata: Metadata = {
  title: "My Library | Swiftz",
  description: "Manage your favorite films, watchlist, and movie ratings.",
};

export default function LibraryPage() {
  return (
    <Suspense fallback={<LibrarySkeleton />}>
      <LibraryContent />
    </Suspense>
  );
}
