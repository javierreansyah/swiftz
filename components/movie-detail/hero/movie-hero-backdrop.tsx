"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

export interface MovieHeroBackdropProps {
  backdropUrl: string;
  alt?: string;
}

export function MovieHeroBackdrop({
  backdropUrl,
  alt = "Movie Backdrop",
}: MovieHeroBackdropProps) {
  const [offsetY, setOffsetY] = useState(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          // Parallax motion: translates downward by 38% of scroll,
          // creating a distinct, elegant lag compared to foreground content
          setOffsetY(window.scrollY * 0.38);
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[1250px] overflow-hidden select-none"
    >
      {/* Parallax Image Wrapper with generous bleed for continuous parallax motion */}
      <div
        className="absolute -inset-x-12 -top-40 h-[1450px] will-change-transform"
        style={{
          transform: `translate3d(0, ${offsetY}px, 0)`,
        }}
      >
        <Image
          src={backdropUrl}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="scale-105 object-cover object-top opacity-70 blur-2xl brightness-80 contrast-105 filter transition-all duration-300 sm:blur-3xl dark:opacity-60 dark:brightness-75 dark:contrast-110"
        />

        {/* Mode-specific lighting/darkening: darkened on light mode, gently shaded on dark mode */}
        <div className="absolute inset-0 bg-black/25 transition-colors duration-300 dark:bg-black/40" />
      </div>

      {/* Top subtle fade for navbar readability */}
      <div className="absolute inset-x-0 top-0 h-36 bg-linear-to-b from-background/90 via-background/40 to-transparent" />

      {/* Bottom smooth bleed: continuous gradient transition from opacity 0 to opacity 100 of background */}
      <div className="absolute inset-x-0 bottom-0 h-120 bg-linear-to-b from-transparent via-background/60 to-background" />
    </div>
  );
}

export default MovieHeroBackdrop;
