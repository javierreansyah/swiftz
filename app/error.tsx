"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
export default function Error({
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
      <div className="w-full max-w-md space-y-4 rounded-3xl border bg-card p-8 text-center">
        <h2 className="heading-section text-destructive">
          Something went wrong!
        </h2>
        <p className="text-sm text-muted-foreground">
          Failed to load content. Please try again or check your internet
          connection.
        </p>
        <Button onClick={() => reset()} variant="default" className="w-full">
          Try Again
        </Button>
      </div>
    </div>
  );
}
