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
          <div className="h-12 w-full animate-pulse rounded-xl bg-secondary" />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="h-72 w-full animate-pulse rounded-xl bg-secondary lg:col-span-4" />
            <div className="h-72 w-full animate-pulse rounded-xl bg-secondary lg:col-span-8" />
          </div>
        </main>
      }
    >
      <SearchClient />
    </Suspense>
  );
}
