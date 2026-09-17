"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  Film,
  Users,
  Video,
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
  Bookmark,
  Heart,
  Star,
  Share2,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import {
  useMovieAccountStatesQuery,
  useToggleFavoriteMutation,
  useToggleWatchlistMutation,
} from "@/hooks/use-tmdb";

export interface MovieQuickRailProps {
  movieId: number;
  movieTitle: string;
  onOpenModal: (modal: "reviews" | "videos" | "photos" | "cast") => void;
  onOpenRating?: () => void;
  mode?: "all" | "desktop" | "mobile";
  className?: string;
}

export function MovieQuickRail({
  movieId,
  movieTitle,
  onOpenModal,
  onOpenRating,
  mode = "all",
  className,
}: MovieQuickRailProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const { user, sessionId, isAuthenticated, login } = useAuth();
  const { data: accountStates } = useMovieAccountStatesQuery(
    movieId,
    sessionId
  );
  const toggleFavorite = useToggleFavoriteMutation();
  const toggleWatchlist = useToggleWatchlistMutation();

  const isFavorite = Boolean(accountStates?.favorite);
  const isWatchlist = Boolean(accountStates?.watchlist);
  const userRating =
    typeof accountStates?.rated === "object" && accountStates?.rated !== null
      ? accountStates.rated.value
      : accountStates?.rated === true
      ? 10
      : null;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileExpanded(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: movieTitle,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWatchlist = () => {
    if (!isAuthenticated || !user || !sessionId) {
      login();
      return;
    }
    toggleWatchlist.mutate({
      accountId: user.id,
      sessionId,
      movieId,
      watchlist: !isWatchlist,
    });
  };

  const handleFavorite = () => {
    if (!isAuthenticated || !user || !sessionId) {
      login();
      return;
    }
    toggleFavorite.mutate({
      accountId: user.id,
      sessionId,
      movieId,
      favorite: !isFavorite,
    });
  };

  const handleRateClick = () => {
    if (onOpenRating) {
      onOpenRating();
    } else {
      onOpenModal("reviews");
    }
  };

  const sections = [
    { id: "section-overview", label: "Overview", icon: Film },
    { id: "section-cast", label: "Cast", icon: Users, modal: "cast" as const },
    { id: "section-videos", label: "Videos", icon: Video, modal: "videos" as const },
    { id: "section-photos", label: "Photos", icon: ImageIcon, modal: "photos" as const },
    { id: "section-reviews", label: "Reviews", icon: MessageSquare, modal: "reviews" as const },
    { id: "section-recommendations", label: "Related", icon: Sparkles },
  ];

  const renderDesktopSidebar = () => (
    <div
      className={cn(
        "flex flex-col space-y-5 rounded-2xl border border-border/70 bg-card/80 p-5 shadow-xl backdrop-blur-xl transition-all",
        className
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Film className="size-4 text-primary" />
          <h3 className="font-heading text-sm font-bold tracking-tight text-foreground">
            On This Page
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-muted-foreground">
          Quick Jump
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1">
        {sections.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.modal) {
                  onOpenModal(item.modal);
                } else {
                  scrollToSection(item.id);
                }
              }}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95"
            >
              <div className="flex items-center gap-2.5">
                <Icon className="size-4 text-muted-foreground/80" />
                <span>{item.label}</span>
              </div>
              {item.modal && (
                <span className="text-[10px] text-muted-foreground/60">
                  Open
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Actions Header */}
      <div className="space-y-2.5 border-t border-border/60 pt-1">
        <p className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
          Actions
        </p>

        <div className="grid grid-cols-1 gap-2">
          {/* Watchlist button */}
          <Button
            size="sm"
            variant={isWatchlist ? "default" : "outline"}
            onClick={handleWatchlist}
            disabled={toggleWatchlist.isPending}
            className={cn(
              "h-9 w-full justify-start gap-2.5 rounded-xl text-xs font-semibold",
              isWatchlist
                ? "bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700"
                : "border-border/70 hover:bg-muted"
            )}
          >
            {toggleWatchlist.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Bookmark className={cn("size-4", isWatchlist && "fill-current")} />
            )}
            <span>{isWatchlist ? "In Watchlist" : "Add to Watchlist"}</span>
          </Button>

          {/* Favorite button */}
          <Button
            size="sm"
            variant={isFavorite ? "default" : "outline"}
            onClick={handleFavorite}
            disabled={toggleFavorite.isPending}
            className={cn(
              "h-9 w-full justify-start gap-2.5 rounded-xl text-xs font-semibold",
              isFavorite
                ? "bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                : "border-border/70 hover:bg-muted"
            )}
          >
            {toggleFavorite.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Heart className={cn("size-4", isFavorite && "fill-current text-red-500")} />
            )}
            <span>{isFavorite ? "In Favorites" : "Add to Favorites"}</span>
          </Button>

          {/* Rate button */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleRateClick}
            className="h-9 w-full justify-start gap-2.5 rounded-xl border-border/70 text-xs font-semibold hover:bg-muted"
          >
            <Star
              className={cn(
                "size-4",
                userRating ? "fill-amber-400 text-amber-400" : "text-amber-500"
              )}
            />
            <span>
              {userRating ? `Your Rating: ${userRating}/10` : "Rate This Movie"}
            </span>
          </Button>

          {/* Share button */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleShare}
            className="h-9 w-full justify-start gap-2.5 rounded-xl border-border/70 text-xs font-semibold hover:bg-muted"
          >
            {copied ? (
              <Check className="size-4 text-emerald-500" />
            ) : (
              <Share2 className="size-4" />
            )}
            <span>{copied ? "Copied Link!" : "Share Movie"}</span>
          </Button>
        </div>
      </div>
    </div>
  );

  const renderMobileStickyBar = () => (
    <div
      className={cn(
        "sticky top-16 z-30 w-full border-y border-border/70 bg-background/90 shadow-sm backdrop-blur-xl lg:hidden",
        className
      )}
    >
      {/* Top Bar: Horizontal pills + expand toggle */}
      <div className="flex h-12 items-center justify-between gap-2 px-3 sm:px-4">
        {/* Horizontal scrollable pills */}
        <div className="flex flex-1 scrollbar-none items-center gap-1.5 overflow-x-auto py-1">
          {sections.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.modal) {
                    onOpenModal(item.modal);
                  } else {
                    scrollToSection(item.id);
                  }
                }}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-border/70 bg-muted/60 px-3 py-1 text-xs font-semibold text-foreground/80 transition-all hover:bg-muted hover:text-foreground active:scale-95"
              >
                <Icon className="size-3.5 text-muted-foreground" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Expand/Collapse Actions Toggle */}
        <button
          onClick={() => setMobileExpanded(!mobileExpanded)}
          className={cn(
            "flex shrink-0 items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs font-bold transition-all",
            mobileExpanded
              ? "border-primary bg-primary text-primary-foreground"
              : "bg-card text-foreground hover:bg-muted"
          )}
          aria-expanded={mobileExpanded}
          aria-label="Toggle quick actions"
        >
          <span>Actions</span>
          <ChevronDown
            className={cn(
              "size-3.5 transition-transform duration-200",
              mobileExpanded && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* Expandable Actions Drawer */}
      {mobileExpanded && (
        <div className="animate-in border-t border-border/60 bg-card/95 px-4 py-3 backdrop-blur-2xl duration-200 slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {/* Watchlist */}
            <Button
              size="sm"
              variant={isWatchlist ? "default" : "outline"}
              onClick={() => {
                handleWatchlist();
              }}
              disabled={toggleWatchlist.isPending}
              className={cn(
                "gap-1.5 rounded-xl text-xs font-semibold",
                isWatchlist
                  ? "bg-amber-600 text-white hover:bg-amber-700"
                  : "border-border/70"
              )}
            >
              {toggleWatchlist.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Bookmark
                  className={cn("size-3.5", isWatchlist && "fill-current")}
                />
              )}
              <span>{isWatchlist ? "In Watchlist" : "Watchlist"}</span>
            </Button>

            {/* Favorite */}
            <Button
              size="sm"
              variant={isFavorite ? "default" : "outline"}
              onClick={() => {
                handleFavorite();
              }}
              disabled={toggleFavorite.isPending}
              className={cn(
                "gap-1.5 rounded-xl text-xs font-semibold",
                isFavorite
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "border-border/70"
              )}
            >
              {toggleFavorite.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Heart
                  className={cn(
                    "size-3.5",
                    isFavorite && "fill-current text-red-500"
                  )}
                />
              )}
              <span>{isFavorite ? "Favorited" : "Favorite"}</span>
            </Button>

            {/* Rate Movie */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setMobileExpanded(false);
                handleRateClick();
              }}
              className="gap-1.5 rounded-xl border-border/70 text-xs font-semibold"
            >
              <Star
                className={cn(
                  "size-3.5",
                  userRating ? "fill-amber-400 text-amber-400" : "text-amber-500"
                )}
              />
              <span>{userRating ? `${userRating}/10` : "Rate"}</span>
            </Button>

            {/* Share */}
            <Button
              size="sm"
              variant="outline"
              onClick={handleShare}
              className="gap-1.5 rounded-xl border-border/70 text-xs font-semibold"
            >
              {copied ? (
                <Check className="size-3.5 text-emerald-500" />
              ) : (
                <Share2 className="size-3.5" />
              )}
              <span>{copied ? "Copied!" : "Share"}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  if (mode === "desktop") {
    return renderDesktopSidebar();
  }

  if (mode === "mobile") {
    return renderMobileStickyBar();
  }

  return (
    <>
      <div className="lg:hidden">{renderMobileStickyBar()}</div>
      <div className="hidden lg:block">{renderDesktopSidebar()}</div>
    </>
  );
}

// Backward-compatible alias
export const MovieSidebar = MovieQuickRail;

export default MovieQuickRail;
