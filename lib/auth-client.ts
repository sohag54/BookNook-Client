import { createAuthClient } from "better-auth/react";

/**
 * BetterAuth React Client
 * Provides reactive hooks and auth helpers for UI components:
 * - useSession() -> { data: sessionData, isPending, error }
 * - signIn.email({ email, password })
 * - signIn.social({ provider: 'google' })
 * - signUp.email({ name, email, password, image })
 * - signOut()
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;

