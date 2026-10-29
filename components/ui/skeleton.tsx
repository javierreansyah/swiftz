import { cn } from "cn";
function Skeleton({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "default" | "shelf" | "person-shelf";
}) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-2xl bg-muted",
        variant === "shelf" && "h-hero-md w-36 shrink-0 sm:h-110 sm:w-60",
        variant === "person-shelf" && "h-61 w-36 shrink-0 sm:h-75 sm:w-44",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
