import type { ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { getTMDBSrcSet } from "@/lib/tmdb/images";
interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  variant?:
    | "cover"
    | "default"
    | "card"
    | "thumbnail"
    | "ambient"
    | "spotlight"
    | "hero"
    | "preview"
    | "collection"
    | "watermark"
    | "logo";
}

const imageVariants = {
  default: "",
  cover: "object-cover",
  card: "object-cover transition-transform duration-500 group-hover:scale-105 group-hover/item:scale-105 group-hover/poster:scale-105",
  thumbnail:
    "object-cover transition-transform duration-300 group-hover:scale-105",
  ambient:
    "scale-105 object-cover object-top opacity-70 blur-2xl brightness-80 contrast-105 transition-all duration-300 sm:blur-3xl dark:opacity-60 dark:brightness-75 dark:contrast-110",
  spotlight:
    "object-cover brightness-75 transition-transform duration-700 ease-out hover:scale-105",
  hero: "object-cover object-center brightness-80 transition-all duration-500",
  preview: "object-contain object-center transition-all duration-500",
  collection:
    "object-cover opacity-20 transition-transform duration-500 group-hover:scale-105",
  watermark: "object-cover opacity-25",
  logo: "object-contain p-1",
} as const;

/** Native responsive images: the browser selects a TMDB CDN size, never /_next/image. */
export default function Image({
  src,
  alt,
  fill = false,
  priority = false,
  variant = "default",
  className,
  sizes,
  srcSet,
  loading,
  fetchPriority,
  decoding = "async",
  width,
  height,
  ...props
}: ImageProps) {
  return (
    <picture className="contents">
      <img
        {...props}
        src={src}
        alt={alt}
        width={width}
        height={height}
        srcSet={srcSet || getTMDBSrcSet(src)}
        sizes={sizes || (width ? `${width}px` : "100vw")}
        loading={loading || (priority ? "eager" : "lazy")}
        fetchPriority={fetchPriority || (priority ? "high" : "auto")}
        decoding={decoding}
        className={cn(
          fill && "absolute inset-0 size-full",
          imageVariants[variant],
          className,
        )}
      />
    </picture>
  );
}
