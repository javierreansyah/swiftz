"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import {
  useAccountFavoritesQuery,
  useAccountWatchlistQuery,
  useAccountRatedQuery,
} from "@/hooks/use-tmdb";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import MovieCardSkeleton from "@/components/movie-card-skeleton";
import MovieCard from "@/components/movie-card";
import PaginationSystem from "@/components/pagination-system";
import {
  Heart,
  Bookmark,
  Star,
  LogIn,
  LogOut,
  ExternalLink,
  Film,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";

type LibraryTab = "favorites" | "watchlist" | "rated";

function LibrarySkeleton() {
  return (
    <div className="container min-h-screen pt-24 pb-16 space-y-8 animate-pulse">
      {/* Profile Header Skeleton */}
      <div className="border rounded-2xl p-6 sm:p-8 bg-card/50 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <Skeleton className="h-20 w-20 rounded-full flex-none" />
        <div className="space-y-3 flex-1 text-center sm:text-left">
          <Skeleton className="h-6 w-48 mx-auto sm:mx-0" />
          <Skeleton className="h-4 w-32 mx-auto sm:mx-0" />
          <div className="flex gap-4 justify-center sm:justify-start pt-2">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2 border-b pb-4">
        <Skeleton className="h-10 w-32 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      {/* Movie Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {Array.from({ length: 10 }, (_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function LibraryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, sessionId, isAuthenticated, isLoading: isLoadingAuth, login, loginDemo, logout } =
    useAuth();

  const initialTab = (searchParams.get("tab") as LibraryTab) || "favorites";
  const [activeTab, setActiveTab] = useState<LibraryTab>(
    ["favorites", "watchlist", "rated"].includes(initialTab)
      ? initialTab
      : "favorites"
  );
  const [page, setPage] = useState<number>(1);

  // Sync tab with URL search params when changed outside (e.g. navigation menu clicks)
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

  // Queries for authenticated user
  const accountId = user?.id;
  const favoritesQuery = useAccountFavoritesQuery(
    accountId,
    sessionId,
    activeTab === "favorites" ? page : 1
  );
  const watchlistQuery = useAccountWatchlistQuery(
    accountId,
    sessionId,
    activeTab === "watchlist" ? page : 1
  );
  const ratedQuery = useAccountRatedQuery(
    accountId,
    sessionId,
    activeTab === "rated" ? page : 1
  );

  // Active query based on current tab
  const currentQuery =
    activeTab === "favorites"
      ? favoritesQuery
      : activeTab === "watchlist"
      ? watchlistQuery
      : ratedQuery;

  if (isLoadingAuth) {
    return <LibrarySkeleton />;
  }

  // Not signed in state
  if (!isAuthenticated || !user) {
    return (
      <div className="container min-h-screen pt-28 pb-16">
        <div className="max-w-3xl mx-auto space-y-10">
          {/* Welcome Card */}
          <div className="relative overflow-hidden border rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-card/90 to-card/50 shadow-xl text-center space-y-6">
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
              <Film className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                <Sparkles className="w-3.5 h-3.5" />
                TMDB Cloud Sync
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                Your Personal Cinema Library
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
                Sign in with your TMDB account to access your personal Favorites,
                curated Watchlist, and film Ratings anytime, on any device.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button
                size="lg"
                onClick={() => login()}
                className="w-full sm:w-auto font-semibold gap-2 shadow-lg shadow-primary/20 px-8"
              >
                <LogIn className="w-5 h-5" />
                <span>Connect with TMDB</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => loginDemo()}
                className="w-full sm:w-auto gap-2"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Try Demo Account</span>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto text-muted-foreground"
              >
                <a
                  href="https://www.themoviedb.org/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  <span>Create Account</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Feature highlights grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="border rounded-2xl p-6 bg-card/40 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base">Favorites</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Bookmark the films you love most and quickly revisit them anytime.
              </p>
            </div>

            <div className="border rounded-2xl p-6 bg-card/40 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Bookmark className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base">Watchlist</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Build your queue of upcoming releases and must-watch movies.
              </p>
            </div>

            <div className="border rounded-2xl p-6 bg-card/40 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base">1-10 Ratings</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Rate films you have seen and maintain a personal record of your scores.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Determine avatar URL
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
    <div className="container min-h-screen pt-24 pb-16 space-y-8">
      {/* User Profile Banner */}
      <div className="relative overflow-hidden border rounded-3xl p-6 sm:p-8 bg-card/60 backdrop-blur-md shadow-lg">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {/* Avatar */}
            {avatarUrl ? (
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl overflow-clip ring-2 ring-primary/30 shadow-md flex-none">
                <Image
                  src={avatarUrl}
                  alt={user.name || user.username}
                  fill
                  sizes="96px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 text-primary flex items-center justify-center font-black text-2xl shadow-md flex-none">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}

            {/* User Meta */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {user.name || user.username}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  TMDB Connected
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                @{user.username} • TMDB ID #{user.id}
              </p>

              {/* Action Links */}
              <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
                <a
                  href={`https://www.themoviedb.org/u/${user.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
                >
                  <span>View on TMDB</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Sign Out Button */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="gap-2 text-xs hover:text-red-500 hover:border-red-500/40"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center justify-between border-b pb-2 gap-4 overflow-x-auto">
        <div className="flex items-center gap-2">
          {/* Favorites Tab */}
          <Button
            variant={activeTab === "favorites" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleTabChange("favorites")}
            className="gap-2 rounded-xl transition-all"
          >
            <Heart
              className={`w-4 h-4 ${
                activeTab === "favorites" ? "fill-current" : "text-red-500"
              }`}
            />
            <span className="font-semibold">Favorites</span>
            {favoritesQuery.data?.total_results !== undefined && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === "favorites"
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {favoritesQuery.data.total_results}
              </span>
            )}
          </Button>

          {/* Watchlist Tab */}
          <Button
            variant={activeTab === "watchlist" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleTabChange("watchlist")}
            className="gap-2 rounded-xl transition-all"
          >
            <Bookmark
              className={`w-4 h-4 ${
                activeTab === "watchlist" ? "fill-current" : "text-blue-500"
              }`}
            />
            <span className="font-semibold">Watchlist</span>
            {watchlistQuery.data?.total_results !== undefined && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === "watchlist"
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {watchlistQuery.data.total_results}
              </span>
            )}
          </Button>

          {/* Rated Movies Tab */}
          <Button
            variant={activeTab === "rated" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleTabChange("rated")}
            className="gap-2 rounded-xl transition-all"
          >
            <Star
              className={`w-4 h-4 ${
                activeTab === "rated" ? "fill-current" : "text-amber-500"
              }`}
            />
            <span className="font-semibold">Rated</span>
            {ratedQuery.data?.total_results !== undefined && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === "rated"
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {ratedQuery.data.total_results}
              </span>
            )}
          </Button>
        </div>

        {/* Refresh Current Tab */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => currentQuery.refetch()}
          disabled={currentQuery.isFetching}
          className="gap-1 text-xs text-muted-foreground hover:text-foreground"
          title="Refresh items"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${
              currentQuery.isFetching ? "animate-spin" : ""
            }`}
          />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {/* Tab Content Section */}
      <section className="space-y-8">
        {/* Loading State */}
        {currentQuery.isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {Array.from({ length: 10 }, (_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {currentQuery.isError && (
          <div className="border rounded-2xl p-10 text-center space-y-4 bg-card/40">
            <p className="text-red-500 font-semibold">
              Failed to load your {activeTab}.
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              There was an issue communicating directly with TMDB. Please check
              your internet connection or try again.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => currentQuery.refetch()}
              className="gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!currentQuery.isLoading && !currentQuery.isError && movies.length === 0 && (
          <div className="border border-dashed rounded-3xl p-12 sm:p-16 text-center space-y-5 bg-card/20">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground">
              {activeTab === "favorites" && <Heart className="w-8 h-8 text-red-400" />}
              {activeTab === "watchlist" && <Bookmark className="w-8 h-8 text-blue-400" />}
              {activeTab === "rated" && <Star className="w-8 h-8 text-amber-400" />}
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="font-bold text-xl sm:text-2xl">
                {activeTab === "favorites" && "No favorite movies yet"}
                {activeTab === "watchlist" && "Your watchlist is empty"}
                {activeTab === "rated" && "No rated movies yet"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {activeTab === "favorites" &&
                  "Browse movies on Swiftz and click the heart icon to save films you love to your personal library."}
                {activeTab === "watchlist" &&
                  "Add movies you want to watch soon by clicking the watchlist button on any movie details page."}
                {activeTab === "rated" &&
                  "Score films from 1 to 10 stars to keep a record of everything you have watched."}
              </p>
            </div>

            <div className="pt-2">
              <Button asChild size="sm" className="gap-2">
                <Link href="/discover">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Discover Movies</span>
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Populated Movie Grid */}
        {!currentQuery.isLoading && !currentQuery.isError && movies.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Showing {movies.length} of {totalResults} {activeTab}
              </p>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {movies.map((movie: any) => {
                // If this is rated movies tab, TMDB returns personal rating as `rating`
                const personalRating = movie.rating;

                return (
                  <li key={movie.id} className="relative group">
                    <MovieCard
                      id={movie.id}
                      title={movie.title}
                      poster={movie.poster_path}
                      rating={movie.vote_average}
                    />

                    {/* Personal Rating Tag */}
                    {activeTab === "rated" && typeof personalRating === "number" && (
                      <div className="absolute top-2 right-2 bg-amber-500 text-black font-extrabold text-xs px-2 py-0.5 rounded-md shadow-md flex items-center gap-1 z-10 pointer-events-none">
                        <Star className="w-3 h-3 fill-black text-black" />
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

export default function LibraryPage() {
  return (
    <Suspense fallback={<LibrarySkeleton />}>
      <LibraryContent />
    </Suspense>
  );
}
