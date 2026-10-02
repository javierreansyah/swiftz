"use client";
import { useSearchParams } from "next/navigation";
import { useClientQueryRouter } from "@/hooks/use-client-query-router";
import { parsePage } from "@/lib/pagination";
import { User } from "lucide-react";
import { usePopularPeopleQuery } from "@/features/people/hooks/queries";
import { PersonCard } from "@/features/people/components/person-card";
import { SectionHeader } from "@/components/common/section-header";
import { PaginationSystem } from "@/components/common/pagination-system";
import { MovieCardSkeleton } from "@/features/media/components/movie-card-skeleton";
import { QueryFeedback } from "@/features/media/components/query-feedback";
export function PeopleClient() {
  const searchParams = useSearchParams();
  const router = useClientQueryRouter();

  const pageParam = searchParams.get("page");
  const currentPage = parsePage(pageParam);

  const { data, isLoading, isError, refetch } =
    usePopularPeopleQuery(currentPage);

  const people = data?.results || [];
  const totalPages = Math.min(data?.total_pages || 1, 500);

  const handlePageChange = (newPage: number) => {
    router.push(`/person?page=${newPage}`);
  };

  return (
    <main className="container min-h-screen space-y-8 pt-20 pb-16">
      <SectionHeader
        headingAs="h1"
        title="Popular People"
        badge={`Page ${currentPage} of ${totalPages}`}
        className="pt-4"
      />

      {isError && (
        <QueryFeedback hasData={Boolean(data)} onRetry={() => void refetch()} />
      )}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 18 }, (_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : isError && !data ? null : people.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center space-y-3 rounded-3xl border border-dashed border-border bg-card p-8 text-center">
          <User className="size-10 text-muted-foreground" />
          <h3 className="heading-card">No People Found</h3>
          <p className="max-w-md text-xs text-muted-foreground">
            Unable to load popular people right now. Please try again later.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {people.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pt-6">
              <PaginationSystem
                currentPage={currentPage}
                totalPage={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </main>
  );
}
