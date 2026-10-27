"use client";
import Image from "@/components/ui/image";
import { useParallax } from "@/hooks/use-parallax";
export interface MovieHeroBackdropProps {
  backdropUrl: string;
  alt?: string;
}

export function MovieHeroBackdrop({
  backdropUrl,
  alt = "Movie Backdrop",
}: MovieHeroBackdropProps) {
  const parallaxRef = useParallax();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-312.5 overflow-hidden select-none"
    >
      {/* Parallax Image Wrapper with generous bleed for continuous parallax motion */}
      <div
        ref={parallaxRef}
        className="absolute -inset-x-12 -top-40 h-362.5 parallax-backdrop will-change-transform"
      >
        <Image
          src={backdropUrl}
          alt={alt}
          fill
          priority
          sizes="100vw"
          variant="ambient"
        />

        {/* Mode-specific lighting/darkening: softened with background tint on light mode, gently shaded on dark mode */}
        <div className="absolute inset-0 bg-background/25 transition-colors duration-300 dark:bg-scrim/40" />
      </div>

      {/* Top subtle fade for navbar readability */}
      <div className="absolute inset-x-0 top-0 h-36 bg-linear-to-b from-background/90 via-background/40 to-transparent" />

      {/* Bottom smooth bleed: continuous gradient transition from opacity 0 to opacity 100 of background */}
      <div className="absolute inset-x-0 bottom-0 h-120 bg-linear-to-b from-transparent via-background/60 to-background" />
    </div>
  );
}
