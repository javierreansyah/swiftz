"use client";

import Logo from "@/public/assets/svg-components/logo";
import { ThemeSwitcher } from "./theme-switcher";
import Link from "next/link";
import Sidebar from "./sidebar";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

interface navigationRoute {
  route: string;
  name: string;
}

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

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
  ];

  return (
    <header className="h-16 fixed top-0 left-0 right-0 w-full z-50">
      {/* Scrolled Frosted Header + Bottom Border (Appears on scroll) */}
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
        <div className="flex gap-2">
          <div className="hidden lg:block">
            <ThemeSwitcher variant="outline" />
          </div>

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
