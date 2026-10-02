import { AuthCallbackClient } from "@/features/auth/components/auth-callback-client";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
export const metadata = pageMetadata({
  title: "Connect TMDB Account",
  description: "Complete your TMDB account connection to Swiftz.",
  path: "/auth/callback",
  noIndex: true,
});

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-empty-page items-center justify-center p-4 pt-20">
          <div className="w-full max-w-md space-y-4 rounded-3xl border bg-card p-8 text-center">
            <Loader2 className="mx-auto size-12 animate-spin text-primary" />
            <h1 className="heading-page">Connecting to TMDB...</h1>
          </div>
        </main>
      }
    >
      <AuthCallbackClient />
    </Suspense>
  );
}
