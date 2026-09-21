"use client";

import React from "react";
import { LogIn, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onLogin: () => void;
  onLoginDemo: () => void;
}

export function AuthPromptModal({
  isOpen,
  onClose,
  title,
  onLogin,
  onLoginDemo,
}: AuthPromptModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200 fade-in">
      <div className="relative w-full max-w-md space-y-4 rounded-none border bg-card p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="size-5" />
          <span className="sr-only">Close</span>
        </button>
        <div className="mx-auto flex size-12 items-center justify-center rounded-none bg-primary/20 text-primary">
          <LogIn className="size-6" />
        </div>
        <div className="space-y-1 text-center">
          <h3 className="text-xl font-bold">Sign in with TMDB</h3>
          <p className="text-sm text-muted-foreground">
            Connect your TMDB account to save {title} to your watchlist,
            favorites, and rate it.
          </p>
        </div>
        <div className="flex flex-col gap-2 pt-2">
          <Button
            onClick={() => {
              onClose();
              onLogin();
            }}
            className="w-full gap-2 font-bold"
          >
            <LogIn className="size-4" />
            <span>Connect TMDB Account</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              onClose();
              onLoginDemo();
            }}
            className="w-full gap-2 text-xs"
          >
            <Sparkles className="size-3.5 text-primary" />
            <span>Try Demo Account (Instant Preview)</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AuthPromptModal;
