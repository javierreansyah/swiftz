"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface MovieNavContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggle: () => void;
  close: () => void;
  isAvailable: boolean;
  setIsAvailable: (available: boolean) => void;
}

const MovieNavContext = createContext<MovieNavContextType | undefined>(undefined);

export function MovieNavProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const pathname = usePathname();

  // Reset states on route changes
  useEffect(() => {
    setIsOpen(false);
    if (!pathname?.startsWith("/movie/")) {
      setIsAvailable(false);
    }
  }, [pathname]);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  return (
    <MovieNavContext.Provider
      value={{
        isOpen,
        setIsOpen,
        toggle,
        close,
        isAvailable,
        setIsAvailable,
      }}
    >
      {children}
    </MovieNavContext.Provider>
  );
}

export function useMovieNav() {
  const context = useContext(MovieNavContext);
  if (!context) {
    return {
      isOpen: false,
      setIsOpen: () => {},
      toggle: () => {},
      close: () => {},
      isAvailable: false,
      setIsAvailable: () => {},
    };
  }
  return context;
}
