"use client";
import React from "react";
import Image from "@/components/ui/image";
import Link from "next/link";
import { Film, Tv, User, Play, Camera, Star, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
export type MediaCardType =
  "movie" | "tv" | "person" | "video" | "photo" | "season";

export type MediaCardAspectRatio = "poster" | "portrait" | "video" | "square";

const SHELF_IMAGE_SIZES = {
  sm: { poster: "8rem", portrait: "9rem", video: "16rem", square: "8rem" },
  md: {
    poster: "(min-width: 640px) 15rem, 9rem",
    portrait: "(min-width: 640px) 11rem, 9rem",
    video: "(min-width: 640px) 24rem, 18rem",
    square: "(min-width: 640px) 15rem, 9rem",
  },
  lg: {
    poster: "12rem",
    portrait: "14rem",
    video: "28.75rem",
    square: "12rem",
  },
} as const;

export interface MediaCardProps {
  type: MediaCardType;
  id?: string | number;
  title: string;
  subtitle?: string;
  image?: string | null;
  rating?: number;
  year?: string | number;
  badge?: string;
  href?: string;
  onClick?: () => void;
  aspectRatio?: MediaCardAspectRatio;
  variant?: "shelf" | "grid" | "image";
  size?: "sm" | "md" | "lg";
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function MediaCard({
  type,
  title,
  subtitle,
  image,
  rating,
  year,
  badge,
  href,
  onClick,
  aspectRatio,
  variant = "shelf",
  size = "md",
  className,
  priority = false,
  sizes,
}: MediaCardProps) {
  // Default aspect ratio based on card type
  const effectiveAspectRatio: MediaCardAspectRatio =
    aspectRatio ||
    (type === "video" || type === "photo"
      ? "video"
      : type === "person"
        ? "portrait"
        : "poster");

  // Format image URL
  const imageUrl = image
    ? image.startsWith("http")
      ? image
      : `https://image.tmdb.org/t/p/${
          effectiveAspectRatio === "video" ? "w780" : "w500"
        }${image}`
    : null;

  // Placeholder icon by type
  const renderFallbackIcon = () => {
    switch (type) {
      case "person":
        return <User className="size-10 text-muted-foreground/60" />;
      case "video":
        return <Play className="size-10 text-muted-foreground/60" />;
      case "photo":
        return <Camera className="size-10 text-muted-foreground/60" />;
      case "season":
        return <Layers className="size-10 text-muted-foreground/60" />;
      case "tv":
        return <Tv className="size-10 text-muted-foreground/60" />;
      case "movie":
      default:
        return <Film className="size-10 text-muted-foreground/60" />;
    }
  };

  // Dimensions based on size and variant
  // In shelf mode, all cards share the exact same height baseline!
  // Width is derived from aspect ratio.
  const getShelfDimensions = () => {
    switch (size) {
      case "sm":
        // Overall height: ~230px
        switch (effectiveAspectRatio) {
          case "video":
            return "h-hero-sm w-64 shrink-0";
          case "portrait":
            return "h-hero-sm w-36 shrink-0";
          case "poster":
          default:
            return "h-hero-sm w-32 shrink-0";
        }
      case "lg":
        // Overall height: ~340px
        switch (effectiveAspectRatio) {
          case "video":
            return "h-hero-lg w-featured shrink-0";
          case "portrait":
            return "h-hero-lg w-56 shrink-0";
          case "poster":
          default:
            return "h-hero-lg w-48 shrink-0";
        }
      case "md":
      default:
        // Height: h-hero-md (280px) on mobile, h-hero-xl (420px) on desktop
        switch (effectiveAspectRatio) {
          case "video":
            return "h-hero-sm w-72 shrink-0 sm:h-hero-md sm:w-96";
          case "portrait":
            return "h-hero-md w-36 shrink-0 sm:h-hero-xl sm:w-44";
          case "poster":
          default:
            return "h-hero-md w-36 shrink-0 sm:h-hero-xl sm:w-60";
        }
    }
  };

  const getMediaAspectClass = () => {
    switch (effectiveAspectRatio) {
      case "video":
        return "aspect-video";
      case "portrait":
        return "aspect-4/5";
      case "square":
        return "aspect-square";
      case "poster":
      default:
        return "aspect-2/3";
    }
  };

  const imageSizes =
    sizes ||
    (variant === "shelf"
      ? SHELF_IMAGE_SIZES[size][effectiveAspectRatio]
      : effectiveAspectRatio === "video"
        ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw");

  const cardContent = (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/70 bg-card/60 transition-all duration-300 select-none hover:border-primary/40 hover:shadow-lg",
        variant === "shelf" ? getShelfDimensions() : "w-full",
        (onClick || href) && "cursor-pointer",
        className,
      )}
    >
      {/* Media Showcase Area */}
      <div
        className={cn(
          "relative w-full overflow-hidden bg-muted",
          variant === "shelf" ? "min-h-0 flex-1" : getMediaAspectClass(),
        )}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes={imageSizes}
            priority={priority}
            variant="card"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-secondary">
            {renderFallbackIcon()}
          </div>
        )}

        {/* Overlay Badge */}
        {badge && (
          <div className="absolute bottom-2.5 left-2.5 rounded-xl border border-media-foreground/15 bg-scrim/75 px-2 py-0.5 text-xs font-semibold text-media-foreground backdrop-blur-xs">
            {badge}
          </div>
        )}
      </div>

      {/* Standardized Info Section */}
      {variant !== "image" && (
        <div className="flex h-16 shrink-0 flex-col justify-between p-2.5 sm:h-20 sm:p-4">
          <h3 className="line-clamp-1 heading-card text-sm text-foreground transition-colors group-hover:text-primary sm:text-base">
            {title}
          </h3>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {rating !== undefined && rating > 0 ? (
              <div className="flex items-center gap-1 font-semibold text-primary">
                <Star className="size-3 fill-primary text-primary" />
                <span>{rating.toFixed(1)}</span>
              </div>
            ) : (
              <span className="truncate text-muted-foreground/80">
                {subtitle || (type === "person" ? "Actor" : "")}
              </span>
            )}

            {year && <span>{year}</span>}
            {!year && subtitle && rating !== undefined && rating > 0 && (
              <span className="truncate text-xs">{subtitle}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        prefetch={false}
        onClick={onClick}
        className="block shrink-0 focus-visible:rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {cardContent}
      </Link>
    );
  }

  if (onClick) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
        className="block shrink-0 focus-visible:rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {cardContent}
      </div>
    );
  }

  return cardContent;
}
