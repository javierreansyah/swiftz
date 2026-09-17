"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createSession, getAccountDetails } from "@/lib/tmdb-client";
import { useAuth } from "@/components/providers/auth-provider";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setSessionAndUser } = useAuth();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const approved = searchParams.get("approved");
    const requestToken =
      searchParams.get("request_token") ||
      sessionStorage.getItem("swiftz_request_token");

    if (approved !== "true" || !requestToken) {
      setStatus("error");
      setErrorMessage(
        "Authentication was cancelled or the request token was missing."
      );
      return;
    }

    let isMounted = true;

    async function completeAuth() {
      try {
        const sessionId = await createSession(requestToken!);
        const userAccount = await getAccountDetails(sessionId);

        if (!isMounted) return;

        setSessionAndUser(sessionId, userAccount);
        setStatus("success");

        const returnUrl =
          sessionStorage.getItem("swiftz_auth_return_url") || "/library";
        sessionStorage.removeItem("swiftz_auth_return_url");
        sessionStorage.removeItem("swiftz_request_token");

        setTimeout(() => {
          router.replace(returnUrl);
        }, 1200);
      } catch (err: unknown) {
        if (!isMounted) return;
        setStatus("error");
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Failed to authorize session with TMDB."
        );
      }
    }

    completeAuth();

    return () => {
      isMounted = false;
    };
  }, [searchParams, router, setSessionAndUser]);

  return (
    <main className="flex min-h-[80vh] items-center justify-center p-4 pt-20">
      <div className="w-full max-w-md space-y-4 rounded-xl border bg-card p-8 text-center shadow-xl">
        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="mx-auto size-12 animate-spin text-primary" />
            <h1 className="text-2xl font-bold">Authorizing with TMDB...</h1>
            <p className="text-sm text-muted-foreground">
              Establishing your session and fetching account details.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <CheckCircle2 className="mx-auto size-12 text-green-500" />
            <h1 className="text-2xl font-bold">Welcome Back!</h1>
            <p className="text-sm text-muted-foreground">
              Successfully authenticated. Redirecting you to your destination...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <XCircle className="mx-auto size-12 text-destructive" />
            <h1 className="text-2xl font-bold">Authentication Failed</h1>
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
            <div className="pt-2">
              <Button asChild className="w-full">
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[80vh] items-center justify-center p-4 pt-20">
          <div className="w-full max-w-md space-y-4 rounded-xl border bg-card p-8 text-center">
            <Loader2 className="mx-auto size-12 animate-spin text-primary" />
            <h1 className="text-2xl font-bold">Connecting to TMDB...</h1>
          </div>
        </main>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
