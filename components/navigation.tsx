"use client";

import Logo from "@/public/assets/svg-components/logo";
import { ThemeSwitcher } from "./theme-switcher";
import Link from "next/link";
import Sidebar from "./sidebar";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import {
  Menu,
  LogIn,
  LogOut,
  Heart,
  Bookmark,
  Star,
  User as UserIcon,
  Film,
} from "lucide-react";
import { useAuth } from "./providers/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

interface navigationRoute {
  route: string;
  name: string;
}

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();

  const isMovieDetailPage = pathname?.startsWith("/movie/");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationList: navigationRoute[] = [
    { route: "/", name: "Home" },
    { route: "/discover", name: "Discover" },
    { route: "/genres", name: "Genres" },
    ...(isAuthenticated ? [{ route: "/library", name: "Library" }] : []),
  ];

  const avatarUrl = user?.avatar?.tmdb?.avatar_path
    ? `https://image.tmdb.org/t/p/w185${user.avatar.tmdb.avatar_path}`
    : user?.avatar?.gravatar?.hash
    ? `https://www.gravatar.com/avatar/${user.avatar.gravatar.hash}?d=identicon`
    : null;

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 w-full">
      {/* Scrolled Frosted Header + Bottom Border */}
      <div
        className={`pointer-events-none absolute inset-0 border-b border-border bg-background/80 shadow-sm backdrop-blur-md transition-opacity duration-300 ease-in-out ${
          isScrolled ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Content Layer */}
      <div className="relative z-10 container flex h-full items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/">
            <Logo className="size-16" />
          </Link>

          <nav className="hidden lg:block">
            <ul className="flex gap-8">
              {navigationList.map((item, index) => (
                <li key={index}>
                  <Link href={item.route}>
                    <p
                      className={`font-medium transition-colors duration-300 ${
                        !isScrolled && isMovieDetailPage
                          ? "text-white drop-shadow hover:text-primary"
                          : "text-foreground hover:text-primary"
                      }`}
                    >
                      {item.name}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <ThemeSwitcher variant="outline" />
          </div>

          {/* User Auth Section */}
          {!isLoading && (
            <div className="hidden items-center sm:flex">
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-full border border-border p-1 transition-colors hover:border-primary/50 focus:outline-none">
                      {avatarUrl ? (
                        <div className="relative size-8 overflow-clip rounded-full">
                          <Image
                            src={avatarUrl}
                            alt={user.username}
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </button>
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
                        <Heart className="size-4 text-red-500" />
                        <span>Favorites</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/library?tab=watchlist"
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <Bookmark className="size-4 text-blue-500" />
                        <span>Watchlist</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/library?tab=rated"
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <Star className="size-4 text-amber-500" />
                        <span>Rated Movies</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => logout()}
                      className="flex cursor-pointer items-center gap-2 text-destructive focus:text-destructive"
                    >
                      <LogOut className="size-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => login()}
                  className="gap-2 font-medium"
                >
                  <LogIn className="size-4" />
                  <span>Sign In</span>
                </Button>
              )}
            </div>
          )}

          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="size-[1.2rem]" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>
      </div>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
    </header>
  );
};

export default Navigation;
