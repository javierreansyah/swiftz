"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Compass } from "lucide-react";
import Logo from "@/public/assets/svg-components/logo";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "./theme-switcher";
import { MobileDrawer } from "./mobile-drawer";
import { UserNavDropdown } from "./user-nav-dropdown";
import { HeaderSearch } from "./header-search";
import { useAuth } from "@/components/providers/auth-provider";
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
    pathname?.startsWith("/movie/") || pathname?.startsWith("/tv/")
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
    ...(isAuthenticated ? [{ route: "/library", name: "Library" }] : []),
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

        <div className="flex items-center gap-2">
          {/* Header Search (Inline on Desktop, Icon + Top Sheet on Mobile) */}
          <Suspense fallback={<div className="size-9" />}>
            <HeaderSearch
              isScrolled={isScrolled}
              isMovieDetailPage={isDetailPage}
            />
          </Suspense>

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

export default Navbar;
