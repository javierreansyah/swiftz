"use client";
import type { DetailStaticContent } from "@/features/media/detail-static-content";
import { Button } from "@/components/ui/button";
import {
  Star,
  TrendingUp,
  Share2,
  Check,
  Bookmark,
  Loader2,
  Heart,
} from "lucide-react";
import type { MovieDetailView } from "@/features/movies/detail/payload";
import type { Cast, Crew } from "@/lib/tmdb/types/common";
import { WatchlistDropdown } from "@/features/auth/components/watchlist-dropdown";
import { AuthPromptModal } from "@/features/auth/components/auth-prompt-modal";
import { formatNumberShort } from "@/lib/format";
import { useMediaActions } from "@/features/auth/hooks/use-media-actions";
import { SaveFeedback } from "@/features/media/components/save-feedback";
import { cn } from "@/lib/utils";

export interface MovieHeroActionsProps {
  staticContent: DetailStaticContent;
  movie: MovieDetailView;
  cast: Cast[];
  crew: Crew[];
  reviewCount: number;
  isWatchlist: boolean;
  isFavorite: boolean;
  userRating: number | null;
  onOpenModal: (modal: "reviews" | "videos" | "photos" | "cast") => void;
  onOpenPerson: (personId: number) => void;
  onOpenRating: () => void;
  onShareClick: () => void;
  copiedShare?: boolean;
}

