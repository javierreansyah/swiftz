"use client";

import Logo from "@/public/assets/svg-components/logo";
import { ThemeSwitcher } from "./theme-switcher";
import Link from "next/link";
import Sidebar from "./sidebar";
import { useState } from "react";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

interface navigationRoute {
  route: string;
  name: string;
}

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigationList: navigationRoute[] = [
    { route: "/", name: "Home" },
    { route: "https://chatgpt.com/", name: "About" },
    { route: "/discover", name: "Discover" },
    { route: "/genres", name: "Genres" },
    { route: "/search", name: "Search" },
  ];
  return (
    <header className="h-16 flex sticky top-0 w-full bg-background z-40">
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/">
            <Logo className="w-16 h-16" />
          </Link>

          <nav className="hidden lg:block">
            <ul className="flex gap-8">
              {navigationList.map((item, index) => (
                <li key={index}>
                  <Link href={item.route}>
                    <p className="hover:text-primary transition-all font-light">
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
