Project TODO – Sokol Skuhrov static site

This is the single source of truth for building the project iteratively from barebones setup → MVP → polished. Tasks are grouped by phases and use checkboxes for tracking.

## Phase 01 — Setup (foundation)

- [x] Create Next.js app (App Router, TypeScript) and commit baseline
  - [x] Configure ESLint (typescript-eslint) + Prettier
  - [x] Enable strict TypeScript; no `any`
- [x] Install Tailwind CSS and wire globals
  - [x] Add `app/globals.css` and Tailwind base/utilities
  - [x] Define theme tokens via Tailwind v4 `@theme` inline in `globals.css`
  - [x] Expose semantic tokens (brand/neutral/aliases) via `@theme` (Tailwind v4)
- [ ] Install shadcn/ui + Radix and initialize minimal components
  - [ ] Set up shadcn generator (scoped to `components/ui`)
  - [ ] Generate base Button, Card as starting primitives
- [ ] Establish repository layout (per `_docs/project-rules.md`)
  - [ ] `app/(site)/page.tsx` (Home), `layout.tsx` with `lang="cs"` and base metadata shell
  - [ ] Route folders: `cinnost/`, `akce/`, `fotogalerie/`, `sponzori/`, `kontakty/`
  - [ ] `components/` → `ui/`, `navigation/`, `content/`
  - [ ] `content/` → `pages/`, `posts/`
  - [ ] `lib/` → `content/` helpers, `seo/` helpers
  - [ ] `public/images/` (assets), `public/admin/` (Decap CMS)
  - [ ] `config/decap/` (if extracting CMS config), `types/` for shared types
- [ ] Scaffold navigation and footer
  - [ ] `components/navigation/Header.tsx` with accessible nav
  - [ ] `components/navigation/Footer.tsx` with organization info
  - [ ] Add skip‑to‑content link and visible focus styles
- [ ] Seed content placeholders
  - [ ] `content/pages/{doma,cinnost,fotogalerie,sponzori,kontakty}.md` with minimal copy
  - [ ] `content/posts/` empty folder committed
- [ ] Add basic lib for content parsing
  - [ ] `lib/content/frontmatter.ts` (read/parse Markdown via gray‑matter)
  - [ ] `lib/content/posts.ts` (list/sort posts, slug helpers)
- [ ] Decap CMS skeleton
  - [ ] `public/admin/index.html` (Decap SPA bootstrap)
  - [ ] `public/admin/config.yml` (collections: pages, posts; media folder; slug rules)
  - [ ] Choose GitHub backend; document OAuth flow and envs
- [ ] OAuth plan for Decap (GitHub)
  - [ ] Prepare Next.js API routes for Decap OAuth (serverless) or external OAuth service
  - [ ] Environment variables: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `ALLOWED_GH_USERS`
- [ ] Vercel project setup
  - [ ] Connect repository, set build settings (defaults OK)
  - [ ] Configure environment variables (preview + production)
  - [ ] First successful deploy (home page + /admin loads CMS shell)
- [ ] Repository hygiene
  - [ ] `.gitignore`, `README.md` (setup, content editing, deploy)
  - [ ] Add `_docs/` link and contribution tips

## Phase 02 — MVP (feature complete for launch)

- [ ] Finalize content model and frontmatter
  - [ ] Pages: title, summary (optional)
  - [ ] Posts: `title` (string), `date` (ISO), `image` (optional path), `summary` (optional), `slug`
  - [ ] Validate `slug` mirrors filename; Czech diacritics handled in slugify
- [ ] Complete lib/content pipeline
  - [ ] `getAllPosts()` sorted by date desc
  - [ ] `getPostBySlug(slug)` with robust errors
  - [ ] `getPageById(id)` for static pages
  - [ ] Markdown → HTML via remark/rehype; sanitize and allow basic markup
