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
  LogIn,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHandle,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { useAuth } from "@/features/auth/auth-provider";
import { cn } from "@/lib/utils";

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
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent
        surface="fit"
        className="inset-x-0 bottom-0 mx-auto w-full max-w-(--max-container)"
      >
        <DrawerHandle className="md:hidden" />
        <DrawerTitle className="sr-only">Menu</DrawerTitle>

        <div className="space-y-4 px-4 pt-5 pb-8">
          {/* User Profile Card (if authenticated) */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-3 shadow-xs">
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

          {/* Connected Navigation Links */}
          <div className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/70 bg-card">
            {navigationList.map((item) => {
              const isActive = isActiveRoute(item.route);
              const Icon = item.icon;

              return (
                <Link
                  key={item.route}
                  href={item.route}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors select-none",
                    isActive
                      ? "bg-primary/10 font-semibold text-primary"
                      : "font-medium text-foreground hover:bg-muted/50",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-xl transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                  </div>
                  <span className="flex-1 text-sm">{item.name}</span>
                  {isActive && (
                    <div className="size-2 shrink-0 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Footer Auth Action & Theme Switcher */}
          <div className="flex items-center gap-2 pt-1">
            {isAuthenticated ? (
              <Button
                variant="outline"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="flex-1 justify-start"
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
                className="flex-1 justify-start"
              >
                <LogIn className="size-4" />
                <span>Sign In with TMDB</span>
              </Button>
            )}
            <ThemeSwitcher variant="outline" />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
