"use client";
import { useEffect } from "react";
import { useLinkStatus } from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pendingOverlayVariants = cva(
  "pointer-events-none absolute inset-0 z-10 animate-in duration-150 fade-in-0",
  {
    variants: {
      surface: {
        media: "bg-scrim/45",
        muted: "bg-muted/70",
      },
      shape: {
        inherit: "rounded-inherit",
        card: "rounded-3xl",
      },
    },
    defaultVariants: { surface: "media", shape: "inherit" },
  },
);

export type PendingOverlayProps = VariantProps<
  typeof pendingOverlayVariants
> & {
  label?: string;
};

/** Darkens a positioned surface while its navigation loads. */
export function PendingOverlay({
  surface,
  shape,
  label = "Loading",
}: PendingOverlayProps) {
  return (
    <div
      role="status"
      data-slot="pending-overlay"
      className={cn(pendingOverlayVariants({ surface, shape }))}
    >
      <span className="sr-only">{label}</span>
    </div>
  );
}

/** Place inside a `Link` (within a positioned box) to show pending navigation. */
export function LinkPendingOverlay(props: PendingOverlayProps) {
  const { pending } = useLinkStatus();
  return pending ? <PendingOverlay {...props} /> : null;
}

/** Reports a `Link`'s pending state to a surface that draws shared feedback. */
export function LinkPendingSignal({
  onPendingChange,
}: {
  onPendingChange: (pending: boolean) => void;
}) {
  const { pending } = useLinkStatus();
  useEffect(() => {
    onPendingChange(pending);
  }, [pending, onPendingChange]);
  return null;
}
