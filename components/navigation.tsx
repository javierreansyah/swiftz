"use client";

import Logo from "@/public/assets/svg-components/logo";
import { ThemeSwitcher } from "./theme-switcher";
import Link from "next/link";
import Sidebar from "./sidebar";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

interface navigationRoute {
  route: string;
  name: string;
}

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
      {/* Top Gradient Background (At top of page) */}
      <div
        className={`absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-transparent transition-opacity duration-300 ease-in-out pointer-events-none ${
          isScrolled ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Scrolled Frosted Header + Bottom Border (Appears & disappears together on scroll) */}
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
                        isScrolled
                          ? "hover:text-primary"
                          : "text-white hover:text-primary drop-shadow"
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
