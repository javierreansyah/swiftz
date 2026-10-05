"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Compass, Film } from "lucide-react";
import Logo from "@/public/assets/svg-components/logo";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { MobileDrawer } from "@/components/layout/mobile-drawer";
import { UserNavDropdown } from "@/components/layout/user-nav-dropdown";
import { HeaderSearch } from "@/features/search/components/header-search";
import { useAuth } from "@/features/auth/auth-provider";
import { useMovieNav } from "@/components/providers/movie-nav-provider";
interface NavigationRoute {
  route: string;
  name: string;
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const isDetailPage = Boolean(
    pathname?.startsWith("/movie/") || pathname?.startsWith("/tv/"),
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationList: NavigationRoute[] = [
    { route: "/", name: "Home" },
    { route: "/movie", name: "Movies" },
    { route: "/tv", name: "TV Shows" },
    { route: "/person", name: "People" },
  ];

  const {
    isAvailable: isMovieNavAvailable,
    isOpen: isMovieNavOpen,
    toggle: toggleMovieNav,
    close: closeMovieNav,
  } = useMovieNav();

  const handleToggleMenu = () => {
    if (!isOpen && isMovieNavOpen) {
      closeMovieNav();
    }
    setIsOpen(!isOpen);
  };

  const handleToggleMovieNav = () => {
    if (isOpen) {
      setIsOpen(false);
    }
    toggleMovieNav();
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 w-full">
      {/* Scrolled Frosted Header + Bottom Border */}
      <div
        className={`pointer-events-none absolute inset-0 border-b border-border bg-background/80 shadow-sm backdrop-blur-md transition-opacity duration-300 ease-in-out ${
          isScrolled ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Content Layer */}
      <div className="relative z-10 container flex h-full items-center gap-4">
        {/* Left: Brand Logo & Navigation */}
        <div className="flex shrink-0 items-center gap-6 lg:gap-8">
          <Link href="/">
            <Logo className="size-16" />
          </Link>

          <nav className="hidden lg:block">
            <ul className="flex gap-6 lg:gap-8">
              {navigationList.map((item, index) => (
                <li key={index}>
                  <Link href={item.route}>
                    <p
                      className={`font-medium transition-colors duration-300 ${
                        !isScrolled && isDetailPage
                          ? "text-media-foreground drop-shadow hover:text-primary"
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

        {/* Center: Search Bar taking full width of available space */}
        <div className="flex min-w-0 flex-1 items-center justify-end md:justify-start">
          <Suspense fallback={<div className="h-10 w-full" />}>
            <HeaderSearch
              className="w-full"
              isScrolled={isScrolled}
              isMovieDetailPage={isDetailPage}
            />
          </Suspense>
        </div>

        {/* Right: Actions */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Library Button on the right of the search bar */}
          {isAuthenticated && (
            <Button
              variant="outline"
              size="default"
              asChild
              className="shrink-0"
            >
              <Link href="/library" aria-label="Library">
                <Film className="size-4" />
                <span className="hidden sm:inline">Library</span>
              </Link>
            </Button>
          )}

          <div className="hidden lg:block">
            <ThemeSwitcher variant="outline" />
          </div>

          {/* User Auth Section */}
          <div className="hidden items-center sm:flex">
            <UserNavDropdown />
          </div>

          {/* Mobile Movie Section Navigator Trigger (Compass) */}
          {isMovieNavAvailable && (
            <Button
              variant={isMovieNavOpen ? "default" : "outline"}
              size="icon"
              className="lg:hidden"
              onClick={handleToggleMovieNav}
              aria-expanded={isMovieNavOpen}
              aria-label="Toggle movie section navigation"
              title="Jump to section"
            >
              <Compass className="size-5" />
            </Button>
          )}

          {/* Mobile Main Menu Drawer Trigger */}
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={handleToggleMenu}
            aria-label="Toggle navigation"
          >
            <Menu className="size-5" />
            <span className="sr-only">Toggle navigation</span>
          </Button>
        </div>
      </div>

      <MobileDrawer isOpen={isOpen} setIsOpen={setIsOpen} />
    </header>
  );
}
