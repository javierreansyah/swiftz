"use client";

import React, { useState } from "react";
import {
  Bookmark,
  Heart,
  Star,
  Share2,
  Check,
  ChevronDown,
  Loader2,
  LogIn,
  Sparkles,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MovieDetailsData, Cast, Crew } from "@/types";
import { useAuth } from "@/components/providers/auth-provider";
import {
  useToggleFavoriteMutation,
  useToggleWatchlistMutation,
} from "@/hooks/use-tmdb";

function formatNumberShort(num: number): string {
  if (!num) return "0";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toString();
}

function formatCurrency(amount: number): string {
  if (!amount || amount <= 0) return "N/A";
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(0)}M`;
  return `$${amount.toLocaleString()}`;
}

export interface MovieHeroActionsProps {
  movie: MovieDetailsData;
  cast: Cast[];
  crew: Crew[];
  reviewCount: number;
  isWatchlist: boolean;
  isFavorite: boolean;
  userRating: number | null;
  onOpenModal: (modal: "reviews" | "videos" | "photos" | "cast") => void;
  onOpenRating: () => void;
  onShareClick: () => void;
}

export function MovieHeroActions({
  movie,
  cast,
  crew,
  reviewCount,
  isWatchlist,
  isFavorite,
  userRating,
  onOpenModal,
  onOpenRating,
  onShareClick,
}: MovieHeroActionsProps) {
  const { user, sessionId, isAuthenticated, login, loginDemo } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const toggleWatchlist = useToggleWatchlistMutation();
  const toggleFavorite = useToggleFavoriteMutation();

  const handleWatchlistClick = () => {
    if (!isAuthenticated || !user || !sessionId) {
      setShowAuthModal(true);
      return;
    }
    toggleWatchlist.mutate({
      accountId: user.id,
      sessionId,
      movieId: movie.id,
      watchlist: !isWatchlist,
    });
  };

  const handleFavoriteClick = () => {
    if (!isAuthenticated || !user || !sessionId) {
      setShowAuthModal(true);
      return;
    }
    toggleFavorite.mutate({
      accountId: user.id,
      sessionId,
      movieId: movie.id,
      favorite: !isFavorite,
    });
  };

  const handleRateClick = () => {
    if (!isAuthenticated || !user || !sessionId) {
      setShowAuthModal(true);
      return;
    }
    onOpenRating();
  };

  const directors = crew
    .filter((c) => c.job === "Director")
    .map((c) => c.name);
  const writers = crew
    .filter((c) => ["Screenplay", "Writer", "Story"].includes(c.job))
    .slice(0, 3)
    .map((c) => c.name);
  const stars = cast.slice(0, 4).map((c) => c.name);
  const metascore = Math.round(movie.vote_average * 10);

  return (
    <>
      {/* QUICK ACTION BAR & GENRE PILLS */}
      <div className="flex flex-col justify-between gap-4 pt-2 sm:flex-row sm:items-center">
        {/* Genre Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {movie.genres.map((genre) => (
            <Badge
              key={genre.id}
              variant="secondary"
              className="rounded-full border border-border/60 bg-secondary/70 px-3.5 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary sm:text-sm"
            >
              {genre.name}
            </Badge>
          ))}
        </div>

        {/* Watchlist Button with Dropdown */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <div className="inline-flex rounded-lg shadow-sm">
              <Button
                onClick={handleWatchlistClick}
                disabled={toggleWatchlist.isPending}
                className={`h-10 gap-2 rounded-r-none border-r-0 font-bold transition-all ${
                  isWatchlist
                    ? "bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700"
                    : "bg-amber-400 text-neutral-950 hover:bg-amber-300 dark:bg-amber-400 dark:text-neutral-950 dark:hover:bg-amber-300"
                }`}
              >
                {toggleWatchlist.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : isWatchlist ? (
                  <Check className="size-4" />
                ) : (
                  <Bookmark className="size-4 fill-current" />
                )}
                <span>
                  {formatNumberShort(movie.vote_count * 3)} ·{" "}
                  {isWatchlist ? "In Watchlist" : "Add to Watchlist"}
                </span>
              </Button>
              <DropdownMenuTrigger asChild>
                <Button
                  className={`h-10 rounded-l-none px-2.5 transition-all ${
                    isWatchlist
                      ? "bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700"
                      : "bg-amber-400 text-neutral-950 hover:bg-amber-300 dark:bg-amber-400 dark:text-neutral-950 dark:hover:bg-amber-300"
                  }`}
                >
                  <ChevronDown className="size-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
            </div>

            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem
                onClick={handleWatchlistClick}
                className="cursor-pointer gap-2 font-medium"
              >
                <Bookmark className="size-4 text-blue-500" />
                <span>
                  {isWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleFavoriteClick}
                className="cursor-pointer gap-2 font-medium"
              >
                <Heart
                  className={`size-4 text-red-500 ${
                    isFavorite ? "fill-current" : ""
                  }`}
                />
                <span>
                  {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleRateClick}
                className="cursor-pointer gap-2 font-medium"
              >
                <Star
                  className={`size-4 text-amber-500 ${
                    userRating ? "fill-current" : ""
                  }`}
                />
                <span>
                  {userRating
                    ? `Your Rating: ${userRating}/10`
                    : "Rate This Movie"}
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onShareClick}
                className="cursor-pointer gap-2 font-medium"
              >
                <Share2 className="size-4" />
                <span>Share Movie</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* METADATA GRID: Plot, Director, Writers, Stars, Box Office, Reviews */}
      <div className="space-y-4 rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-md sm:p-8">
        {/* Plot */}
        {movie.overview && (
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-12 sm:gap-4">
            <span className="text-sm font-bold text-muted-foreground sm:col-span-2">
              Plot
            </span>
            <p className="text-sm leading-relaxed text-foreground sm:col-span-10 sm:text-base">
              {movie.overview}
            </p>
          </div>
        )}

        <div className="h-px bg-border/50" />

        {/* Director */}
        {directors.length > 0 && (
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-12 sm:gap-4">
            <span className="text-sm font-bold text-muted-foreground sm:col-span-2">
              {directors.length > 1 ? "Directors" : "Director"}
            </span>
            <div className="flex flex-wrap items-center gap-2 text-sm sm:col-span-10 sm:text-base">
              {directors.map((name, i) => (
                <span key={i} className="font-semibold text-primary">
                  {name}
                  {i < directors.length - 1 && (
                    <span className="text-muted-foreground"> · </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Writers */}
        {writers.length > 0 && (
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-12 sm:gap-4">
            <span className="text-sm font-bold text-muted-foreground sm:col-span-2">
              {writers.length > 1 ? "Writers" : "Writer"}
            </span>
            <div className="flex flex-wrap items-center gap-2 text-sm sm:col-span-10 sm:text-base">
              {writers.map((name, i) => (
                <span key={i} className="font-semibold text-primary">
                  {name}
                  {i < writers.length - 1 && (
                    <span className="text-muted-foreground"> · </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Stars */}
        {stars.length > 0 && (
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-12 sm:gap-4">
            <span className="text-sm font-bold text-muted-foreground sm:col-span-2">
              Stars
            </span>
            <div className="flex flex-wrap items-center gap-2 text-sm sm:col-span-10 sm:text-base">
              {stars.map((name, i) => (
                <span key={i} className="font-semibold text-primary">
                  {name}
                  {i < stars.length - 1 && (
                    <span className="text-muted-foreground"> · </span>
                  )}
                </span>
              ))}
              <button
                onClick={() => onOpenModal("cast")}
                className="ml-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:underline"
              >
                View full cast
              </button>
            </div>
          </div>
        )}

        <div className="h-px bg-border/50" />

        {/* Box Office / Details */}
        {(movie.budget > 0 || movie.revenue > 0) && (
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-12 sm:gap-4">
            <span className="text-sm font-bold text-muted-foreground sm:col-span-2">
              Box Office
            </span>
            <div className="flex flex-wrap items-center gap-4 text-sm sm:col-span-10 sm:text-base">
              {movie.budget > 0 && (
                <span>
                  <strong className="text-muted-foreground">Budget:</strong>{" "}
                  <span className="font-medium text-foreground">
                    {formatCurrency(movie.budget)}
                  </span>
                </span>
              )}
              {movie.revenue > 0 && (
                <span>
                  <strong className="text-muted-foreground">Worldwide:</strong>{" "}
                  <span className="font-medium text-foreground">
                    {formatCurrency(movie.revenue)}
                  </span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Reviews Row with Metascore and modal trigger */}
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-12 sm:gap-4">
          <span className="text-sm font-bold text-muted-foreground sm:col-span-2">
            Reviews
          </span>
          <div className="flex flex-wrap items-center gap-3 text-sm sm:col-span-10 sm:text-base">
            <button
              onClick={() => onOpenModal("reviews")}
              className="group flex items-center gap-1.5 font-semibold text-primary hover:underline"
            >
              <span>
                {reviewCount > 0
                  ? `${reviewCount} User Reviews`
                  : "User Reviews"}
              </span>
            </button>

            <span className="text-muted-foreground">·</span>

            <div className="flex items-center gap-1.5">
              <span
                className={`flex size-6 items-center justify-center rounded text-xs font-bold text-white ${
                  metascore >= 70
                    ? "bg-emerald-600"
                    : metascore >= 50
                    ? "bg-amber-600"
                    : "bg-red-600"
                }`}
              >
                {metascore}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                Metascore
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* AUTH PROMPT MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200 fade-in">
          <div className="relative w-full max-w-md space-y-4 rounded-2xl border bg-card p-6 shadow-2xl">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="size-5" />
            </button>
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/20 text-primary">
              <LogIn className="size-6" />
            </div>
            <div className="space-y-1 text-center">
              <h3 className="text-xl font-bold">Sign in with TMDB</h3>
              <p className="text-sm text-muted-foreground">
                Connect your TMDB account to save {movie.title} to your watchlist,
                favorites, and rate it.
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Button
                onClick={() => {
                  setShowAuthModal(false);
                  login();
                }}
                className="w-full gap-2 font-bold"
              >
                <LogIn className="size-4" />
                <span>Connect TMDB Account</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAuthModal(false);
                  loginDemo();
                }}
                className="w-full gap-2 text-xs"
              >
                <Sparkles className="size-3.5 text-primary" />
                <span>Try Demo Account (Instant Preview)</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MovieHeroActions;
