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
    <div className="container min-h-screen animate-pulse space-y-8 pt-24 pb-16">
      {/* Profile Header Skeleton */}
      <div className="flex flex-col items-center gap-6 rounded-2xl border bg-card/50 p-6 sm:flex-row sm:items-start sm:p-8">
        <Skeleton className="size-20 flex-none rounded-full" />
        <div className="flex-1 space-y-3 text-center sm:text-left">
          <Skeleton className="mx-auto h-6 w-48 sm:mx-0" />
          <Skeleton className="mx-auto h-4 w-32 sm:mx-0" />
          <div className="flex justify-center gap-4 pt-2 sm:justify-start">
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
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
        <div className="mx-auto max-w-3xl space-y-10">
          {/* Welcome Card */}
          <div className="relative space-y-6 overflow-hidden rounded-3xl border bg-linear-to-b from-card/90 to-card/50 p-8 text-center shadow-xl sm:p-12">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-inner sm:size-20">
              <Film className="size-8 sm:size-10" />
            </div>

            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="size-3.5" />
                TMDB Cloud Sync
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Your Personal Cinema Library
              </h1>
              <p className="mx-auto max-w-xl text-sm text-muted-foreground sm:text-base">
                Sign in with your TMDB account to access your personal Favorites,
                curated Watchlist, and film Ratings anytime, on any device.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
              <Button
                size="lg"
                onClick={() => login()}
                className="w-full gap-2 px-8 font-semibold shadow-lg shadow-primary/20 sm:w-auto"
              >
                <LogIn className="size-5" />
                <span>Connect with TMDB</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => loginDemo()}
                className="w-full gap-2 sm:w-auto"
              >
                <Sparkles className="size-4 text-primary" />
                <span>Try Demo Account</span>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="w-full text-muted-foreground sm:w-auto"
              >
                <a
                  href="https://www.themoviedb.org/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  <span>Create Account</span>
                  <ExternalLink className="size-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Feature highlights grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="space-y-3 rounded-2xl border bg-card/40 p-6">
              <div className="flex size-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                <Heart className="size-5" />
              </div>
              <h3 className="text-base font-bold">Favorites</h3>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Bookmark the films you love most and quickly revisit them anytime.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border bg-card/40 p-6">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <Bookmark className="size-5" />
              </div>
              <h3 className="text-base font-bold">Watchlist</h3>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Build your queue of upcoming releases and must-watch movies.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border bg-card/40 p-6">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                <Star className="size-5" />
              </div>
              <h3 className="text-base font-bold">1-10 Ratings</h3>
              <p className="text-xs text-muted-foreground sm:text-sm">
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
    <div className="container min-h-screen space-y-8 pt-24 pb-16">
      {/* User Profile Banner */}
      <div className="relative overflow-hidden rounded-3xl border bg-card/60 p-6 shadow-lg backdrop-blur-md sm:p-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-start">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
            {/* Avatar */}
            {avatarUrl ? (
              <div className="relative size-20 flex-none overflow-clip rounded-2xl shadow-md ring-2 ring-primary/30 sm:size-24">
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
              <div className="flex size-20 flex-none items-center justify-center rounded-2xl border border-primary/20 bg-linear-to-br from-primary/30 to-primary/10 text-2xl font-black text-primary shadow-md sm:size-24">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}

            {/* User Meta */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {user.name || user.username}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
                  <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                  TMDB Connected
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                @{user.username} • TMDB ID #{user.id}
              </p>

              {/* Action Links */}
              <div className="flex items-center justify-center gap-3 pt-1 sm:justify-start">
                <a
                  href={`https://www.themoviedb.org/u/${user.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span>View on TMDB</span>
                  <ExternalLink className="size-3" />
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
              className="gap-2 text-xs hover:border-red-500/40 hover:text-red-500"
            >
              <LogOut className="size-3.5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto border-b pb-2">
        <div className="flex items-center gap-2">
          {/* Favorites Tab */}
          <Button
            variant={activeTab === "favorites" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleTabChange("favorites")}
            className="gap-2 rounded-xl transition-all"
          >
            <Heart
              className={`size-4 ${
                activeTab === "favorites" ? "fill-current" : "text-red-500"
              }`}
            />
            <span className="font-semibold">Favorites</span>
            {favoritesQuery.data?.total_results !== undefined && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
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
              className={`size-4 ${
                activeTab === "watchlist" ? "fill-current" : "text-blue-500"
              }`}
            />
            <span className="font-semibold">Watchlist</span>
            {watchlistQuery.data?.total_results !== undefined && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
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
              className={`size-4 ${
                activeTab === "rated" ? "fill-current" : "text-amber-500"
              }`}
            />
            <span className="font-semibold">Rated</span>
            {ratedQuery.data?.total_results !== undefined && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
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
            className={`size-3.5 ${
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
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }, (_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {currentQuery.isError && (
          <div className="space-y-4 rounded-2xl border bg-card/40 p-10 text-center">
            <p className="font-semibold text-red-500">
              Failed to load your {activeTab}.
            </p>
            <p className="mx-auto max-w-sm text-xs text-muted-foreground">
              There was an issue communicating directly with TMDB. Please check
              your internet connection or try again.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => currentQuery.refetch()}
              className="gap-2"
            >
              <RefreshCw className="size-3.5" />
              <span>Try Again</span>
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!currentQuery.isLoading && !currentQuery.isError && movies.length === 0 && (
          <div className="space-y-5 rounded-3xl border border-dashed bg-card/20 p-12 text-center sm:p-16">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
              {activeTab === "favorites" && <Heart className="size-8 text-red-400" />}
              {activeTab === "watchlist" && <Bookmark className="size-8 text-blue-400" />}
              {activeTab === "rated" && <Star className="size-8 text-amber-400" />}
            </div>

            <div className="mx-auto max-w-md space-y-2">
              <h3 className="text-xl font-bold sm:text-2xl">
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
                  <SlidersHorizontal className="size-4" />
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
              <p className="text-xs text-muted-foreground sm:text-sm">
                Showing {movies.length} of {totalResults} {activeTab}
              </p>
            </div>

            <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {movies.map((movie: any) => {
                // If this is rated movies tab, TMDB returns personal rating as `rating`
                const personalRating = movie.rating;

                return (
                  <li key={movie.id} className="group relative">
                    <MovieCard
                      id={movie.id}
                      title={movie.title}
                      poster={movie.poster_path}
                      rating={movie.vote_average}
                    />

                    {/* Personal Rating Tag */}
                    {activeTab === "rated" && typeof personalRating === "number" && (
                      <div className="pointer-events-none absolute top-2 right-2 z-10 flex items-center gap-1 rounded-md bg-amber-500 px-2 py-0.5 text-xs font-extrabold text-black shadow-md">
                        <Star className="size-3 fill-black text-black" />
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
