"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
}

export function MovieQuickRail({
  movieId,
  movieTitle,
  onOpenModal,
  onOpenRating,
}: MovieQuickRailProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileOpen(false);
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
        // Fallback
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

  const sections = [
    { id: "section-overview", label: "Overview", icon: Film },
    { id: "section-cast", label: "Cast", icon: Users, modal: "cast" as const },
    { id: "section-videos", label: "Videos", icon: Video, modal: "videos" as const },
    { id: "section-photos", label: "Photos", icon: ImageIcon, modal: "photos" as const },
    { id: "section-reviews", label: "Reviews", icon: MessageSquare, modal: "reviews" as const },
    { id: "section-recommendations", label: "Related", icon: Sparkles },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR: Collapsible floating rail */}
      <aside
        className={`fixed top-28 right-4 z-30 hidden transition-all duration-300 xl:block ${
          isCollapsed ? "w-12" : "w-48"
        }`}
      >
        <div className="flex flex-col rounded-2xl border border-border/80 bg-card/85 p-2 shadow-2xl backdrop-blur-xl transition-all">
          {/* Collapse Toggle Button */}
          <div className="flex items-center justify-between px-1 pb-2 border-b border-border/50">
            {!isCollapsed && (
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Movie Rail
              </span>
            )}
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="ml-auto rounded-md hover:bg-muted"
            >
              {isCollapsed ? (
                <ChevronLeft className="size-3.5" />
              ) : (
                <ChevronRight className="size-3.5" />
              )}
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </div>

          {/* Quick Jump Navigation */}
          <nav className="space-y-1 pt-2">
            {sections.map((item) => {
              const Icon = item.icon;
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        if (item.modal) {
                          onOpenModal(item.modal);
                        } else {
                          scrollToSection(item.id);
                        }
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary ${
                        isCollapsed ? "justify-center" : "justify-start"
                      }`}
                    >
                      <Icon className="size-4 shrink-0 text-foreground/80" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </button>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="left">{item.label}</TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </nav>

          {/* Quick Actions Separator */}
          <div className="my-2 h-px bg-border/50" />

          {/* Quick Action Buttons */}
          <div className="space-y-1">
            {/* Watchlist */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleWatchlist}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs font-semibold transition-all ${
                    isWatchlist
                      ? "bg-amber-500/15 text-amber-500 font-bold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  } ${isCollapsed ? "justify-center" : "justify-start"}`}
                >
                  <Bookmark
                    className={`size-4 shrink-0 ${
                      isWatchlist ? "fill-current text-amber-500" : ""
                    }`}
                  />
                  {!isCollapsed && (
                    <span>{isWatchlist ? "Saved" : "Watchlist"}</span>
                  )}
                </button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="left">
                  {isWatchlist ? "In Watchlist" : "Add to Watchlist"}
                </TooltipContent>
              )}
            </Tooltip>

            {/* Favorite */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleFavorite}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs font-semibold transition-all ${
                    isFavorite
                      ? "bg-red-500/15 text-red-500 font-bold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  } ${isCollapsed ? "justify-center" : "justify-start"}`}
                >
                  <Heart
                    className={`size-4 shrink-0 ${
                      isFavorite ? "fill-current text-red-500" : ""
                    }`}
                  />
                  {!isCollapsed && (
                    <span>{isFavorite ? "Favorited" : "Favorite"}</span>
                  )}
                </button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="left">
                  {isFavorite ? "Favorited" : "Add to Favorites"}
                </TooltipContent>
              )}
            </Tooltip>

            {/* Rate */}
            {onOpenRating && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onOpenRating}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-muted-foreground transition-all hover:bg-muted hover:text-amber-500 ${
                      isCollapsed ? "justify-center" : "justify-start"
                    }`}
                  >
                    <Star className="size-4 shrink-0" />
                    {!isCollapsed && <span>Rate Movie</span>}
                  </button>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="left">Rate Movie</TooltipContent>
                )}
              </Tooltip>
            )}

            {/* Share */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleShare}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-muted-foreground transition-all hover:bg-muted hover:text-primary ${
                    isCollapsed ? "justify-center" : "justify-start"
                  }`}
                >
                  {copied ? (
                    <Check className="size-4 shrink-0 text-emerald-500" />
                  ) : (
                    <Share2 className="size-4 shrink-0" />
                  )}
                  {!isCollapsed && (
                    <span>{copied ? "Copied!" : "Share"}</span>
                  )}
                </button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="left">
                  {copied ? "Copied to clipboard!" : "Share movie"}
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </div>
      </aside>

      {/* MOBILE FLOATING ACTION PILL */}
      <div className="fixed right-4 bottom-6 z-30 xl:hidden">
        <Button
          size="sm"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-full bg-primary/95 px-4 shadow-xl backdrop-blur-md"
        >
          <Film className="mr-1.5 size-4" />
          <span>Jump to</span>
        </Button>

        {mobileOpen && (
          <div className="absolute right-0 bottom-12 mb-2 w-48 rounded-2xl border border-border/80 bg-card/95 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95">
            <div className="space-y-1">
              {sections.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.modal) {
                        onOpenModal(item.modal);
                        setMobileOpen(false);
                      } else {
                        scrollToSection(item.id);
                      }
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  >
                    <Icon className="size-4 text-foreground/80" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Backward-compatible alias
export const MovieSidebar = MovieQuickRail;

export default MovieQuickRail;
