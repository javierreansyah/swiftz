import Image from "@/components/ui/image";
import { cva } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import { tmdbImageUrl } from "@/lib/tmdb/images";
const fallbackVariants = cva(
  "flex size-full items-center justify-center bg-secondary text-muted-foreground",
  {
    variants: { size: { compact: "", full: "text-xs" } },
    defaultVariants: { size: "full" },
  },
);
const iconVariants = cva("", {
  variants: { size: { compact: "size-4", full: "size-6" } },
  defaultVariants: { size: "full" },
});

export function SearchResultImage({
  path,
  title,
  icon: Icon,
  size = "full",
  fallback = true,
}: {
  path?: string | null;
  title: string;
  icon: LucideIcon;
  size?: "compact" | "full";
  fallback?: boolean;
}) {
  const src = tmdbImageUrl(path, size === "compact" ? 92 : 185);
  if (src)
    return (
      <Image
        src={src}
        alt={title}
        fill
        sizes={size === "compact" ? "40px" : "96px"}
        variant={size === "compact" ? "cover" : "thumbnail"}
      />
    );
  return fallback ? (
    <div className={fallbackVariants({ size })}>
      <Icon className={iconVariants({ size })} />
    </div>
  ) : null;
}
