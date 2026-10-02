"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TMDBError } from "@/lib/tmdb-error";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 60 * 1000, // 30 minutes (TMDB data rarely changes)
            gcTime: 60 * 60 * 1000, // Bound inactive cache memory to one hour
            refetchOnWindowFocus: false,
            retry: (failureCount, error) =>
              failureCount < 1 && !(error instanceof TMDBError && error.status < 500),
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
