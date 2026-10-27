import { cn } from "cn";
function Skeleton({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & { variant?: "default" | "shelf" }) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-2xl bg-muted",
        variant === "shelf" && "h-hero-md w-36 shrink-0 sm:h-hero-xl sm:w-60",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
