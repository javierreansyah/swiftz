"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Film, Heart, Bookmark, Star, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserNavDropdown() {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();

  if (isLoading) {
    return <div className="size-9 animate-pulse rounded-xl bg-muted" />;
  }

  if (!isAuthenticated || !user) {
    return (
      <Button
        variant="outline"
        size="default"
        onClick={() => login()}
      >
        <LogIn className="size-4" />
        <span>Sign In</span>
      </Button>
    );
  }

  const avatarUrl = user.avatar?.tmdb?.avatar_path
    ? `https://image.tmdb.org/t/p/w185${user.avatar.tmdb.avatar_path}`
    : user.avatar?.gravatar?.hash
    ? `https://www.gravatar.com/avatar/${user.avatar.gravatar.hash}?d=identicon`
    : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden"
          aria-label="User menu"
        >
          {avatarUrl ? (
            <div className="relative size-full">
              <Image
                src={avatarUrl}
                alt={user.username || "User"}
                fill
                sizes="36px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex size-full items-center justify-center bg-primary/20 text-xs font-bold text-primary">
              {(user.username || "U").charAt(0).toUpperCase()}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold">{user.name || user.username}</p>
            <p className="text-xs font-normal text-muted-foreground">
              @{user.username}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/library" className="flex cursor-pointer items-center gap-2">
            <Film className="size-4" />
            <span>My Library</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/library?tab=favorites"
            className="flex cursor-pointer items-center gap-2"
          >
            <Heart className="size-4 text-destructive" />
            <span>Favorites</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/library?tab=watchlist"
            className="flex cursor-pointer items-center gap-2"
          >
            <Bookmark className="size-4 text-info" />
            <span>Watchlist</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/library?tab=rated"
            className="flex cursor-pointer items-center gap-2"
          >
            <Star className="size-4 text-primary" />
            <span>Rated Movies</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => logout()}
          className="flex cursor-pointer items-center"
        >
          <LogOut className="size-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserNavDropdown;
