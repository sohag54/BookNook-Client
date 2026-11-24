import { NextRequest } from "next/server";

/**
 * First-party Reverse Proxy for Better Auth Authentication Endpoints.
 *
 * Forwards /api/auth/* requests from the Next.js frontend to the Express backend
 * on Render where MongoDB Atlas connectivity is active.
 *
 * Preserves:
 * 1. Complete request path & query parameters.
 * 2. Critical client headers (Cookie, Content-Type, Accept, Authorization, Origin).
 * 3. Exact request payload (arrayBuffer).
 * 4. All response status codes, bodies, and individual Set-Cookie headers.
 * 5. First-party cookie isolation on the frontend domain.
 */

const BACKEND_BASE_URL = (
  process.env.BACKEND_AUTH_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://booknook-server-1-gmhv.onrender.com"
).replace(/\/$/, "");

async function proxyAuthRequest(req: NextRequest): Promise<Response> {
  const incomingUrl = new URL(req.url);

  // Preserve complete path and query string under /api/auth
  const targetUrl = new URL(
    `${incomingUrl.pathname}${incomingUrl.search}`,
    BACKEND_BASE_URL
  );

  // Forward critical client headers
  const forwardHeaders = new Headers();
  const headersToForward = [
    "accept",
    "authorization",
    "content-type",
    "cookie",
    "user-agent",
    "origin",
    "referer",
  ];

  for (const name of headersToForward) {
    const value = req.headers.get(name);
    if (value) {
      forwardHeaders.set(name, value);
    }
  }

  // Forward standard proxy identification headers
  const clientIp =
    req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip");
  if (clientIp) {
    forwardHeaders.set("x-forwarded-for", clientIp);
  }

  const host = req.headers.get("host");
  if (host) {
    forwardHeaders.set("x-forwarded-host", host);
  }

  const proto =
    req.headers.get("x-forwarded-proto") ||
    incomingUrl.protocol.replace(":", "");
  if (proto) {
    forwardHeaders.set("x-forwarded-proto", proto);
  }

  // Prepare request body for non-GET/HEAD methods
  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const body = hasBody ? await req.arrayBuffer() : undefined;

  try {
    const backendRes = await fetch(targetUrl.toString(), {
      method: req.method,
      headers: forwardHeaders,
      body,
      redirect: "manual",
    });

    // Prepare response headers
    const resHeaders = new Headers();

    const HOP_BY_HOP = new Set([
      "connection",
      "keep-alive",
      "proxy-authenticate",
      "proxy-authorization",
      "te",
      "trailer",
      "transfer-encoding",
      "upgrade",
      "content-encoding",
      "content-length",
    ]);

    backendRes.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (!HOP_BY_HOP.has(lower) && lower !== "set-cookie") {
        resHeaders.set(key, value);
      }
    });

    // Forward Set-Cookie headers individually
    if (typeof backendRes.headers.getSetCookie === "function") {
      const cookies = backendRes.headers.getSetCookie();
      for (const cookie of cookies) {
        resHeaders.append("set-cookie", cookie);
      }
    } else {
      const rawCookie = backendRes.headers.get("set-cookie");
      if (rawCookie) {
        resHeaders.set("set-cookie", rawCookie);
      }
    }

    return new Response(backendRes.body, {
      status: backendRes.status,
      statusText: backendRes.statusText,
      headers: resHeaders,
    });
  } catch (err: unknown) {
    // Generic safe error message without exposing connection details or secrets
    return new Response(
      JSON.stringify({
        message: "Authentication service temporarily unavailable. Please try again.",
      }),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function GET(req: NextRequest) {
  return proxyAuthRequest(req);
}

export async function POST(req: NextRequest) {
  return proxyAuthRequest(req);
}

export async function OPTIONS(req: NextRequest) {
  return proxyAuthRequest(req);
}
