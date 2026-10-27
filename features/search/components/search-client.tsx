"use client";
import { Search } from "lucide-react";
import { PaginationSystem } from "@/components/common/pagination-system";
import { useSearchController } from "@/features/search/hooks/use-search-controller";
import { SearchCategoryNavigation } from "@/features/search/components/search-category-navigation";
import { SearchResults } from "@/features/search/components/search-results";
import { QueryFeedback } from "@/features/media/components/query-feedback";
import { MovieCardSkeleton } from "@/features/media/components/movie-card-skeleton";
export function SearchClient() {
  const {
    rawQuery,
    typeParam,
    handleCategoryChange,
    handlePageChange,
    categories,
    currentPage,
    totalPages,
    isLoading,
    activeQuery,
    dataset,
  } = useSearchController();
  return (
    <main className="container min-h-screen space-y-3 pt-20 pb-12 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:gap-10">
        <SearchCategoryNavigation
          categories={categories}
          typeParam={typeParam}
          handleCategoryChange={handleCategoryChange}
        />

        {/* Right Content Column */}
        <section className="min-w-0 flex-1 space-y-6">
          {activeQuery?.isError && (
            <QueryFeedback
              hasData={Boolean(activeQuery.data)}
              onRetry={() => void activeQuery.refetch()}
            />
          )}
          {!rawQuery ? (
            <div className="flex h-64 flex-col items-center justify-center space-y-2 rounded-3xl border border-dashed border-border bg-card p-8 text-center">
              <Search className="size-10 text-muted-foreground" />
              <h2 className="heading-section">Search Swiftz</h2>
              <p className="text-xs text-muted-foreground">
                Enter a title, actor, or keyword in the header search to explore
                movies, TV shows, and celebrities.
              </p>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }, (_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </div>
          ) : activeQuery?.isError && !activeQuery.data ? null : dataset.items
              .length === 0 &&
            dataset.category !== "networks" &&
            dataset.category !== "awards" ? (
            <p className="text-sm text-muted-foreground">
              No results found. Try a different search.
            </p>
          ) : (
            <>
              <SearchResults dataset={dataset} rawQuery={rawQuery} />

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
        </section>
      </div>
    </main>
  );
}
