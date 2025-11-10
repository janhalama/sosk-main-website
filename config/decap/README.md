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

## GitHub OAuth (Planned)

Backend: `github` with direct commits to `main` (`publish_mode: simple`).

Environment variables (to be configured in Vercel and locally):
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `ALLOWED_GH_USERS` – comma‑separated GitHub usernames allowed to log in

Next.js API routes (skeleton, not yet implemented):
- `GET /api/decap/auth` – start OAuth flow
- `GET /api/decap/callback` – OAuth callback; validate `ALLOWED_GH_USERS`
- `POST /api/decap/token` – exchange code for token (server‑side), return to CMS

`public/admin/config.yml` will reference these when implemented:
```yaml
backend:
  name: github
  # base_url: /api/decap
  # auth_endpoint: /auth
```

## Media

- Uploaded assets are stored inside the repository under `public/images/uploads`.
- Public URLs resolve via `/images/uploads/...`.


