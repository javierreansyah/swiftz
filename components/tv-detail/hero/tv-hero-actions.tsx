"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { TVShowDetailsData, Cast } from "@/types";
import { useAuth } from "@/components/providers/auth-provider";
import {
  useToggleTVFavoriteMutation,
  useToggleTVWatchlistMutation,
} from "@/hooks/use-tmdb";
import { WatchlistDropdown } from "@/components/common/watchlist-dropdown";
import { AuthPromptModal } from "@/components/common/auth-prompt-modal";

function formatNumberShort(num: number): string {
  if (!num) return "0";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toString();
}

export interface TVHeroActionsProps {
  show: TVShowDetailsData;
  cast: Cast[];
  reviewCount: number;
  isWatchlist: boolean;
  isFavorite: boolean;
  userRating: number | null;
  onOpenModal: (modal: "reviews" | "videos" | "photos" | "cast") => void;
  onOpenRating: () => void;
  onShareClick: () => void;
}

export function TVHeroActions({
  show,
  cast,
  reviewCount,
  isWatchlist,
  isFavorite,
  userRating,
  onOpenModal,
  onOpenRating,
  onShareClick,
}: TVHeroActionsProps) {
  const { user, sessionId, isAuthenticated, login, loginDemo } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const toggleWatchlist = useToggleTVWatchlistMutation();
  const toggleFavorite = useToggleTVFavoriteMutation();

  const handleWatchlistClick = () => {
    if (!isAuthenticated || !user || !sessionId) {
      setShowAuthModal(true);
      return;
    }
    toggleWatchlist.mutate({
      accountId: user.id,
      sessionId,
      tvId: show.id,
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
      tvId: show.id,
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

  const creators = show.created_by?.map((c) => c.name) || [];
  const networks = show.networks?.map((n) => n.name) || [];
  const stars = cast.slice(0, 4).map((c) => c.name);
  const metascore = Math.round(show.vote_average * 10);

  return (
    <>
      {/* INFO SECTION: Metadata on Left, Watchlist on Right */}
      <div className="flex flex-col gap-6 pt-2 lg:flex-row lg:items-start lg:justify-between">
        {/* METADATA GRID */}
        <div className="order-2 min-w-0 flex-1 space-y-4 lg:order-1">
          {/* Genres */}
          {show.genres && show.genres.length > 0 && (
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-12 sm:gap-4">
              <span className="text-sm font-bold text-muted-foreground sm:col-span-3 lg:col-span-2">
                {show.genres.length > 1 ? "Genres" : "Genre"}
              </span>
              <div className="flex flex-wrap items-center gap-2 sm:col-span-9 lg:col-span-10">
                {show.genres.map((genre) => (
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
          {show.overview && (
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-12 sm:gap-4">
              <span className="text-sm font-bold text-muted-foreground sm:col-span-3 lg:col-span-2">
                Plot
              </span>
              <p className="text-sm leading-relaxed text-foreground sm:col-span-9 sm:text-base lg:col-span-10">
                {show.overview}
              </p>
            </div>
          )}

          <div className="h-px bg-border/50" />

          {/* Creators / Showrunners */}
          {creators.length > 0 && (
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-12 sm:gap-4">
              <span className="text-sm font-bold text-muted-foreground sm:col-span-3 lg:col-span-2">
                {creators.length > 1 ? "Creators" : "Creator"}
              </span>
              <div className="flex flex-wrap items-center gap-2 text-sm sm:col-span-9 sm:text-base lg:col-span-10">
                {creators.map((name, i) => (
                  <span key={i} className="font-semibold text-primary">
                    {name}
                    {i < creators.length - 1 && (
                      <span className="text-muted-foreground"> · </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Networks */}
          {networks.length > 0 && (
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-12 sm:gap-4">
              <span className="text-sm font-bold text-muted-foreground sm:col-span-3 lg:col-span-2">
                {networks.length > 1 ? "Networks" : "Network"}
              </span>
              <div className="flex flex-wrap items-center gap-2 text-sm sm:col-span-9 sm:text-base lg:col-span-10">
                {networks.map((name, i) => (
                  <span key={i} className="font-semibold text-foreground">
                    {name}
                    {i < networks.length - 1 && (
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
                <Button variant="link" size="inline"
                  type="button"
                  onClick={() => onOpenModal("cast")}
                  className="ml-2"
                >
                  View full cast
                </Button>
              </div>
            </div>
          )}

          <div className="h-px bg-border/50" />

          {/* Status & Type */}
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-12 sm:gap-4">
            <span className="text-sm font-bold text-muted-foreground sm:col-span-3 lg:col-span-2">
              Status
            </span>
            <div className="flex flex-wrap items-center gap-4 text-sm sm:col-span-9 sm:text-base lg:col-span-10">
              {show.status && (
                <span>
                  <strong className="text-muted-foreground">Status:</strong>{" "}
                  <span className="font-medium text-foreground">
                    {show.status}
                  </span>
                </span>
              )}
              {show.type && (
                <span>
                  <strong className="text-muted-foreground">Type:</strong>{" "}
                  <span className="font-medium text-foreground">
                    {show.type}
                  </span>
                </span>
              )}
            </div>
          </div>

          {/* Reviews Row with Metascore */}
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-12 sm:gap-4">
            <span className="text-sm font-bold text-muted-foreground sm:col-span-3 lg:col-span-2">
              Reviews
            </span>
            <div className="flex flex-wrap items-center gap-3 text-sm sm:col-span-9 sm:text-base lg:col-span-10">
              <Button variant="link" size="inline"
                type="button"
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
                      ? "bg-primary"
                      : "bg-destructive"
                  }`}
                >
                  {metascore}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  Score
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
            voteCountFormatted={formatNumberShort(show.vote_count * 2)}
            mediaTypeLabel="Series"
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
        title={show.name}
        onLogin={login}
        onLoginDemo={loginDemo}
      />
    </>
  );
}

export default TVHeroActions;
