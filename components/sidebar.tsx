"use client";

import { Button } from "./ui/button";
import { ArrowRightToLine, LogIn, LogOut, Film, Heart, Bookmark, Star } from "lucide-react";
import { useEffect } from "react";
import { ThemeSwitcher } from "./theme-switcher";
import Link from "next/link";
import { useAuth } from "./providers/auth-provider";
import Image from "next/image";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface navigationRoute {
  route: string;
  name: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user, isAuthenticated, login, logout } = useAuth();

  const navigationList: navigationRoute[] = [
    { route: "/", name: "Home" },
    { route: "/discover", name: "Discover" },
    { route: "/genres", name: "Genres" },
    ...(isAuthenticated ? [{ route: "/library", name: "My Library" }] : []),
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen]);

  const avatarUrl = user?.avatar?.tmdb?.avatar_path
    ? `https://image.tmdb.org/t/p/w185${user.avatar.tmdb.avatar_path}`
    : user?.avatar?.gravatar?.hash
    ? `https://www.gravatar.com/avatar/${user.avatar.gravatar.hash}?d=identicon`
    : null;

  return (
    <>
      <div
        className={`pointer-events-none fixed inset-0 z-40 bg-black/50 opacity-0 transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100 backdrop-blur-sm" : ""
        }`}
        onClick={() => setIsOpen(false)}
      />
      <aside
        className={`fixed top-0 right-0 z-50 h-screen w-65 transform border-l bg-card transition-all duration-300 ease-in-out sm:w-80 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col justify-between p-4">
          <div className="space-y-6">
            <div className="flex h-12 items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
              >
                <ArrowRightToLine className="size-[1.2rem]" />
                <span className="sr-only">Close sidebar</span>
              </Button>
              <h1
                className="text-2xl font-black text-primary"
                style={{ fontStyle: "italic" }}
              >
                Swiftz
              </h1>
              <ThemeSwitcher variant="ghost" />
            </div>

            {/* User Profile Card */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3 rounded-lg border bg-secondary/50 p-3">
                {avatarUrl ? (
                  <div className="relative size-10 flex-none overflow-clip rounded-full">
                    <Image
                      src={avatarUrl}
                      alt={user.username}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex size-10 flex-none items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                    {user.username.charAt(0).toUpperCase()}
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
                      size="full"
                      variant="itemleft"
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
                size="full"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="gap-2 border-destructive/20 text-destructive hover:bg-destructive/10"
              >
                <LogOut className="size-4" />
                <span>Sign Out</span>
              </Button>
            ) : (
              <Button
                size="full"
                onClick={() => {
                  login();
                  setIsOpen(false);
                }}
                className="gap-2 font-medium"
              >
                <LogIn className="size-4" />
                <span>Sign In with TMDB</span>
              </Button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
