import {
  Film,
  Sparkles,
  LogIn,
  ExternalLink,
  Heart,
  Bookmark,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LibraryTab } from "@/features/library/components/library-tabs";
export function LibraryUnauthenticated({
  onLogin,
  onLoginDemo,
}: {
  onLogin: () => void;
  onLoginDemo: () => void;
}) {
  return (
    <div className="container min-h-screen pt-28 pb-16">
      <div className="mx-auto max-w-3xl space-y-10">
        {/* Welcome Card */}
        <div className="relative space-y-6 overflow-hidden rounded-xl border bg-linear-to-b from-card/90 to-card/50 p-8 text-center shadow-xl sm:p-12">
          <div className="mx-auto flex size-16 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-inner sm:size-20">
            <Film className="size-8 sm:size-10" />
          </div>

          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />
              TMDB Cloud Sync
            </span>
            <h1 className="heading-hero">Your Personal Cinema Library</h1>
            <p className="mx-auto max-w-xl text-sm text-muted-foreground sm:text-base">
              Sign in with your TMDB account to access your personal Favorites,
              curated Watchlist, and film Ratings anytime, on any device.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Button size="lg" onClick={onLogin} className="w-full sm:w-auto">
              <LogIn className="size-5" />
              <span>Connect with TMDB</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onLoginDemo}
              className="w-full sm:w-auto"
            >
              <Sparkles className="size-4 text-primary" />
              <span>Try Demo Account</span>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="w-full sm:w-auto"
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
          <div className="space-y-3 rounded-3xl border bg-card/40 p-6">
            <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <Heart className="size-5" />
            </div>
            <h3 className="heading-card">Favorites</h3>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Bookmark the films you love most and quickly revisit them anytime.
            </p>
          </div>

          <div className="space-y-3 rounded-3xl border bg-card/40 p-6">
            <div className="flex size-10 items-center justify-center rounded-xl bg-info/10 text-info">
              <Bookmark className="size-5" />
            </div>
            <h3 className="heading-card">Watchlist</h3>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Build your queue of upcoming releases and must-watch movies.
            </p>
          </div>

          <div className="space-y-3 rounded-3xl border bg-card/40 p-6">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Star className="size-5" />
            </div>
            <h3 className="heading-card">1-10 Ratings</h3>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Rate films you have seen and maintain a personal record of your
              scores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LibraryEmptyState({ activeTab }: { activeTab: LibraryTab }) {
  return (
    <div className="space-y-2 py-16 text-center">
      <h3 className="heading-card text-foreground">
        {activeTab === "favorites" && "No favorite movies yet"}
        {activeTab === "watchlist" && "Your watchlist is empty"}
        {activeTab === "rated" && "No rated movies yet"}
      </h3>
      <p className="mx-auto max-w-md text-sm text-muted-foreground">
        {activeTab === "favorites" &&
          "Browse movies on Swiftz and click the heart icon to save films you love to your personal library."}
        {activeTab === "watchlist" &&
          "Add movies you want to watch soon by clicking the watchlist button on any movie details page."}
        {activeTab === "rated" &&
          "Score films from 1 to 10 stars to keep a record of everything you have watched."}
      </p>
    </div>
  );
}
