"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export interface PersonBioProps {
  biography: string;
}

export function PersonBio({ biography }: PersonBioProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!biography) {
    return (
      <p className="text-sm text-muted-foreground italic">
        We don&apos;t have a biography for this person yet.
      </p>
    );
  }

  const isLong = biography.length > 350;

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold tracking-tight text-foreground">
        Biography
      </h2>
      <div
        className={`text-sm leading-relaxed text-muted-foreground transition-all duration-300 ${
          !isExpanded && isLong ? "line-clamp-4" : ""
        }`}
      >
        <p className="whitespace-pre-line">{biography}</p>
      </div>

      {isLong && (
        <Button
          variant="link"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-auto p-0 text-xs font-semibold text-primary hover:text-primary/80"
        >
          {isExpanded ? "Read less" : "Read more"}
        </Button>
      )}
    </div>
  );
}

export default PersonBio;
