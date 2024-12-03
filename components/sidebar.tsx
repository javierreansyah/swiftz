"use client";

import { Button } from "./ui/button";
import { ArrowRightToLine } from "lucide-react";
import { useEffect } from "react";
import { ThemeSwitcher } from "./theme-switcher";
import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface navigationRoute {
  route: string;
  name: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const navigationList: navigationRoute[] = [
    { route: "/", name: "Home" },
    { route: "https://chatgpt.com/", name: "About" },
    { route: "/discover", name: "Discover" },
    { route: "/genres", name: "Genres" },
    { route: "/search", name: "Search" },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 bottom-0 bg-black/50 z-40 transition-opacity duration-300 ease-in-out pointer-events-none opacity-0 ${
          isOpen ? "opacity-100 backdrop-blur-sm" : ""
        }`}
      />
      <aside
        className={`fixed top-0 right-0 h-screen w-[240px] sm:w-[320px] z-50 bg-card border-l transition-all duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="px-3">
            <div className="">
              <div className="h-16 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <ArrowRightToLine className="h-[1.2rem] w-[1.2rem]" />
                  <span className="sr-only">Toggle sidebar</span>
                </Button>
                <h1
                  className="font-black text-primary text-3xl"
                  style={{ fontStyle: "italic" }}
                >
                  Swiftz
                </h1>
                <ThemeSwitcher variant="ghost" />
              </div>
              <nav>
                <ul className="space-y-2">
                  {navigationList.map((route, index) => (
                    <li key={index}>
                      <Button
                        asChild
                        size="full"
                        variant="itemleft"
                        onClick={() => setIsOpen(!isOpen)}
                      >
                        <Link href={route.route}>{route.name}</Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
