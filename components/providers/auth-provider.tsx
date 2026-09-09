"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { TMDBAccount } from "@/types/auth";
import {
  createRequestToken,
  deleteSession,
  getAccountDetails,
} from "@/lib/tmdb-client";
import { useQueryClient } from "@tanstack/react-query";

interface AuthContextType {
  user: TMDBAccount | null;
  sessionId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (returnUrl?: string) => Promise<void>;
  loginDemo: (returnUrl?: string) => void;
  logout: () => Promise<void>;
  setSessionAndUser: (sessionId: string, user: TMDBAccount) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_STORAGE_KEY = "swiftz_tmdb_session";
const USER_STORAGE_KEY = "swiftz_tmdb_user";
const RETURN_URL_KEY = "swiftz_auth_return_url";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<TMDBAccount | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    try {
      const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);

      if (storedSession && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setSessionId(storedSession);
        setUser(parsedUser);

        // Background check session validity for non-demo sessions
        if (!storedSession.startsWith("swiftz_demo_")) {
          getAccountDetails(storedSession)
            .then((freshUser) => {
              setUser(freshUser);
              localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(freshUser));
            })
            .catch(() => {
              // If session is revoked on TMDB, clear local state
              localStorage.removeItem(SESSION_STORAGE_KEY);
              localStorage.removeItem(USER_STORAGE_KEY);
              setSessionId(null);
              setUser(null);
            });
        }
      }
    } catch {
      // Ignore localStorage errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (returnUrl?: string) => {
    try {
      if (typeof window === "undefined") return;
      if (returnUrl) {
        sessionStorage.setItem(RETURN_URL_KEY, returnUrl);
      } else {
        sessionStorage.setItem(
          RETURN_URL_KEY,
          window.location.pathname + window.location.search
        );
      }

      const requestToken = await createRequestToken();
      sessionStorage.setItem("swiftz_request_token", requestToken);

      const callbackUrl = `${window.location.origin}/auth/callback`;
      window.location.href = `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=${encodeURIComponent(
        callbackUrl
      )}`;
    } catch (err) {
      console.error("Failed to initiate TMDB login:", err);
      alert("Failed to initiate TMDB login. Please try again.");
    }
  }, []);

  const loginDemo = useCallback((returnUrl?: string) => {
    const demoUser: TMDBAccount = {
      id: 999999,
      name: "Alex Rivera",
      username: "cinephile_alex",
      include_adult: false,
      iso_639_1: "en",
      iso_3166_1: "US",
      avatar: {
        gravatar: { hash: "" },
        tmdb: { avatar_path: null },
      },
    };
    const demoSession = "swiftz_demo_session_active";
    setSessionId(demoSession);
    setUser(demoUser);
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, demoSession);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(demoUser));
    } catch {
      // Ignore
    }
    if (returnUrl && typeof window !== "undefined") {
      window.location.href = returnUrl;
    }
  }, []);

  const logout = useCallback(async () => {
    if (sessionId && !sessionId.startsWith("swiftz_demo_")) {
      try {
        await deleteSession(sessionId);
      } catch {
        // Continue clearing local state regardless
      }
    }
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setSessionId(null);
    setUser(null);
    queryClient.clear();
  }, [sessionId, queryClient]);

  const setSessionAndUser = useCallback(
    (newSessionId: string, newUser: TMDBAccount) => {
      setSessionId(newSessionId);
      setUser(newUser);
      localStorage.setItem(SESSION_STORAGE_KEY, newSessionId);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        sessionId,
        isLoading,
        isAuthenticated: Boolean(user && sessionId),
        login,
        loginDemo,
        logout,
        setSessionAndUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
