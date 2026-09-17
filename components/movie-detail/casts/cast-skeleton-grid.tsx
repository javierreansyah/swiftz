import React from "react";

export function CastSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className="flex h-37.5 animate-pulse rounded-md border bg-card"
        >
          <div className="h-full w-25 bg-secondary" />
          <div className="flex-1 space-y-2 p-4">
            <div className="h-4 w-3/4 rounded bg-secondary" />
            <div className="h-3 w-1/2 rounded bg-secondary" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default CastSkeletonGrid;
