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

const FALLBACK_ICONS = {
  movie: Film,
  tv: Tv,
  person: User,
  video: Play,
  photo: Camera,
  season: Layers,
} as const;

const ASPECT_CLASSES = {
  poster: "aspect-2/3",
  portrait: "aspect-4/5",
  video: "aspect-video",
  square: "aspect-square",
} as const;

const SHELF_CLASSES = {
  sm: {
    poster: "w-32 shrink-0",
    square: "w-32 shrink-0",
    portrait: "w-36 shrink-0",
    video: "w-64 shrink-0",
  },
  md: {
    poster: "w-36 shrink-0 sm:w-60",
    square: "w-36 shrink-0 sm:w-60",
    portrait: "w-36 shrink-0 sm:w-44",
    video: "w-72 shrink-0 sm:w-96",
  },
  lg: {
    poster: "w-48 shrink-0",
    square: "w-48 shrink-0",
    portrait: "w-56 shrink-0",
    video: "w-featured shrink-0",
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

  const FallbackIcon = FALLBACK_ICONS[type];

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
        "group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-card/60 font-sans transition-all duration-300 select-none hover:shadow-lg",
        variant === "shelf"
          ? SHELF_CLASSES[size][effectiveAspectRatio]
          : "w-full",
        (onClick || href) && "cursor-pointer",
        className,
      )}
    >
      {/* Media Showcase Area */}
      <div
        className={cn(
          "relative w-full overflow-hidden bg-muted",
          ASPECT_CLASSES[effectiveAspectRatio],
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
            <FallbackIcon className="size-10 text-muted-foreground/60" />
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
          <h3 className="line-clamp-1 font-sans text-sm leading-snug font-semibold text-foreground transition-colors group-hover:text-primary sm:text-base">
            {title}
          </h3>

          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            {rating !== undefined && rating > 0 ? (
              <div className="flex shrink-0 items-center gap-1 font-semibold text-primary">
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
