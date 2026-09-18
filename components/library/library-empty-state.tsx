import React from "react";
import Link from "next/link";
import {
  Film,
  Sparkles,
  LogIn,
  ExternalLink,
  Heart,
  Bookmark,
  Star,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LibraryTab } from "./library-tabs";

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
        <div className="relative space-y-6 overflow-hidden rounded-none border bg-linear-to-b from-card/90 to-card/50 p-8 text-center shadow-xl sm:p-12">
          <div className="mx-auto flex size-16 items-center justify-center rounded-none border border-primary/20 bg-primary/10 text-primary shadow-inner sm:size-20">
            <Film className="size-8 sm:size-10" />
          </div>

          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-none border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />
              TMDB Cloud Sync
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Your Personal Cinema Library
            </h1>
            <p className="mx-auto max-w-xl text-sm text-muted-foreground sm:text-base">
              Sign in with your TMDB account to access your personal Favorites,
              curated Watchlist, and film Ratings anytime, on any device.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Button
              size="lg"
              onClick={onLogin}
              className="w-full gap-2 px-8 font-semibold shadow-lg shadow-primary/20 sm:w-auto"
            >
              <LogIn className="size-5" />
              <span>Connect with TMDB</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onLoginDemo}
              className="w-full gap-2 sm:w-auto"
            >
              <Sparkles className="size-4 text-primary" />
              <span>Try Demo Account</span>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="w-full text-muted-foreground sm:w-auto"
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
          <div className="space-y-3 rounded-none border bg-card/40 p-6">
            <div className="flex size-10 items-center justify-center rounded-none bg-red-500/10 text-red-500">
              <Heart className="size-5" />
            </div>
            <h3 className="text-base font-bold">Favorites</h3>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Bookmark the films you love most and quickly revisit them anytime.
            </p>
          </div>

          <div className="space-y-3 rounded-none border bg-card/40 p-6">
            <div className="flex size-10 items-center justify-center rounded-none bg-blue-500/10 text-blue-500">
              <Bookmark className="size-5" />
            </div>
            <h3 className="text-base font-bold">Watchlist</h3>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Build your queue of upcoming releases and must-watch movies.
            </p>
          </div>

          <div className="space-y-3 rounded-none border bg-card/40 p-6">
            <div className="flex size-10 items-center justify-center rounded-none bg-amber-500/10 text-amber-500">
              <Star className="size-5" />
            </div>
            <h3 className="text-base font-bold">1-10 Ratings</h3>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Rate films you have seen and maintain a personal record of your scores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LibraryEmptyState({ activeTab }: { activeTab: LibraryTab }) {
  return (
    <div className="space-y-5 rounded-none border border-dashed bg-card/20 p-12 text-center sm:p-16">
      <div className="mx-auto flex size-16 items-center justify-center rounded-none bg-secondary text-muted-foreground">
        {activeTab === "favorites" && <Heart className="size-8 text-red-400" />}
        {activeTab === "watchlist" && (
          <Bookmark className="size-8 text-blue-400" />
        )}
        {activeTab === "rated" && <Star className="size-8 text-amber-400" />}
      </div>

      <div className="mx-auto max-w-md space-y-2">
        <h3 className="text-xl font-bold sm:text-2xl">
          {activeTab === "favorites" && "No favorite movies yet"}
          {activeTab === "watchlist" && "Your watchlist is empty"}
          {activeTab === "rated" && "No rated movies yet"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {activeTab === "favorites" &&
            "Browse movies on Swiftz and click the heart icon to save films you love to your personal library."}
          {activeTab === "watchlist" &&
            "Add movies you want to watch soon by clicking the watchlist button on any movie details page."}
          {activeTab === "rated" &&
            "Score films from 1 to 10 stars to keep a record of everything you have watched."}
        </p>
      </div>

      <div className="pt-2">
        <Button asChild size="sm" className="gap-2">
          <Link href="/discover">
            <SlidersHorizontal className="size-4" />
            <span>Discover Movies</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