export function MovieHeroActions({
  staticContent,
  movie,
  cast,
  crew,
  reviewCount,
  isWatchlist,
  isFavorite,
  userRating,
  onOpenModal,
  onOpenPerson,
  onOpenRating,
  onShareClick,
  copiedShare = false,
}: MovieHeroActionsProps) {
  const {
    toggleWatchlist,
    toggleFavorite,
    handleWatchlistClick,
    handleFavoriteClick,
    handleRateClick,
    showAuthModal,
    setShowAuthModal,
    login,
  } = useMediaActions({
    type: "movie",
    mediaId: movie.id,
    isFavorite,
    isWatchlist,
    onRate: onOpenRating,
  });

  const directors = crew
    .filter((c) => c.job === "Director")
    .map((member) => ({ id: member.id, name: member.name }));
  const writers = crew
    .filter((c) => ["Screenplay", "Writer", "Story"].includes(c.job))
    .slice(0, 3)
    .map((member) => ({ id: member.id, name: member.name }));
  const stars = cast
    .slice(0, 4)
    .map((member) => ({ id: member.id, name: member.name }));
  const tmdbScore = Math.round(movie.vote_average * 10);

  return (
    <>
      <div className="space-y-6 pt-2">
        {/* MOBILE ONLY: Swipable Buttons Carousel */}
        <div className="flex snap-x scrollbar-none items-center gap-2 overflow-x-auto scroll-smooth pb-1 lg:hidden">
          {/* Watchlist Button */}
          <Button
            size="sm"
            variant={isWatchlist ? "secondary" : "default"}
            onClick={handleWatchlistClick}
            disabled={toggleWatchlist.isPending}
            className="shrink-0 snap-start"
          >
            {toggleWatchlist.isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : isWatchlist ? (
              <Check className="size-3.5" />
            ) : (
              <Bookmark className="size-3.5 fill-current" />
            )}
            <span>{isWatchlist ? "In Watchlist" : "Add to Watchlist"}</span>
          </Button>

          {/* Favorite Button */}
          <Button
            size="sm"
            variant={isFavorite ? "default" : "secondary"}
            onClick={handleFavoriteClick}
            disabled={toggleFavorite.isPending}
            className="shrink-0 snap-start"
          >
            <Heart
              className={cn(
                "size-3.5",
                isFavorite
                  ? "fill-destructive text-destructive"
                  : "text-muted-foreground",
              )}
            />
            <span>{isFavorite ? "Favorited" : "Favorite"}</span>
          </Button>

          {/* Rate Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRateClick}
            className="shrink-0 snap-start"
          >
            <Star
              className={cn(
                "size-3.5",
                userRating
                  ? "fill-primary text-primary"
                  : "text-muted-foreground",
              )}
            />
            <span className="font-semibold">
              {userRating ? `${userRating}/10` : "Rate"}
            </span>
          </Button>

          {/* Stars Score Badge */}
          <div className="flex h-8 shrink-0 snap-start items-center gap-1.5 rounded-3xl bg-secondary px-3 text-secondary-foreground">
            <Star className="size-3.5 fill-primary text-primary" />
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-foreground">
                {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">/10</span>
              <span className="text-xs text-muted-foreground">
                ({formatNumberShort(movie.vote_count)})
              </span>
            </div>
          </div>

          {/* Trending Badge */}
          <div className="flex h-8 shrink-0 snap-start items-center gap-1.5 rounded-3xl bg-secondary px-3 text-xs font-semibold text-secondary-foreground">
            <TrendingUp className="size-3.5 text-primary" />
            <span>{Math.round(movie.popularity)}</span>
          </div>

          {/* Share Button */}
          <Button
            size="sm"
            variant="secondary"
            onClick={onShareClick}
            className="shrink-0 snap-start"
            aria-label="Share movie"
          >
            {copiedShare ? (
              <Check className="size-3.5 text-success" />
            ) : (
              <Share2 className="size-3.5 text-muted-foreground" />
            )}
            <span>{copiedShare ? "Copied" : "Share"}</span>
          </Button>
        </div>

        {staticContent.mobileOverview}
        {/* INFO SECTION: Metadata on Left, Watchlist on Right in desktop flex row; stacked on mobile */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* METADATA GRID */}
          <div className="min-w-0 flex-1 space-y-4">
            {staticContent.desktopOverview}
            {/* Mobile divider before remaining info */}
            <div className="h-px bg-border/50 lg:hidden" />

            {/* Director */}
            {directors.length > 0 && (
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-12 sm:gap-4">
                <span className="text-sm font-bold text-muted-foreground sm:col-span-3 lg:col-span-2">
                  {directors.length > 1 ? "Directors" : "Director"}
                </span>
                <div className="flex flex-wrap items-center gap-2 text-sm sm:col-span-9 sm:text-base lg:col-span-10">
                  {directors.map((director, i) => (
                    <span key={`${director.id}-${i}`}>
                      <button
                        type="button"
                        onClick={() => onOpenPerson(director.id)}
                        className="cursor-pointer font-semibold text-primary hover:underline"
                      >
                        {director.name}
                      </button>
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
                  {writers.map((writer, i) => (
                    <span key={`${writer.id}-${i}`}>
                      <button
                        type="button"
                        onClick={() => onOpenPerson(writer.id)}
                        className="cursor-pointer font-semibold text-primary hover:underline"
                      >
                        {writer.name}
                      </button>
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
                  {stars.map((star, i) => (
                    <span key={star.id}>
                      <button
                        type="button"
                        onClick={() => onOpenPerson(star.id)}
                        className="cursor-pointer font-semibold text-primary hover:underline"
                      >
                        {star.name}
                      </button>
                      {i < stars.length - 1 && (
                        <span className="text-muted-foreground"> · </span>
                      )}
                    </span>
                  ))}
                  <Button
                    variant="link"
                    size="inline"
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

            {staticContent.facts}
            {/* Reviews and TMDB score */}
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-12 sm:gap-4">
              <span className="text-sm font-bold text-muted-foreground sm:col-span-3 lg:col-span-2">
                Reviews
              </span>
              <div className="flex flex-wrap items-center gap-3 text-sm sm:col-span-9 sm:text-base lg:col-span-10">
                <Button
                  variant="link"
                  size="inline"
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
                      tmdbScore >= 70
                        ? "bg-success"
                        : tmdbScore >= 50
                          ? "bg-rating"
                          : "bg-destructive"
                    }`}
                  >
                    {tmdbScore}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    TMDB / 100
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* DESKTOP ONLY: Watchlist Button with Dropdown (Right side on desktop) */}
          <div className="hidden shrink-0 items-center justify-end self-start lg:flex">
            <WatchlistDropdown
              isWatchlist={isWatchlist}
              isFavorite={isFavorite}
              userRating={userRating}
              isPendingWatchlist={toggleWatchlist.isPending}
              mediaTypeLabel="Movie"
              onWatchlistClick={handleWatchlistClick}
              onFavoriteClick={handleFavoriteClick}
              onRateClick={handleRateClick}
              onShareClick={onShareClick}
            />
          </div>
        </div>
      </div>

      <SaveFeedback
        isError={toggleFavorite.isError || toggleWatchlist.isError}
      />

      {/* AUTH PROMPT MODAL */}
      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title={movie.title}
        onLogin={login}
      />
    </>
  );
}
