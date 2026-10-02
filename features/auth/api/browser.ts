import type { TMDBAccount, TMDBSession } from "@/lib/tmdb/types/account";
import { fetchTMDBClient } from "@/lib/tmdb/browser";
export async function createRequestToken(): Promise<string> {
  const data = await fetchTMDBClient<{
    success: boolean;
    request_token: string;
  }>("/authentication/token/new");
  return data.request_token;
}

export async function createSession(requestToken: string): Promise<string> {
  const data = await fetchTMDBClient<TMDBSession>(
    "/authentication/session/new",
    {},
    {
      method: "POST",
      body: JSON.stringify({ request_token: requestToken }),
    },
  );
  return data.session_id;
}

export async function deleteSession(sessionId: string): Promise<boolean> {
  try {
    const data = await fetchTMDBClient<{ success: boolean }>(
      "/authentication/session",
      {},
      {
        method: "DELETE",
        body: JSON.stringify({ session_id: sessionId }),
      },
    );
    return data.success;
  } catch {
    return false;
  }
}

export async function getAccountDetails(
  sessionId: string,
  signal?: AbortSignal,
): Promise<TMDBAccount> {
  return fetchTMDBClient<TMDBAccount>(
    "/account",
    {
      session_id: sessionId,
    },
    { signal },
  );
}
