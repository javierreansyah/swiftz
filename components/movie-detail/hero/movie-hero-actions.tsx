"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { MovieDetailsData, Cast, Crew } from "@/types";
import { useAuth } from "@/components/providers/auth-provider";
import {
  useToggleFavoriteMutation,
  useToggleWatchlistMutation,
} from "@/hooks/use-tmdb";
import { WatchlistDropdown } from "@/components/common/watchlist-dropdown";
import { AuthPromptModal } from "@/components/common/auth-prompt-modal";

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
      {/* INFO SECTION: Metadata on Left, Watchlist on Right in desktop flex row; stacked on mobile */}
      <div className="flex flex-col gap-6 pt-2 lg:flex-row lg:items-start lg:justify-between">
        {/* METADATA GRID */}
        <div className="order-2 min-w-0 flex-1 space-y-4 lg:order-1">
          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-12 sm:gap-4">
              <span className="text-sm font-bold text-muted-foreground sm:col-span-3 lg:col-span-2">
                {movie.genres.length > 1 ? "Genres" : "Genre"}
              </span>
              <div className="flex flex-wrap items-center gap-2 sm:col-span-9 lg:col-span-10">
                {movie.genres.map((genre) => (
                  <Badge
                    key={genre.id}
                    variant="secondary"
                  >
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="h-px bg-border/50" />

          {/* Plot */}
          {movie.overview && (
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-12 sm:gap-4">
              <span className="text-sm font-bold text-muted-foreground sm:col-span-3 lg:col-span-2">
                Plot
              </span>
              <p className="text-sm leading-relaxed text-foreground sm:col-span-9 sm:text-base lg:col-span-10">
                {movie.overview}
              </p>
            </div>
          )}

          <div className="h-px bg-border/50" />

          {/* Director */}
          {directors.length > 0 && (
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-12 sm:gap-4">
              <span className="text-sm font-bold text-muted-foreground sm:col-span-3 lg:col-span-2">
                {directors.length > 1 ? "Directors" : "Director"}
              </span>
              <div className="flex flex-wrap items-center gap-2 text-sm sm:col-span-9 sm:text-base lg:col-span-10">
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
              <span className="text-sm font-bold text-muted-foreground sm:col-span-3 lg:col-span-2">
                {writers.length > 1 ? "Writers" : "Writer"}
              </span>
              <div className="flex flex-wrap items-center gap-2 text-sm sm:col-span-9 sm:text-base lg:col-span-10">
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
              <span className="text-sm font-bold text-muted-foreground sm:col-span-3 lg:col-span-2">
                Stars
              </span>
              <div className="flex flex-wrap items-center gap-2 text-sm sm:col-span-9 sm:text-base lg:col-span-10">
                {stars.map((name, i) => (
                  <span key={i} className="font-semibold text-primary">
                    {name}
                    {i < stars.length - 1 && (
                      <span className="text-muted-foreground"> · </span>
                    )}
                  </span>
                ))}
                <Button variant="link" size="inline" type="button"
                  onClick={() => onOpenModal("cast")}
                  className="ml-2"
                >
                  View full cast
                </Button>
              </div>
            </div>
          )}

          <div className="h-px bg-border/50" />

          {/* Box Office / Details */}
          {(movie.budget > 0 || movie.revenue > 0) && (
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-12 sm:gap-4">
              <span className="text-sm font-bold text-muted-foreground sm:col-span-3 lg:col-span-2">
                Box Office
              </span>
              <div className="flex flex-wrap items-center gap-4 text-sm sm:col-span-9 sm:text-base lg:col-span-10">
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
            <span className="text-sm font-bold text-muted-foreground sm:col-span-3 lg:col-span-2">
              Reviews
            </span>
            <div className="flex flex-wrap items-center gap-3 text-sm sm:col-span-9 sm:text-base lg:col-span-10">
              <Button variant="link" size="inline" type="button"
                onClick={() => onOpenModal("reviews")}
                className="group"
              >
                <span>
                  {reviewCount > 0
                    ? `${reviewCount} User Reviews`
                    : "User Reviews"}
                </span>
              </Button>

              <span className="text-muted-foreground">·</span>

              <div className="flex items-center gap-1.5">
                <span
                  className={`flex size-6 items-center justify-center rounded-xl text-xs font-bold text-media-foreground ${
                    metascore >= 70
                      ? "bg-success"
                      : metascore >= 50
                      ? "bg-rating"
                      : "bg-destructive"
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

        {/* Watchlist Button with Dropdown (Right side on desktop, top right on mobile) */}
        <div className="order-1 flex shrink-0 items-center justify-end self-start lg:order-2">
          <WatchlistDropdown
            isWatchlist={isWatchlist}
            isFavorite={isFavorite}
            userRating={userRating}
            isPendingWatchlist={toggleWatchlist.isPending}
            voteCountFormatted={formatNumberShort(movie.vote_count * 3)}
            mediaTypeLabel="Movie"
            onWatchlistClick={handleWatchlistClick}
            onFavoriteClick={handleFavoriteClick}
            onRateClick={handleRateClick}
            onShareClick={onShareClick}
          />
        </div>
      </div>

      {/* AUTH PROMPT MODAL */}
      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title={movie.title}
        onLogin={login}
        onLoginDemo={loginDemo}
      />
    </>
  );
}

export default MovieHeroActions;
