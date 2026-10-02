"use client";

import React from "react";
import { LogIn, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
          <LogIn className="size-6" />
        </div>
        <div className="space-y-1 text-center">
          <DialogTitle>Sign in with TMDB</DialogTitle>
          <DialogDescription>
            Connect your TMDB account to save {title} to your watchlist,
            favorites, and rate it.
          </DialogDescription>
        </div>
        <div className="flex flex-col gap-2 pt-2">
          <Button
            onClick={() => {
              onClose();
              onLogin();
            }}
            className="w-full"
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
            className="w-full"
          >
            <Sparkles className="size-3.5 text-primary" />
            <span>Try Demo Account (Instant Preview)</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AuthPromptModal;
