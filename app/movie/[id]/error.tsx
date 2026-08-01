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
    <div className="container min-h-[400px] flex flex-col items-center justify-center space-y-4 py-12">
      <div className="bg-card border rounded-lg p-8 max-w-md w-full text-center space-y-4">
        <h2 className="text-2xl font-bold text-destructive">Failed to fetch movie details</h2>
        <p className="text-muted-foreground text-sm">
          Could not load the requested movie information.
        </p>
        <Button onClick={() => reset()} variant="default" size="full">
          Try Again
        </Button>
      </div>
    </div>
  );
}
