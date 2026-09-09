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
    <header className="h-16 fixed top-0 left-0 right-0 w-full z-50">
      {/* Scrolled Frosted Header + Bottom Border */}
      <div
        className={`absolute inset-0 bg-background/80 backdrop-blur-md border-b border-border shadow-sm transition-opacity duration-300 ease-in-out pointer-events-none ${
          isScrolled ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Content Layer */}
      <div className="relative z-10 container h-full flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/">
            <Logo className="w-16 h-16" />
          </Link>

          <nav className="hidden lg:block">
            <ul className="flex gap-8">
              {navigationList.map((item, index) => (
                <li key={index}>
                  <Link href={item.route}>
                    <p
                      className={`transition-colors duration-300 font-medium ${
                        !isScrolled && isMovieDetailPage
                          ? "text-white hover:text-primary drop-shadow"
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
            <div className="hidden sm:flex items-center">
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-full border border-border p-1 hover:border-primary/50 transition-colors focus:outline-none">
                      {avatarUrl ? (
                        <div className="relative h-8 w-8 rounded-full overflow-clip">
                          <Image
                            src={avatarUrl}
                            alt={user.username}
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold">{user.name || user.username}</p>
                        <p className="text-xs text-muted-foreground font-normal">
                          @{user.username}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/library" className="cursor-pointer flex items-center gap-2">
                        <Film className="h-4 w-4" />
                        <span>My Library</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/library?tab=favorites"
                        className="cursor-pointer flex items-center gap-2"
                      >
                        <Heart className="h-4 w-4 text-red-500" />
                        <span>Favorites</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/library?tab=watchlist"
                        className="cursor-pointer flex items-center gap-2"
                      >
                        <Bookmark className="h-4 w-4 text-blue-500" />
                        <span>Watchlist</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/library?tab=rated"
                        className="cursor-pointer flex items-center gap-2"
                      >
                        <Star className="h-4 w-4 text-amber-500" />
                        <span>Rated Movies</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => logout()}
                      className="cursor-pointer text-destructive focus:text-destructive flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
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
                  <LogIn className="h-4 w-4" />
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
            <Menu className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>
      </div>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
    </header>
  );
};

export default Navigation;
