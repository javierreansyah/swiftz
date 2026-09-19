"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Film,
  Tv,
  User,
  Play,
  Image as ImageIcon,
  Star,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type MediaCardType =
  | "movie"
  | "tv"
  | "person"
  | "video"
  | "photo"
  | "season";

export type MediaCardAspectRatio = "poster" | "portrait" | "video" | "square";

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
  variant?: "shelf" | "grid";
  size?: "sm" | "md" | "lg";
  className?: string;
  actionIcon?: React.ReactNode;
  onActionClick?: (e: React.MouseEvent) => void;
  actionTitle?: string;
  priority?: boolean;
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
  actionIcon,
  onActionClick,
  actionTitle,
  priority = false,
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
        return <ImageIcon className="size-10 text-muted-foreground/60" />;
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
            return "h-[230px] w-64 shrink-0";
          case "portrait":
            return "h-[230px] w-36 shrink-0";
          case "poster":
          default:
            return "h-[230px] w-32 shrink-0";
        }
      case "lg":
        // Overall height: ~340px
        switch (effectiveAspectRatio) {
          case "video":
            return "h-[340px] w-[460px] shrink-0";
          case "portrait":
            return "h-[340px] w-56 shrink-0";
          case "poster":
          default:
            return "h-[340px] w-48 shrink-0";
        }
      case "md":
      default:
        // Overall height: ~280px (Standard baseline across all shelves)
        switch (effectiveAspectRatio) {
          case "video":
            return "h-[280px] w-80 shrink-0 sm:w-96";
          case "portrait":
            return "h-[280px] w-40 shrink-0 sm:w-44";
          case "poster":
          default:
            return "h-[280px] w-36 shrink-0 sm:w-40";
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

  const cardContent = (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-none border border-border/70 bg-card/60 transition-all duration-300 select-none hover:border-primary/40 hover:shadow-lg",
        variant === "shelf" ? getShelfDimensions() : "w-full",
        (onClick || href) && "cursor-pointer",
        className
      )}
    >
      {/* Media Showcase Area */}
      <div
        className={cn(
          "relative w-full overflow-hidden bg-muted",
          variant === "shelf" ? "min-h-0 flex-1" : getMediaAspectClass()
        )}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-secondary">
            {renderFallbackIcon()}
          </div>
        )}

        {/* Video Overlay Play Button */}
        {type === "video" && (
          <>
            <div className="absolute inset-0 bg-black/25 transition-opacity group-hover:bg-black/10" />
            <div className="absolute top-1/2 left-1/2 flex size-10 -translate-1/2 items-center justify-center rounded-none bg-primary/90 text-primary-foreground shadow-lg backdrop-blur-xs transition-transform group-hover:scale-110">
              <Play className="ml-0.5 size-5 fill-current" />
            </div>
          </>
        )}

        {/* Custom Quick Action Button (e.g. trailer or watchlist) */}
        {actionIcon && (
          <button
            type="button"
            title={actionTitle}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onActionClick?.(e);
            }}
            className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-none bg-black/60 text-white backdrop-blur-xs transition-all hover:bg-primary hover:text-primary-foreground"
          >
            {actionIcon}
          </button>
        )}

        {/* Overlay Badge */}
        {badge && (
          <div className="absolute bottom-2 left-2 rounded-none border border-white/15 bg-black/75 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-xs">
            {badge}
          </div>
        )}
      </div>

      {/* Standardized Info Section */}
      <div className="flex h-16 shrink-0 flex-col justify-between p-3">
        <h3 className="line-clamp-1 text-sm font-bold text-foreground transition-colors group-hover:text-primary">
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
            <span className="truncate text-[11px]">{subtitle}</span>
          )}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} prefetch={false} className="block shrink-0">
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
        className="block shrink-0 focus:outline-hidden"
      >
        {cardContent}
      </div>
    );
  }

  return cardContent;
}

export default MediaCard;