- [ ] Routes and pages
  - [ ] Home (`/(site)/page.tsx`): intro + latest 3–6 posts
  - [ ] Akce list (`/akce/page.tsx`): card/grid, date, optional thumbnail, excerpt
  - [ ] Akce detail (`/akce/[slug]/page.tsx`): title, date, hero image (optional), content
  - [ ] Činnost (`/cinnost/page.tsx`): static Markdown
  - [ ] Fotogalerie (`/fotogalerie/page.tsx`): external links grid (Rajče etc.)
  - [ ] Sponzoři (`/sponzori/page.tsx`): responsive logo grid
  - [ ] Kontakty (`/kontakty/page.tsx`): organization/contact info; external map link (no embed)
- [ ] Components (accessible, tokenized)
  - [ ] `PostCard`, `Badge` for date/category, `GalleryItem`, `SponsorTile`
  - [ ] Refine `Header` active state + focus management; `Footer` links
- [ ] Images and performance
  - [ ] Use `next/image` with width/height/aspect to prevent CLS
  - [ ] Place assets under `public/images/*`; add a few sample thumbs
- [ ] Accessibility pass (AA baseline)
  - [ ] Correct heading hierarchy and landmarks
  - [ ] Keyboard nav, visible focus rings, skip link
  - [ ] `lang="cs"` on root; alt text for images
- [ ] Decap CMS – working editorial flow
  - [ ] `config.yml` collections: `posts` (fields), `pages` (mapped files)
  - [ ] Media folder path and public URL verified
  - [ ] Preview paths configured (list/detail)
  - [ ] GitHub backend + OAuth endpoint wired to Next.js API route (or external service)
  - [ ] Restrict access via `ALLOWED_GH_USERS`
  - [ ] Validate end‑to‑end: login → create/edit → publish → Vercel rebuild → site updated
- [ ] SEO (minimal)
  - [ ] Per‑page `<title>` and description
  - [ ] OG image on posts when `image` provided
- [ ] MVP deploy
  - [ ] Production deploy on Vercel
  - [ ] Final content import (initial pages + a few posts)

## Phase 03 — Polish & Enhancements (nice‑to‑have for stability and UX)

- [ ] Theme refinement
  - [ ] Match brand red precisely; audit contrast on white and neutral surfaces
  - [ ] Normalize spacing, radii, and borders per `_docs/theme-rules.md`
- [ ] UX improvements
  - [ ] Visited state for long lists; external‑link icon on gallery items
  - [ ] “Older posts” link or simple pagination on Akce list
  - [ ] Optional sponsor tier grouping and ordering
- [ ] Robustness
  - [ ] Custom 404 page
  - [ ] Lightweight error boundary UI for unexpected client errors (non‑blocking)
- [ ] Performance pass
  - [ ] Verify bundle size (min client JS), CSS size, and image weight
  - [ ] Ensure no layout shifts; check responsive breakpoints
- [ ] Documentation
  - [ ] Editor guide (how to add/edit posts with images, slugs, dates)
  - [ ] Maintainer notes (updating tokens, adding routes, troubleshooting builds)
- [ ] Optional operational niceties
  - [ ] `robots.txt` (static) and simple sitemap (optional static)
  - [ ] Add small GitHub Action workflow for `tsc --noEmit` and `eslint`
  - [ ] Optional analytics (Vercel Analytics or Plausible) — only if requested
  - [ ] Optional error monitoring (Sentry) — only if needed

## Backlog / Postponed (revisit later per `_docs/tech-stack.md`)

- [ ] Typed content modeling with Contentlayer
- [ ] Site search (Pagefind or Algolia)
- [ ] Next.js Metadata API + `next-sitemap`
- [ ] Icon library and `next/font` integration
- [ ] Custom security headers / CSP (`headers()` or `vercel.json`)
- [ ] Test setup (Vitest/Testing Library, Playwright)
- [ ] Git hooks (Husky/lint-staged) and broader CI (GitHub Actions)
