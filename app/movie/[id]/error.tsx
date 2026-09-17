"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function MovieError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex min-h-100 flex-col items-center justify-center space-y-4 py-12">
      <div className="w-full max-w-md space-y-4 rounded-lg border bg-card p-8 text-center">
        <h2 className="text-2xl font-bold text-destructive">Failed to fetch movie details</h2>
        <p className="text-sm text-muted-foreground">
          Could not load the requested movie information.
        </p>
        <Button onClick={() => reset()} variant="default" size="full">
          Try Again
        </Button>
      </div>
    </div>
  );
}
