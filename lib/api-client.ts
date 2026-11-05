import { authClient } from "./auth-client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

let inMemoryJwt: string | null = null;

/**
 * Exchange the active BetterAuth session for an Express backend JWT token.
 * Passes the sessionToken to the backend POST /jwt endpoint which verifies
 * the authentic session in the MongoDB database before signing a JWT.
 */
export async function getBackendJwt(): Promise<string | null> {
  if (typeof window === "undefined") {
    return null;
  }

  // 1. Return cached in-memory or localStorage token if present
  if (inMemoryJwt) {
    return inMemoryJwt;
  }

  const storedJwt = localStorage.getItem("booknook_jwt");
  if (storedJwt) {
    inMemoryJwt = storedJwt;
    return storedJwt;
  }

  try {
    // 2. Retrieve active BetterAuth session
    const sessionResult = await authClient.getSession();
    const sessionToken = sessionResult?.data?.session?.token;

    if (!sessionToken) {
      return null;
    }

    // 3. Exchange BetterAuth sessionToken for backend JWT
    const response = await fetch(`${API_BASE_URL}/jwt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionToken }),
    });

    if (!response.ok) {
      console.warn("Failed to exchange BetterAuth session for backend JWT");
      return null;
    }

    const data = await response.json();
    if (data.token) {
      inMemoryJwt = data.token;
      localStorage.setItem("booknook_jwt", data.token);
      return data.token;
    }
  } catch (error) {
    console.error("Error exchanging session for backend JWT:", error);
  }

  return null;
}

/**
 * Clear the stored JWT on sign out
 */
export function clearBackendJwt() {
  inMemoryJwt = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("booknook_jwt");
  }
}

/**
 * Standard fetch wrapper for backend API requests.
 * Automatically injects the Authorization: Bearer <jwt> header for protected routes.
 */
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null; status: number }> {
  try {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    // Attach JWT if available
    const token = await getBackendJwt();
    if (token && !headers.Authorization) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const isJson = response.headers.get("content-type")?.includes("application/json");
    const responseData = isJson ? await response.json() : null;

    if (!response.ok) {
      return {
        data: null,
        error: responseData?.message || `Request failed with status ${response.status}`,
        status: response.status,
      };
    }

    return {
      data: responseData as T,
      error: null,
      status: response.status,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error?.message || "Network request failed",
      status: 500,
    };
  }
}

