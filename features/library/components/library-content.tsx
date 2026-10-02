"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useClientQueryRouter } from "@/hooks/use-client-query-router";
import { Star } from "lucide-react";
import { useAuth } from "@/features/auth/auth-provider";
import {
  useAccountFavoritesQuery,
  useAccountWatchlistQuery,
  useAccountRatedQuery,
} from "@/features/library/hooks/queries";
import { MovieCard } from "@/features/movies/components/movie-card";
import { MovieCardSkeleton } from "@/features/media/components/movie-card-skeleton";
import { PaginationSystem } from "@/components/common/pagination-system";
import { LibrarySkeleton } from "@/features/library/components/library-skeleton";
import { LibraryHeader } from "@/features/library/components/library-header";
import {
  type LibraryTab,
  LibraryTabs,
} from "@/features/library/components/library-tabs";
import {
  LibraryUnauthenticated,
  LibraryEmptyState,
} from "@/features/library/components/library-empty-state";
import { QueryFeedback } from "@/features/media/components/query-feedback";
export function LibraryContent() {
  const router = useClientQueryRouter();
  const searchParams = useSearchParams();
  const {
    user,
    sessionId,
    isAuthenticated,
    isLoading: isLoadingAuth,
    login,
    loginDemo,
    logout,
  } = useAuth();

  const initialTab = (searchParams.get("tab") as LibraryTab) || "favorites";
  const [activeTab, setActiveTab] = useState<LibraryTab>(
    ["favorites", "watchlist", "rated"].includes(initialTab)
      ? initialTab
      : "favorites",
  );
  const [page, setPage] = useState<number>(1);

  // Sync tab with URL search params
  useEffect(() => {
    const tabParam = searchParams.get("tab") as LibraryTab;
    if (
      tabParam &&
      ["favorites", "watchlist", "rated"].includes(tabParam) &&
      tabParam !== activeTab
    ) {
      setActiveTab(tabParam);
      setPage(1);
    }
  }, [searchParams, activeTab]);

  const handleTabChange = (newTab: LibraryTab) => {
    setActiveTab(newTab);
    setPage(1);
    router.replace(`/library?tab=${newTab}`, { scroll: false });
  };

  const accountId = user?.id;
  const favoritesQuery = useAccountFavoritesQuery(
    accountId,
    sessionId,
    page,
    activeTab === "favorites",
  );
  const watchlistQuery = useAccountWatchlistQuery(
    accountId,
    sessionId,
    page,
    activeTab === "watchlist",
  );
  const ratedQuery = useAccountRatedQuery(
    accountId,
    sessionId,
    page,
    activeTab === "rated",
  );

  const currentQuery =
    activeTab === "favorites"
      ? favoritesQuery
      : activeTab === "watchlist"
        ? watchlistQuery
        : ratedQuery;

  if (isLoadingAuth) {
    return <LibrarySkeleton />;
  }

  if (!isAuthenticated || !user) {
    return <LibraryUnauthenticated onLogin={login} onLoginDemo={loginDemo} />;
  }

  let avatarUrl: string | null = null;
  if (user.avatar?.tmdb?.avatar_path) {
    avatarUrl = `https://image.tmdb.org/t/p/w185${user.avatar.tmdb.avatar_path}`;
  } else if (user.avatar?.gravatar?.hash) {
    avatarUrl = `https://www.gravatar.com/avatar/${user.avatar.gravatar.hash}?s=185`;
  }

  const movies = currentQuery.data?.results || [];
  const totalResults = currentQuery.data?.total_results ?? 0;
  const totalPages = currentQuery.data?.total_pages ?? 1;

  return (
    <div className="container min-h-screen space-y-8 pt-24 pb-16">
      <LibraryHeader user={user} avatarUrl={avatarUrl} onLogout={logout} />

      <LibraryTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        favoritesCount={favoritesQuery.data?.total_results}
        watchlistCount={watchlistQuery.data?.total_results}
        ratedCount={ratedQuery.data?.total_results}
      />

      {/* Tab Content Section */}
      <section className="space-y-8">
        {/* Loading State */}
        {currentQuery.isLoading && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }, (_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {currentQuery.isError && (
          <QueryFeedback
            hasData={Boolean(currentQuery.data)}
            onRetry={() => void currentQuery.refetch()}
          />
        )}

        {/* Empty State */}
        {!currentQuery.isLoading &&
          !currentQuery.isError &&
          movies.length === 0 && <LibraryEmptyState activeTab={activeTab} />}

        {/* Populated Movie Grid */}
        {!currentQuery.isLoading && movies.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground sm:text-sm">
                Showing {movies.length} of {totalResults} {activeTab}
              </p>
            </div>

            <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {movies.map((movie) => {
                const personalRating =
                  "rating" in movie ? movie.rating : undefined;

                return (
                  <li key={movie.id} className="group relative">
                    <MovieCard
                      id={movie.id}
                      title={movie.title}
                      poster={movie.poster_path}
                      rating={movie.vote_average}
                    />

                    {/* Personal Rating Tag */}
                    {activeTab === "rated" &&
                      typeof personalRating === "number" && (
                        <div className="pointer-events-none absolute top-2 right-2 z-10 flex items-center gap-1 rounded-xl bg-primary px-2 py-0.5 text-xs font-extrabold text-primary-foreground shadow-md">
                          <Star className="size-3 fill-primary-foreground text-primary-foreground" />
                          <span>{personalRating}/10</span>
                        </div>
                      )}
                  </li>
                );
              })}
            </ul>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pt-8">
                <PaginationSystem
                  currentPage={page}
                  totalPage={totalPages}
                  onPageChange={(newPage) => {
                    setPage(newPage);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
