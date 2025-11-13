/**
 * CMS GitHub OAuth – Auth Endpoint
 * Redirects the browser to GitHub's authorize URL with a CSRF state.
 * The callback is handled by /api/cms/callback.
 */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "node:crypto";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env: ${name}`);
  return value;
}

function buildAuthorizeUrl(request: Request, state: string): string {
  let origin: string;
  
  if (process.env.NODE_ENV === "production") {
    // Prefer VERCEL_URL if available
    if (process.env.VERCEL_URL) {
      origin = `https://${process.env.VERCEL_URL}`;
    } else if (process.env.NEXT_PUBLIC_SITE_URL) {
      origin = process.env.NEXT_PUBLIC_SITE_URL;
    } else if (process.env.ORIGIN) {
      origin = process.env.ORIGIN;
      if (!origin.startsWith("http://") && !origin.startsWith("https://")) {
        origin = `https://${origin}`;
      }
    } else {
      origin = new URL(request.url).origin;
    }
  } else {
    origin = process.env.ORIGIN || new URL(request.url).origin;
    if (origin && !origin.startsWith("http://") && !origin.startsWith("https://")) {
      origin = `http://${origin}`;
    }
  }
  
  const clientId = getEnv("OAUTH_CLIENT_ID");
  const callback = process.env.COMPLETE_URL || `${origin}/callback`;
  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", callback);
  // public_repo scope is REQUIRED - Decap CMS needs to commit files via GitHub API
  // Without a scope, we can only read user info, not commit to repositories
  // public_repo grants read/write access to public repositories only (minimal scope needed)
  // The user must have write access to the repository branch (main) for commits to succeed
  // Note: GitHub has deprecated public_repo but it still works. If it stops working, we'd need "repo" scope
  authorize.searchParams.set("scope", "public_repo");
  authorize.searchParams.set("state", state);
  return authorize.toString();
}

export async function GET(request: Request) {
  // Generate CSRF state and store in HTTP-only cookie
  const state = crypto.randomBytes(16).toString("hex");
  const store = await cookies();
  store.set("cms_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60, // 10 minutes
  });

  const location = buildAuthorizeUrl(request, state);
  return NextResponse.redirect(location, { status: 302 });
}


