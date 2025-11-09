## Tech Stack Decisions – Sokol Skuhrov

This document records stack decisions for the static, git-based site described in `project-overview.md` and the flows in `user-flow.md`. It highlights the chosen option and a popular alternative for each layer. Items marked Pending are recommended defaults we can confirm or change together.

---

### Hosting / CDN / Deploy

- Decision: Vercel (Chosen)
- Alternative: Netlify
- Notes: Zero-config from Git, preview deployments, global CDN. Matches static site and rebuild-on-commit flow.

### Web Framework

- Decision: Next.js (App Router) (Chosen)
- Alternative: Astro
- Notes: SSG-first, file-based routing, images/metadata built-in. Aligns with static output and simple navigation.

### Language

- Decision: TypeScript (Chosen)
- Alternative: JavaScript with JSDoc
- Notes: Improves maintainability and editor safety for a long-lived volunteer-maintained project.

### Styling and UI Components

- Decision: Tailwind CSS + shadcn/ui + Radix Primitives (Chosen)
- Alternative: CSS Modules + PostCSS + Headless UI
- Notes: Accessible primitives, ergonomic utilities, small CSS, consistent design tokens.

### CMS (Git-backed)

- Decision: Decap CMS with GitHub backend (Chosen)
- Alternative: TinaCMS
- Notes: Non‑technical editors publish via `/admin`; commits trigger rebuilds. Matches Git-first workflow.

### Package Manager

- Decision: npm (Chosen)
- Alternative: pnpm
- Notes: Default on Vercel, simple CI caching, ubiquitous tooling support.

---

### Content Format & Pipeline

- Decision: gray-matter + remark/rehype (Chosen – minimal)
- Alternative: Contentlayer
- Notes: Smallest dependency surface; straightforward Markdown/frontmatter parsing. Revisit Contentlayer if typed content modeling becomes necessary.

### Images & Media

- Decision: next/image with assets in `public/` (Chosen)
- Alternative: Cloudinary (hosted media and transforms)
- Notes: Repo-stored images per constraints; Vercel optimizes at the edge. Cloudinary only if repo size or transforms become an issue.

### Search (Optional)

- Decision: None initially (Chosen)
- Alternative: Pagefind (static client-side)
- Notes: No search at launch. Add Pagefind only if site search is requested. No Algolia.

### SEO & Metadata

- Decision: Minimal static `<meta>` in `app/layout.tsx` (Chosen) — no Metadata API, no `next-sitemap` initially
- Alternative: Next.js Metadata API + `next-sitemap`
- Notes: Keep SEO simple; revisit Metadata API and automated sitemap later if needed.

### Analytics

- Decision: None initially (Chosen)
- Alternative: Vercel Web Analytics (or Plausible)
- Notes: Add analytics only if requested later.

### Error Monitoring

- Decision: Skip initially (Chosen)
- Alternative: Sentry
- Notes: Static site surface is small; add Sentry later if issues arise.

### Testing

- Decision: Postpone automated tests initially (Chosen)
- Alternative: Vitest + Testing Library; Playwright for E2E
- Notes: Add basic unit tests and E2E only when functionality grows.

### Linting, Formatting, Git Hooks

- Decision: ESLint (typescript-eslint) + Prettier only (Chosen) — no Husky initially
- Alternative: Biome (linter+formatter) or add Husky + lint-staged later
- Notes: Keep tooling minimal; expand if contribution volume increases.

### CI Checks (Build stays on Vercel)

- Decision: Rely on Vercel checks only (Chosen)
- Alternative: GitHub Actions for typecheck/lint/tests later
- Notes: Minimize CI setup; enable Actions when needed.

### Sitemap & Robots

- Decision: None initially (Chosen) — optional static `robots.txt` later
- Alternative: `next-sitemap`
- Notes: Add sitemap automation only if needed for SEO.

### Icons & Fonts

- Decision: System font stack; no icon library initially (Chosen)
- Alternative: Lucide icons + `next/font` (Google)
- Notes: Start with defaults; add icons/fonts when design calls for them.

### Security Headers

- Decision: Defer; rely on Vercel defaults initially (Chosen)
- Alternative: Next.js `headers()` or project-level `vercel.json` headers
- Notes: Add CSP and other headers later if requirements tighten.

### Internationalization

- Decision: Single-language (Czech) site, no i18n library (Chosen)
- Alternative: `next-intl` if localization is added later
- Notes: All copy in Markdown/content; simplifies routing and build.

### Accessibility

- Decision: Semantic HTML and manual checks initially (Chosen)
- Alternative: Add automated a11y checks (Testing Library/axe) later
- Notes: Keep initial scope light; ensure basic keyboard navigation and contrast.

---

## Revisit Later (Postponed)

- Adopt Contentlayer for typed content modeling (if needed)
- Add Pagefind search or Algolia
- Enable Next Metadata API and `next-sitemap`
- Turn on analytics (Vercel Analytics or Plausible)
- Add Sentry error monitoring
- Stand up Vitest/Playwright test setup
- Introduce Husky/lint-staged or switch to Biome
- Add GitHub Actions for PR checks
- Add icon library and `next/font`
- Configure custom security headers/CSP
