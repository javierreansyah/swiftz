"use client";
import { Button } from "@/components/ui/button";
export function QueryFeedback({
  hasData,
  onRetry,
}: {
  hasData: boolean;
  onRetry: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center justify-center gap-3 rounded-3xl border border-border bg-card p-4 text-center"
    >
      <p className="text-sm text-muted-foreground">
        {hasData
          ? "Could not refresh results. Showing previously loaded content."
          : "Could not load results. Please try again."}
      </p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}
