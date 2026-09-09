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
              ? "bg-red-600 hover:bg-red-700 text-white border-red-600"
              : "hover:text-red-500 hover:border-red-500/50"
          }`}
        >
          <Heart
            className={`h-4 w-4 ${
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
              ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
              : "hover:text-blue-500 hover:border-blue-500/50"
          }`}
        >
          <Bookmark
            className={`h-4 w-4 ${
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
              ? "bg-amber-600 hover:bg-amber-700 text-white border-amber-600"
              : "hover:text-amber-500 hover:border-amber-500/50"
          }`}
        >
          <Star
            className={`h-4 w-4 ${
              userRating ? "fill-current text-white" : ""
            }`}
          />
          <span>{userRating ? `Your Rating: ${userRating}/10` : "Rate"}</span>
        </Button>
      </div>

      {/* Auth Modal Prompt */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-card border rounded-2xl p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="h-12 w-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto">
              <LogIn className="h-6 w-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold">Sign in with TMDB</h3>
              <p className="text-sm text-muted-foreground">
                Connect your free TMDB account to save {title || "this movie"} to
                your favorites, build your watchlist, and leave ratings.
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <Button
                onClick={() => {
                  setShowAuthModal(false);
                  login();
                }}
                className="w-full gap-2 font-bold"
              >
                <LogIn className="h-4 w-4" />
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
                <Sparkles className="h-3.5 w-3.5 text-primary" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-card border rounded-2xl p-6 shadow-2xl space-y-5">
            <button
              onClick={() => setShowRatingModal(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold">Rate Movie</h3>
              <p className="text-sm text-muted-foreground truncate max-w-xs mx-auto">
                {title || "Select your score"}
              </p>
            </div>

            {/* Stars Row (1 to 10) */}
            <div className="flex flex-col items-center space-y-3 py-2">
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
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
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`h-7 w-7 transition-colors ${
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
                  className="gap-2 text-destructive border-destructive/20 hover:bg-destructive/10"
                >
                  {deleteRating.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
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
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
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
