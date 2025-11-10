/**
 * Decap CMS GitHub OAuth – Callback Endpoint
 * Exchanges ?code for an access token, validates the user against ALLOWED_GH_USERS,
 * and returns a small HTML page that posts the token to the opener (Decap CMS).
 */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env: ${name}`);
  return value;
}

async function exchangeCodeForToken(code: string): Promise<string> {
  const clientId = getEnv("GITHUB_CLIENT_ID");
  const clientSecret = getEnv("GITHUB_CLIENT_SECRET");
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  });
  if (!response.ok) {
    throw new Error(`GitHub token exchange failed with ${response.status}`);
  }
  const data = (await response.json()) as { access_token?: string; error?: string };
  if (!data.access_token) {
    throw new Error(`GitHub token missing: ${data.error || "unknown error"}`);
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
  if (!response.ok) throw new Error(`GitHub user lookup failed: ${response.status}`);
  const user = (await response.json()) as { login?: string };
  if (!user.login) throw new Error("GitHub user login missing.");
  return user.login;
}

function isAllowedUser(login: string): boolean {
  const allowed = getEnv("ALLOWED_GH_USERS")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return allowed.length === 0 ? false : allowed.includes(login.toLowerCase());
}

function buildSuccessHtml(token: string): string {
  const payload = JSON.stringify({ token });
  // Decap listens for postMessage with this convention for GitHub success:
  // 'authorization:github:success:{"token":"..."}'
  return `<!doctype html>
<html><head><meta charset="utf-8" /><title>Authorized</title></head>
<body>
<script>
(function() {
  var msg = 'authorization:github:success:' + ${JSON.stringify(payload)};
  if (window.opener) {
    window.opener.postMessage(msg, '*');
    window.close();
  } else {
    document.body.innerText = 'Token received. Please close this window.';
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
  const code = url.searchParams.get("code") || "";
  const returnedState = url.searchParams.get("state") || "";

  const store = cookies();
  const savedState = store.get("decap_oauth_state")?.value || "";
  // Invalidate state cookie eagerly
  store.set("decap_oauth_state", "", { httpOnly: true, maxAge: 0, path: "/" });

  if (!code) {
    return new NextResponse(buildErrorHtml("Missing ?code param."), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
      status: 400,
    });
  }
  if (!savedState || returnedState !== savedState) {
    return new NextResponse(buildErrorHtml("Invalid OAuth state."), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
      status: 400,
    });
  }

  try {
    const token = await exchangeCodeForToken(code);
    const login = await getGithubLogin(token);
    if (!isAllowedUser(login)) {
      return new NextResponse(buildErrorHtml("User is not allowed."), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
        status: 403,
      });
    }
    return new NextResponse(buildSuccessHtml(token), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new NextResponse(buildErrorHtml(message), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
      status: 500,
    });
  }
}


