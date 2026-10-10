"use client";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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
    inputVal,
    setInputVal,
    router,
    handleSearchSubmit,
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
      {/* Top Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="relative flex w-full items-center"
      >
        <Search className="pointer-events-none absolute left-3 size-5 text-muted-foreground" />
        <Input
          leadingIcon
          type="search"
          value={inputVal}
          onChange={(e) => {
            setInputVal(e.target.value);
            if (!e.target.value) {
              router.push("/search");
            }
          }}
          placeholder="Search movies, TV shows, people, collections..."
        />
      </form>

      {/* Main Two-Column Layout matching Reference 3 */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12 lg:gap-10">
        {/* Left Sidebar (Desktop 4 cols) / Top Pills (Mobile) */}
        <SearchCategoryNavigation
          categories={categories}
          typeParam={typeParam}
          handleCategoryChange={handleCategoryChange}
        />

        {/* Right Content Column */}
        <section className="min-w-0 flex-1 space-y-6 lg:col-span-8 xl:col-span-9">
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
                Enter a title, actor, or keyword in the box above to explore
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
