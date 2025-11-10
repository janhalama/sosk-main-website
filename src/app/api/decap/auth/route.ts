/**
 * Decap CMS GitHub OAuth – Auth Endpoint
 * Redirects the browser to GitHub's authorize URL with a CSRF state.
 * The callback is handled by /api/decap/callback.
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
  const url = new URL(request.url);
  const origin = url.origin;
  const clientId = getEnv("GITHUB_CLIENT_ID");
  const callback = `${origin}/api/decap/callback`;
  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", callback);
  authorize.searchParams.set("scope", "repo");
  authorize.searchParams.set("state", state);
  return authorize.toString();
}

export async function GET(request: Request) {
  // Generate CSRF state and store in HTTP-only cookie
  const state = crypto.randomBytes(16).toString("hex");
  const store = cookies();
  store.set("decap_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60, // 10 minutes
  });

  const location = buildAuthorizeUrl(request, state);
  return NextResponse.redirect(location, { status: 302 });
}


