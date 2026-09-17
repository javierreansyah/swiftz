"use client";

import React, { useState } from "react";
import { useAuth } from "./providers/auth-provider";
import {
  useMovieAccountStatesQuery,
  useToggleFavoriteMutation,
  useToggleWatchlistMutation,
  useRateMovieMutation,
  useDeleteRatingMutation,
} from "@/hooks/use-tmdb";
import { Button } from "./ui/button";
import {
  Heart,
  Bookmark,
  Star,
  LogIn,
  X,
  Trash2,
  Check,
  Loader2,
  Sparkles,
} from "lucide-react";

interface MovieUserActionsProps {
  id: string | number;
  title?: string;
}

export default function MovieUserActions({ id, title }: MovieUserActionsProps) {
  const movieId = Number(id);
  const { user, sessionId, isAuthenticated, login, loginDemo } = useAuth();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(8);

  const { data: states, isLoading: isLoadingStates } = useMovieAccountStatesQuery(
    movieId,
    sessionId
  );

  const toggleFavorite = useToggleFavoriteMutation();
  const toggleWatchlist = useToggleWatchlistMutation();
  const rateMovie = useRateMovieMutation();
  const deleteRating = useDeleteRatingMutation();

  const isFavorite = Boolean(states?.favorite);
  const isWatchlist = Boolean(states?.watchlist);
  const userRating =
    typeof states?.rated === "object" && states?.rated !== null
      ? states.rated.value
      : states?.rated === true
      ? 10
      : null;

  const handleFavoriteClick = () => {
    if (!isAuthenticated || !user || !sessionId) {
      setShowAuthModal(true);
      return;
    }
    toggleFavorite.mutate({
      accountId: user.id,
      sessionId,
      movieId,
      favorite: !isFavorite,
    });
  };

  const handleWatchlistClick = () => {
    if (!isAuthenticated || !user || !sessionId) {
      setShowAuthModal(true);
      return;
    }
    toggleWatchlist.mutate({
      accountId: user.id,
      sessionId,
      movieId,
      watchlist: !isWatchlist,
    });
  };

  const handleRateClick = () => {
    if (!isAuthenticated || !user || !sessionId) {
      setShowAuthModal(true);
      return;
    }
    setSelectedRating(userRating || 8);
    setShowRatingModal(true);
  };

  const handleSubmitRating = (ratingValue: number) => {
    if (!sessionId) return;
    rateMovie.mutate(
      {
        movieId,
        sessionId,
        rating: ratingValue,
      },
      {
        onSuccess: () => setShowRatingModal(false),
      }
    );
  };

  const handleDeleteRating = () => {
    if (!sessionId) return;
    deleteRating.mutate(
      {
        movieId,
        sessionId,
      },
      {
        onSuccess: () => setShowRatingModal(false),
      }
    );
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 pt-3">
        {/* Favorite Button */}
        <Button
          variant={isFavorite ? "default" : "outline"}
          size="sm"
          onClick={handleFavoriteClick}
          disabled={toggleFavorite.isPending}
          className={`gap-2 transition-all ${
            isFavorite
              ? "border-red-600 bg-red-600 text-white hover:bg-red-700"
              : "hover:border-red-500/50 hover:text-red-500"
          }`}
        >
          <Heart
            className={`size-4 ${
              isFavorite ? "fill-current text-white" : ""
            }`}
          />
          <span>{isFavorite ? "Favorited" : "Favorite"}</span>
        </Button>

        {/* Watchlist Button */}
        <Button
          variant={isWatchlist ? "default" : "outline"}
          size="sm"
          onClick={handleWatchlistClick}
          disabled={toggleWatchlist.isPending}
          className={`gap-2 transition-all ${
            isWatchlist
              ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
              : "hover:border-blue-500/50 hover:text-blue-500"
          }`}
        >
          <Bookmark
            className={`size-4 ${
              isWatchlist ? "fill-current text-white" : ""
            }`}
          />
          <span>{isWatchlist ? "In Watchlist" : "Watchlist"}</span>
        </Button>

        {/* Rating Button */}
        <Button
          variant={userRating ? "default" : "outline"}
          size="sm"
          onClick={handleRateClick}
          className={`gap-2 transition-all ${
            userRating
              ? "border-amber-600 bg-amber-600 text-white hover:bg-amber-700"
              : "hover:border-amber-500/50 hover:text-amber-500"
          }`}
        >
          <Star
            className={`size-4 ${
              userRating ? "fill-current text-white" : ""
            }`}
          />
          <span>{userRating ? `Your Rating: ${userRating}/10` : "Rate"}</span>
        </Button>
      </div>

      {/* Auth Modal Prompt */}
      {showAuthModal && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200">
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
                Connect your free TMDB account to save {title || "this movie"} to
                your favorites, build your watchlist, and leave ratings.
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
              <Button
                variant="ghost"
                onClick={() => setShowAuthModal(false)}
                className="w-full text-muted-foreground"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200">
          <div className="relative w-full max-w-md space-y-5 rounded-2xl border bg-card p-6 shadow-2xl">
            <button
              onClick={() => setShowRatingModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="size-5" />
            </button>

            <div className="space-y-1 text-center">
              <h3 className="text-xl font-bold">Rate Movie</h3>
              <p className="mx-auto max-w-xs truncate text-sm text-muted-foreground">
                {title || "Select your score"}
              </p>
            </div>

            {/* Stars Row (1 to 10) */}
            <div className="flex flex-col items-center space-y-3 py-2">
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {Array.from({ length: 10 }, (_, i) => {
                  const starValue = i + 1;
                  const active =
                    (hoverRating !== null ? hoverRating : selectedRating) >=
                    starValue;
                  return (
                    <button
                      key={starValue}
                      type="button"
                      onMouseEnter={() => setHoverRating(starValue)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setSelectedRating(starValue)}
                      className="p-1 transition-transform hover:scale-125"
                    >
                      <Star
                        className={`size-7 transition-colors ${
                          active
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/40"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <div className="text-center">
                <span className="text-3xl font-black text-amber-500">
                  {hoverRating !== null ? hoverRating : selectedRating}
                </span>
                <span className="text-sm text-muted-foreground"> / 10</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              {userRating && (
                <Button
                  variant="outline"
                  onClick={handleDeleteRating}
                  disabled={deleteRating.isPending}
                  className="gap-2 border-destructive/20 text-destructive hover:bg-destructive/10"
                >
                  {deleteRating.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                  <span>Clear</span>
                </Button>
              )}
              <Button
                onClick={() => handleSubmitRating(selectedRating)}
                disabled={rateMovie.isPending}
                className="flex-1 gap-2 font-bold"
              >
                {rateMovie.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Check className="size-4" />
                )}
                <span>Save Rating</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
