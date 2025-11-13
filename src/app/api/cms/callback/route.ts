/**
 * CMS GitHub OAuth – Callback Endpoint
 * Exchanges ?code for an access token, validates the user against ALLOWED_GH_USERS,
 * and returns a small HTML page that posts the token to the opener (CMS).
 */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env: ${name}`);
  return value;
}

async function exchangeCodeForToken(code: string): Promise<string> {
  const clientId = getEnv("OAUTH_CLIENT_ID");
  const clientSecret = getEnv("OAUTH_CLIENT_SECRET");
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  });
  
  const data = (await response.json()) as { 
    access_token?: string; 
    error?: string; 
    error_description?: string;
    error_uri?: string;
  };
  
  if (!response.ok || !data.access_token) {
    const errorMsg = data.error_description || data.error || `HTTP ${response.status}`;
    throw new Error(`GitHub token exchange failed: ${errorMsg}`);
  }
  
  return data.access_token;
}

async function getGithubLogin(accessToken: string): Promise<string> {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
    },
    cache: "no-store",
  });
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`GitHub user lookup failed: ${response.status} ${errorText || ""}`);
  }
  
  const user = (await response.json()) as { login?: string };
  if (!user.login) {
    throw new Error("GitHub user login missing in API response.");
  }
  
  return user.login;
}

function isAllowedUser(login: string): boolean {
  const allowed = getEnv("ALLOWED_GH_USERS")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return allowed.length === 0 ? false : allowed.includes(login.toLowerCase());
}

function buildSuccessHtml(token: string, redirectUrl: string): string {
  // CMS expects the message in format: 'authorization:github:success:{"token":"..."}'
  const payload = JSON.stringify({ token });
  const msg = `authorization:github:success:${payload}`;
  return `<!doctype html>
<html><head><meta charset="utf-8" /><title>Authorized</title></head>
<body>
<script>
(function() {
  try {
    var msg = ${JSON.stringify(msg)};
    var redirectUrl = ${JSON.stringify(redirectUrl)};
    var token = ${JSON.stringify(token)};
    
    // Try postMessage first (if this is a popup)
    if (window.opener && !window.opener.closed) {
      var origin = window.location.origin;
      
      // Send to same origin first
      window.opener.postMessage(msg, origin);
      // Also try wildcard in case origin doesn't match
      window.opener.postMessage(msg, '*');
      
      // Also try storing in localStorage as fallback
      try {
        window.opener.localStorage.setItem('netlify-cms-user', JSON.stringify({
          token: token,
          backend: 'github'
        }));
      } catch (e) {
        // Silently fail if localStorage is not accessible
      }
      
      setTimeout(function() {
        window.close();
      }, 1000);
    } else {
      // Fallback: store in localStorage and redirect
      localStorage.setItem('netlify-cms-user', JSON.stringify({
        token: token,
        backend: 'github'
      }));
      window.location.href = redirectUrl;
    }
  } catch (e) {
    document.body.innerHTML = '<p>Error: ' + e.message + '</p>';
  }
})();
</script>
</body></html>`;
}

function buildErrorHtml(errorMessage: string): string {
  const payload = JSON.stringify({ message: errorMessage });
  return `<!doctype html>
<html><head><meta charset="utf-8" /><title>Authorization Error</title></head>
<body>
<script>
(function() {
  var msg = 'authorization:github:error:' + ${JSON.stringify(payload)};
  if (window.opener) {
    window.opener.postMessage(msg, '*');
    window.close();
  } else {
    document.body.innerText = 'Authorization error: ' + ${JSON.stringify(errorMessage)};
  }
})();
</script>
</body></html>`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  
  try {
    const code = url.searchParams.get("code") || "";
    const returnedState = url.searchParams.get("state") || "";
    const errorParam = url.searchParams.get("error");

    // Handle GitHub OAuth errors
    if (errorParam) {
      const errorDescription = url.searchParams.get("error_description") || errorParam;
      return new NextResponse(buildErrorHtml(`OAuth error: ${errorDescription}`), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
        status: 400,
      });
    }

    // Validate required parameters
    if (!code) {
      return new NextResponse(buildErrorHtml("Missing ?code param."), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
        status: 400,
      });
    }

    // Get and validate state cookie
    const store = await cookies();
    const savedState = store.get("cms_oauth_state")?.value || "";
    // Invalidate state cookie eagerly
    store.set("cms_oauth_state", "", { httpOnly: true, maxAge: 0, path: "/" });

    if (!savedState || returnedState !== savedState) {
      return new NextResponse(
        buildErrorHtml("Invalid OAuth state. Please try logging in again."),
        {
          headers: { "Content-Type": "text/html; charset=utf-8" },
          status: 400,
        }
      );
    }

    // Exchange code for token
    const token = await exchangeCodeForToken(code);
    
    // Get GitHub user login
    const login = await getGithubLogin(token);
    
    // Validate user is allowed
    if (!isAllowedUser(login)) {
      return new NextResponse(
        buildErrorHtml(`User "${login}" is not allowed. Please contact the administrator.`),
        {
          headers: { "Content-Type": "text/html; charset=utf-8" },
          status: 403,
        }
      );
    }

    // Success - return token to CMS
    const redirectUrl = `${url.origin}/admin`;
    return new NextResponse(buildSuccessHtml(token, redirectUrl), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
      status: 200,
    });
  } catch (error) {
    // Improved error handling with more context
    let message = "Unknown error";
    if (error instanceof Error) {
      message = error.message;
      // Check for common error patterns
      if (message.includes("Missing required env")) {
        message = `${message}. Please check your environment variables.`;
      } else if (message.includes("GitHub token exchange")) {
        message = `${message}. Verify your OAuth app callback URL matches: ${url.origin}/callback`;
      }
    }
    
    // Log error for debugging (in production, this would go to logs)
    console.error("CMS callback error:", error);
    
    return new NextResponse(buildErrorHtml(message), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
      status: 500,
    });
  }
}


