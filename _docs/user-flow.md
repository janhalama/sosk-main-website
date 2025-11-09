## User Flow – Sokol Skuhrov Website

This document maps the confirmed user journeys across the website based strictly on the current project overview. It identifies actors, entry points, flows, and how actions connect to deployment behavior. Open questions are listed for clarification before implementation.

### Actors

- **Visitor**: Public user browsing the static website.
- **Admin (Non‑technical)**: Editor using the `/admin` interface (Decap CMS) with GitHub OAuth.
- **Admin (Technical)**: Contributor editing Markdown directly in the repository.
- **System**: Automation reacting to repository changes and deploying via Vercel/CDN.

### Public Site Structure (Visitor)

- **Primary sections**: Domů (Home), Činnost, Akce (News), Fotogalerie, Sponzoři, Kontakty.
- **Content characteristics**: All pages are static and served from CDN; News list is reverse‑chronological and each item links to a static detail page; Gallery entries are external links to third‑party albums (e.g., Rajče).
- **Authentication**: None for visitors; no public interactive features.

## Visitor Journeys

### Browse the site

- **Entry points**: Any public URL (e.g., Home).
- **Navigate**: Use site navigation to reach Domů, Činnost, Akce, Fotogalerie, Sponzoři, Kontakty.
- **System behavior**: Static HTML served instantly from CDN.

### Read news

- **Entry**: Navigate to Akce.
- **View**: See pre‑rendered list of Markdown posts in reverse chronological order.
- **Open detail**: Click a list item to view its detail page.
- **System behavior**: Both list and detail pages are static, pre‑rendered from Markdown; no login, no client‑side mutations required.

### View gallery

- **Entry**: Navigate to Fotogalerie.
- **View**: See a static page and follow links to external albums when present.
- **System behavior**: Static page on site; outbound navigation for external albums.

### View sponsors and contact

- **Entry**: Navigate to Sponzoři or Kontakty.
- **View**: Read static content.
- **System behavior**: Static HTML served from CDN.

## Admin (Non‑technical) Journeys – via `/admin` (Decap CMS)

### Log in

- **Entry**: Open `/admin`.
- **Authenticate**: Log in with GitHub OAuth.
- **Result**: Access the CMS UI.

### Content managed via CMS

- All top‑level pages and news posts are editable: Domů, Činnost, Akce (posts), Fotogalerie (external link entries), Sponzoři, Kontakty.

### Create a news post

- **Start**: In CMS, choose to add a post.
- **Edit**: Fill fields (title, date, image, body text) in form‑based UI.
- **Slug/URL**: A permalink is generated for the post’s detail page.
- **Publish**: Click “Publish”.
- **System behavior**: CMS commits a Markdown file to the repository main branch → Vercel triggers a rebuild → updated static site is deployed to CDN.

### Edit an existing news post

- **Start**: In CMS, open an existing post.
- **Edit**: Update fields (title, date, image, body text).
- **Publish**: Click “Publish”.
- **System behavior**: Commit to repository → Vercel rebuild → CDN serves updated static pages.

## Admin (Technical) Journeys – via Git

### Update content directly

- **Start**: Open repository.
- **Edit**: Modify Markdown content (pages or posts) locally.
- **Review**: Optionally use pull requests for review/approval.
- **Commit**: Merge to main.
- **System behavior**: Vercel rebuilds the static site and deploys to CDN.

## System Flow (Automation)

### Continuous deployment

- **Trigger**: Any content change committed to the repository (via CMS or direct commit).
- **Build**: Vercel builds the static site.
- **Deploy**: New static assets served via CDN.
- **Outcome**: Visitors see updated content after deployment completes.

## Connections Between Segments

- **Admin actions → Visitor experience**: When Admins publish or commit content, the site rebuilds and Visitors see the updated static pages.
- **Gallery external links**: Gallery entries are external links only; viewing albums occurs off‑site.
- **Single source of truth**: Markdown files in the repository back both the public site and the CMS editing experience.

## Constraints and Non‑Goals (Confirmed)

- **No public authentication**: Visitors do not log in; there are no interactive public features.
- **No dynamic runtime dependencies**: No server/database; content is pre‑rendered.
- **Low maintenance**: Git‑based content workflow with automated rebuilds on change.
- **Localization**: Czech language only.
- **Media storage**: Images are stored in the repository.
- **Admin access control**: Allowed GitHub accounts are configured via environment variable.
- **Redirects**: No redirects from legacy WordPress URLs are required.
- **Editorial workflow**: Non‑technical editors publish directly to `main`; no reviews required.
