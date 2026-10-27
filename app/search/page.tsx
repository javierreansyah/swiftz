import { SearchClient } from "@/features/search/components/search-client";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
export const metadata = pageMetadata({
  title: "Search Movies, TV & People",
  description:
    "Search for movies, television series, people, and collections on Swiftz.",
  path: "/search",
  noIndex: true,
});

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="container min-h-screen space-y-8 py-20">
          <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:gap-10">
            <div className="h-72 w-full animate-pulse rounded-xl bg-secondary lg:w-60 lg:shrink-0" />
            <div className="h-72 min-w-0 animate-pulse rounded-xl bg-secondary lg:flex-1" />
          </div>
        </main>
      }
    >
      <SearchClient />
    </Suspense>
  );
}
