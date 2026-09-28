/**
 * Paradize — Server-side Session Helper
 *
 * Extracts the authenticated user from the request headers
 * by calling Better Auth's session endpoint. Use this in all
 * API routes to verify authentication and get the real user ID
 * instead of trusting client-provided IDs.
 */

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export interface AuthSession {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
  session: {
    id: string;
    expiresAt: Date;
  };
}

/**
 * Get the authenticated session from the current request.
 * Returns null if the user is not authenticated.
 */
export async function getServerSession(): Promise<AuthSession | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return null;
    }

    return session as AuthSession;
  } catch (error) {
    console.error("Session verification failed:", error);
    return null;
  }
}

/**
 * Require authentication — returns session or throws a 401 response.
 * Use in API routes where authentication is mandatory.
 */
export async function requireAuth(): Promise<AuthSession> {
  const session = await getServerSession();
  if (!session) {
    throw new Response(
      JSON.stringify({ error: "Authentication required" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
  return session;
}
