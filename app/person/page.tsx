import { PeopleClient } from "@/features/people/components/people-client";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { MovieCardSkeleton } from "@/features/media/components/movie-card-skeleton";
export const metadata = pageMetadata({
  title: "Popular People",
  description:
    "Discover actors, directors, and filmmakers. Explore biographies, filmographies, and television credits on Swiftz.",
  path: "/person",
});

export default function PeoplePage() {
  return (
    <Suspense
      fallback={
        <main className="container min-h-screen space-y-8 pt-20 pb-16">
          <div className="h-12 w-64 animate-pulse rounded-xl bg-secondary" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 12 }, (_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        </main>
      }
    >
      <PeopleClient />
    </Suspense>
  );
}
