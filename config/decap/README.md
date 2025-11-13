# Decap CMS Config

Configuration for Decap CMS (collections, media folder, slug rules).

The CMS backend will use GitHub OAuth per `_docs/tech-stack.md` and `todo.md`.

## Files

- `public/admin/index.html`: SPA bootstrap that loads Decap from CDN.
- `public/admin/config.yml`: GitHub backend, media folders, collections:
  - `posts` in `content/posts` (fields: `title`, `date`, `image?`, `summary?`, `body`)
  - `pages` mapped to files in `content/pages/*`

## Local Development

`config.yml` enables `local_backend: true`, allowing editors to run without OAuth:

```bash
npx decap-server
# or: npx decap-cms-proxy-server
```

Then open `/admin` on `http://localhost:3000`.

## GitHub OAuth (Implemented)

Backend: `github` with direct commits to `main` (`publish_mode: simple`).

Environment variables (configured in Vercel and locally):
- `OAUTH_CLIENT_ID` – GitHub OAuth app client ID
- `OAUTH_CLIENT_SECRET` – GitHub OAuth app client secret
- `ALLOWED_GH_USERS` – comma‑separated GitHub usernames allowed to log in

Next.js API routes (implemented):
- `GET /api/cms/auth` – start OAuth flow, redirects to GitHub
- `GET /api/cms/callback` – OAuth callback; exchanges code for token, validates `ALLOWED_GH_USERS`

`public/admin/config.yml` references these via rewrites in `next.config.ts`:
```yaml
backend:
  name: github
  base_url: <dynamically set by /api/admin/config>
  auth_endpoint: auth  # rewrites to /api/cms/auth
```

## Media

- Uploaded assets are stored inside the repository under `public/images/uploads`.
- Public URLs resolve via `/images/uploads/...`.


