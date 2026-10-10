"use client";
import React from "react";
import Image from "@/components/ui/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Film,
  Tv,
  Users,
  Bookmark,
  X,
  LogIn,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { useAuth } from "@/features/auth/auth-provider";

interface MobileDrawerProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface NavigationRoute {
  route: string;
  name: string;
  icon: LucideIcon;
}

export function MobileDrawer({ isOpen, setIsOpen }: MobileDrawerProps) {
  const { user, isAuthenticated, login, logout } = useAuth();
  const pathname = usePathname();

  const navigationList: NavigationRoute[] = [
    { route: "/", name: "Home", icon: Home },
    { route: "/movie", name: "Movies", icon: Film },
    { route: "/tv", name: "TV Shows", icon: Tv },
    { route: "/person", name: "People", icon: Users },
    ...(isAuthenticated
      ? [{ route: "/library", name: "My Library", icon: Bookmark }]
      : []),
  ];

  const isActiveRoute = (route: string) => {
    if (route === "/") return pathname === "/";
    return pathname.startsWith(route);
  };

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
        className="flex w-72 flex-col justify-between sm:w-80"
      >
        <div className="flex flex-1 flex-col justify-between p-6">
          <div className="space-y-6">
            <div className="flex h-10 items-center justify-between">
              <ThemeSwitcher variant="ghost" />
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                <X className="size-5" />
              </Button>
            </div>

            {/* User Profile Card */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card/60 p-3 shadow-xs">
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
                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="truncate text-sm font-semibold text-foreground">
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
                {navigationList.map((item) => {
                  const isActive = isActiveRoute(item.route);
                  const Icon = item.icon;

                  return (
                    <li key={item.route}>
                      <Button
                        asChild
                        variant={isActive ? "default" : "secondary"}
                        className="w-full justify-start"
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href={item.route}>
                          <Icon className="size-4" />
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <div className="pt-4">
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
