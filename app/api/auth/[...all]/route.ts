import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * Route handler for BetterAuth authentication endpoints
 * Handles sign-in, sign-up, sign-out, session retrieval, and OAuth callbacks.
 */
export const { GET, POST } = toNextJsHandler(auth);

