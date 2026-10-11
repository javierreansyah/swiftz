"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "@/components/ui/image";
import { Star, TrendingUp, Share2, Check } from "lucide-react";
import type { MovieDetailsData } from "@/lib/tmdb/types/movie";
import type { Cast, Crew } from "@/lib/tmdb/types/common";
import { WatchlistDropdown } from "@/features/auth/components/watchlist-dropdown";
import { AuthPromptModal } from "@/features/auth/components/auth-prompt-modal";
import { formatNumberShort, formatCurrency } from "@/lib/format";
import { useMediaActions } from "@/features/auth/hooks/use-media-actions";
import { cn } from "@/lib/utils";

export interface MovieHeroActionsProps {
  movie: MovieDetailsData;
  posterUrl: string;
  cast: Cast[];
  crew: Crew[];
  reviewCount: number;
  isWatchlist: boolean;
  isFavorite: boolean;
  userRating: number | null;
  onOpenModal: (modal: "reviews" | "videos" | "photos" | "cast") => void;
  onOpenRating: () => void;
  onShareClick: () => void;
  copiedShare?: boolean;
}

export function MovieHeroActions({
  movie,
  posterUrl,
  cast,
  crew,
  reviewCount,
  isWatchlist,
  isFavorite,
  userRating,
  onOpenModal,
  onOpenRating,
  onShareClick,
  copiedShare = false,
}: MovieHeroActionsProps) {
  const {
    toggleWatchlist,
    handleWatchlistClick,
    handleFavoriteClick,
    handleRateClick,
    showAuthModal,
    setShowAuthModal,
    login,
    loginDemo,
  } = useMediaActions({
    type: "movie",
    mediaId: movie.id,
    isFavorite,
    isWatchlist,
    onRate: onOpenRating,
  });

  const directors = crew.filter((c) => c.job === "Director").map((c) => c.name);
  const writers = crew
    .filter((c) => ["Screenplay", "Writer", "Story"].includes(c.job))
    .slice(0, 3)
    .map((c) => c.name);
  const stars = cast.slice(0, 4).map((c) => c.name);
  const metascore = Math.round(movie.vote_average * 10);

  return (
    <>
      <div className="space-y-6 pt-2">
        {/* MOBILE ONLY: Swipable Buttons Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none lg:hidden -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth snap-x">
          {/* Watchlist with Dropdown */}
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
            className="order-0 self-auto shrink-0 snap-start"
          />

          {/* Rate Button */}
          <Button
            variant="outline"
            size="default"
            onClick={onOpenRating}
            className="shrink-0 snap-start"
          >
            <Star
              className={cn(
                "size-4",
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
          <div className="flex h-10 shrink-0 snap-start items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3.5 text-primary backdrop-blur-sm">
            <Star className="size-4 fill-primary text-primary" />
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-foreground">
                {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">/10</span>
              <span className="ml-1 text-xs text-muted-foreground">
                ({formatNumberShort(movie.vote_count)})
              </span>
            </div>
          </div>

          {/* Trending Badge */}
          <div className="flex h-10 shrink-0 snap-start items-center gap-1.5 rounded-xl border border-border/80 bg-background/60 px-3.5 text-sm font-semibold text-muted-foreground backdrop-blur-sm">
            <TrendingUp className="size-4 text-primary" />
            <span>{Math.round(movie.popularity)}</span>
          </div>

          {/* Share Button */}
          <Button
            size="icon"
            variant="outline"
            onClick={onShareClick}
            className="shrink-0 snap-start"
            aria-label="Share movie"
          >
            {copiedShare ? (
              <Check className="size-3.5 text-success" />
            ) : (
              <Share2 className="size-3.5 text-muted-foreground" />
            )}
          </Button>
        </div>

        {/* MOBILE ONLY: Poster + Genres & Plot Beside Poster */}
        <div className="flex gap-4 items-start lg:hidden">
          <div className="relative aspect-2/3 w-28 sm:w-36 shrink-0 overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
            <Image
              src={posterUrl}
              alt={movie.title}
              fill
              sizes="(max-width: 640px) 112px, 144px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1 space-y-2.5">
            {movie.genres && movie.genres.length > 0 && (
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-1.5">
                  {movie.genres.length > 1 ? "Genres" : "Genre"}
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  {movie.genres.map((genre) => (
                    <Badge key={genre.id} variant="secondary">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {movie.overview && (
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-1">
                  Plot
                </p>
                <p className="text-sm leading-relaxed text-foreground">
                  {movie.overview}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* INFO SECTION: Metadata on Left, Watchlist on Right in desktop flex row; stacked on mobile */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* METADATA GRID */}
          <div className="min-w-0 flex-1 space-y-4">
            {/* DESKTOP ONLY: Genres and Plot */}
            <div className="hidden lg:block space-y-4">
              {movie.genres && movie.genres.length > 0 && (
                <div className="grid grid-cols-12 gap-4">
                  <span className="text-sm font-bold text-muted-foreground col-span-2">
                    {movie.genres.length > 1 ? "Genres" : "Genre"}
                  </span>
                  <div className="flex flex-wrap items-center gap-2 col-span-10">
                    {movie.genres.map((genre) => (
                      <Badge key={genre.id} variant="secondary">
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="h-px bg-border/50" />

              {movie.overview && (
                <div className="grid grid-cols-12 gap-4">
                  <span className="text-sm font-bold text-muted-foreground col-span-2">
                    Plot
                  </span>
                  <p className="text-sm leading-relaxed text-foreground sm:text-base col-span-10">
                    {movie.overview}
                  </p>
                </div>
              )}

              <div className="h-px bg-border/50" />
            </div>

            {/* Mobile divider before remaining info */}
            <div className="h-px bg-border/50 lg:hidden" />

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
                      <strong className="text-muted-foreground">
                        Worldwide:
                      </strong>{" "}
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

          {/* DESKTOP ONLY: Watchlist Button with Dropdown (Right side on desktop) */}
          <div className="hidden lg:flex shrink-0 items-center justify-end self-start">
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
