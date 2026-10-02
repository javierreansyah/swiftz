"use client";
import React from "react";
import Image from "@/components/ui/image";
import Link from "next/link";
import { ArrowRightToLine, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { useAuth } from "@/features/auth/auth-provider";
interface MobileDrawerProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface NavigationRoute {
  route: string;
  name: string;
}

export function MobileDrawer({ isOpen, setIsOpen }: MobileDrawerProps) {
  const { user, isAuthenticated, login, logout } = useAuth();

  const navigationList: NavigationRoute[] = [
    { route: "/", name: "Home" },
    { route: "/movie", name: "Movies" },
    { route: "/tv", name: "TV Shows" },
    { route: "/person", name: "People" },
    ...(isAuthenticated ? [{ route: "/library", name: "My Library" }] : []),
  ];

  const avatarUrl = user?.avatar?.tmdb?.avatar_path
    ? `https://image.tmdb.org/t/p/w185${user.avatar.tmdb.avatar_path}`
    : user?.avatar?.gravatar?.hash
      ? `https://www.gravatar.com/avatar/${user.avatar.gravatar.hash}?d=identicon`
      : null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        surface="default"
        side="right"
        showCloseButton={false}
        className="flex w-65 flex-col justify-between sm:w-80"
      >
        <div className="space-y-6">
          <SheetHeader>
            <div className="flex h-12 items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <ArrowRightToLine className="size-5" />
                <span className="sr-only">Close menu</span>
              </Button>
              <SheetTitle>Swiftz</SheetTitle>
              <ThemeSwitcher variant="ghost" />
            </div>
          </SheetHeader>

          {/* User Profile Card */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3 rounded-xl border bg-secondary/50 p-3">
              {avatarUrl ? (
                <div className="relative size-10 flex-none overflow-clip rounded-xl">
                  <Image
                    src={avatarUrl}
                    alt={user.username || "User"}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex size-10 flex-none items-center justify-center rounded-xl bg-primary/20 text-sm font-bold text-primary">
                  {(user.username || "U").charAt(0).toUpperCase()}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="truncate text-sm font-semibold">
                  {user.name || user.username}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  @{user.username}
                </p>
              </div>
            </div>
          ) : null}

          <nav>
            <ul className="space-y-2">
              {navigationList.map((route, index) => (
                <li key={index}>
                  <Button
                    asChild
                    variant="secondary"
                    className="w-full justify-start"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href={route.route}>{route.name}</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-t pt-4">
          {isAuthenticated ? (
            <Button
              variant="outline"
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full"
            >
              <LogOut className="size-4" />
              <span>Sign Out</span>
            </Button>
          ) : (
            <Button
              onClick={() => {
                login();
                setIsOpen(false);
              }}
              className="w-full"
            >
              <LogIn className="size-4" />
              <span>Sign In with TMDB</span>
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
