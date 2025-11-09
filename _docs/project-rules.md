## Project Rules – Sokol Skuhrov AI-first Codebase

This document consolidates the actionable rules that govern our project’s structure, naming, coding standards, UI/theme patterns, content workflow, and tooling. It synthesizes the agreed decisions from `_docs/tech-stack.md`, `_docs/user-flow.md`, `_docs/project-overview.md`, `_docs/ui-rules.md`, and `_docs/theme-rules.md`. These rules are designed to keep the codebase modular, scalable, accessible, and easy to navigate for both humans and AI tooling.

---

## High-level Principles

- Keep the site static, simple, and fast; avoid servers, databases, and runtime dependencies.
- Prefer clarity over cleverness; keep files short, readable, and focused.
- Optimize for contribution: self-explanatory structure, descriptive names, minimal setup.
- Be consistent with Next.js App Router conventions, Tailwind utilities, and shadcn/ui patterns.
- Maintain accessibility, performance, and content-first UX.

Non-goals for launch: site search, dark mode, complex animations, heavy dynamic effects.

---

## Directory Structure

The repo should follow a predictable, discoverable layout. Content is Markdown-first; the site is built statically by Next.js and deployed to Vercel.

```text
.
├─ app/                              # Next.js App Router routes, layouts, and pages
│  ├─ (site)/                        # Route group for public site sections
│  │  ├─ page.tsx                    # Home
│  │  ├─ cinnost/                    # Činnost (static page)
│  │  ├─ akce/                       # News list and posts
│  │  │  ├─ page.tsx                 # News list
│  │  │  └─ [slug]/page.tsx          # News detail
│  │  ├─ fotogalerie/                # Gallery (links to external albums)
│  │  ├─ sponzori/                   # Sponsors
│  │  └─ kontakty/                   # Contact
│  ├─ layout.tsx                     # Root layout (sets lang, metadata shell)
│  └─ globals.css                    # Tailwind base and theme variables (light only)
│
├─ components/                       # Reusable UI components (shadcn/ui + custom)
│  ├─ ui/                            # Wrapped shadcn primitives with our tokens
│  ├─ navigation/                    # Header, Nav, Footer
│  └─ content/                       # Cards, Badges, Media blocks
│
├─ content/                          # Markdown content and media references
│  ├─ pages/                         # Static pages (frontmatter + Markdown)
│  └─ posts/                         # News posts (frontmatter + Markdown)
│
├─ lib/                              # Framework-agnostic utilities (parsing, formatting)
│  ├─ content/                       # gray-matter + remark/rehype helpers
│  └─ seo/                           # basic metadata helpers
│
├─ styles/                           # Theme tokens, CSS layer utilities, and resets
│  └─ theme.css                      # CSS variables matching theme rules
│
├─ public/                           # Static assets served as-is
│  ├─ images/                        # Repo-stored images (thumbnails, logos)
│  └─ admin/                         # Decap CMS SPA
│     ├─ index.html
│     └─ config.yml
│
├─ config/                           # Project-level configuration
│  ├─ decap/                         # CMS collections, editor widgets
│  └─ tailwind/                      # Tailwind config fragments, presets
│
├─ types/                            # Shared TypeScript types and schemas
├─ scripts/                          # One-off maintenance scripts
└─ _docs/                            # Project documentation (this folder)
```

Notes:

- Markdown frontmatter drives lists and routes for news posts; images live in the repo under `public/`.
- Decap CMS is served from `/admin`; it commits Markdown to the repo, triggering a Vercel rebuild.

---

## File Naming & Organization

- Use descriptive, self-explanatory names. Avoid abbreviations.
- Keep each file focused; target ≤ 500 lines per file.
- Place files where readers expect them (components in `components/*`, utilities in `lib/*`, content in `content/*`).
- Routing:
  - Route folders use lowercase/kebab-case (e.g., `fotogalerie`, `sponzori`, `akce`).
  - Page files follow Next.js App Router (`page.tsx`, `layout.tsx`, `loading.tsx` as needed).
- Components:
  - Component files use `PascalCase.tsx` and export named components.
  - Group primitives under `components/ui/*` and site-specific components under `components/*`.
- Utilities and types:
  - Utilities are `kebab-case.ts` with verb-based function names.
  - Prefer named exports; avoid default exports for clarity.
  - Shared types live in `types/*` as `kebab-case.ts`.
- Content:
  - Markdown files use `kebab-case.md` and include required frontmatter.
  - News post slugs mirror filenames.
- Docs:
  - Documentation files live in `_docs/` and begin with a short purpose paragraph.

---

## Coding Conventions (TypeScript, Next.js)

- Functions only; avoid classes. Use the `function` keyword for pure functions.
- Prefer composition and small modules over large, multi-purpose files.
- Avoid enums; use literal unions, records, or maps.
- Throw errors on invalid states; do not silently fall back.
- Use descriptive variable names with auxiliary verbs (e.g., `isLoading`, `hasError`).
- Export types and public APIs with explicit annotations; let locals be inferred when obvious.
- Use early returns to reduce nesting; avoid unnecessary try/catch.
- Comments:
  - Begin each file with a brief explanation of its purpose.
  - Precede each exported function with a short block comment describing what it does and its parameters/returns.
  - Do not comment the obvious; keep comments concise and high-signal.
- Formatting and linting:
  - ESLint (typescript-eslint) + Prettier.
  - Keep Tailwind class lists readable (group logically; avoid duplicates).

---

## UI and Theme Rules (Tailwind, shadcn/ui, Radix)

Follow `_docs/ui-rules.md` and `_docs/theme-rules.md`. Key points:

- Layout:
  - Centered containers; `max-w-screen-lg` for prose, `max-w-screen-xl` for media grids.
  - Comfortable line lengths (≈60–75 chars) and consistent spacing scale (4/8px steps).
- Tokens:
  - Implement CSS variables from theme rules; map into Tailwind config as needed.
  - Light theme only for launch; no dark mode initially.
- Components:
  - Buttons: primary (brand), secondary (neutral), ghost; visible focus rings.
  - Links: clear default/hover/visited states; underline on hover or always in body copy.
  - Cards: subtle border, minimal shadow; generous padding.
  - Inputs: 1px borders, strong focus ring using brand token.
- Motion:
  - Minimal; short durations and transform/opacity only.

---

## Content & CMS (Markdown + Decap)

- Content model:
  - Pages: `content/pages/*.md` with frontmatter.
  - Posts: `content/posts/*.md` with frontmatter fields:
    - `title` (string), `date` (ISO), `image` (optional path under `public/`), `summary` (optional), `slug` (string).
- Editors:
  - Non-technical editors publish via `/admin` (Decap CMS with GitHub OAuth).
  - Technical editors can commit Markdown directly.
- Pipeline:
  - Parse frontmatter with `gray-matter`; render Markdown via `remark/rehype`.
  - `next/image` for all images; define dimensions/aspect ratios to prevent CLS.
- Media:
  - Images stored in the repo under `public/images/`.
  - Gallery entries link to external albums; avoid embedded heavy widgets.

---

## Build, Deploy, and Tooling

- Hosting: Vercel with preview deployments from Git; rely on Vercel checks.
- Framework: Next.js (App Router) with static output where possible.
- Language: TypeScript.
- Lint/format: ESLint + Prettier; no Husky initially.
- Testing: Postpone automated tests initially; add as functionality grows (Vitest/Testing Library, Playwright).
- SEO/metadata: Minimal static `<meta>` in `app/layout.tsx` to start; revisit Metadata API and sitemap later.
- Analytics and monitoring: None initially; consider Vercel Analytics/Plausible and Sentry later.
- Security headers: Rely on Vercel defaults initially; add CSP when needed.

---

## Accessibility (WCAG AA+)

- Visible focus rings; never remove outlines.
- Sufficient color contrast; verify brand on white and neutral surfaces.
- Keyboard operable navigation; logical tab order; skip-to-content link.
- Proper semantics and landmarks; correct heading hierarchy.
- Set document language to Czech (`lang="cs"`).

---

## Performance

- Keep CSS small; rely on Tailwind utilities and theme tokens.
- Optimize images; always provide width/height or aspect ratios.
- Avoid heavy animations, large icon packs, and unnecessary client JS.

---

## SEO and Metadata (Minimal)

- Each page/post should have a clear `<title>` and description.
- Use Open Graph image for posts when available.
- Avoid duplicate H1s; use structured headings.

---

## Internationalization and Language

- Single-language site (Czech) at launch; no i18n library.
- All copy resides in Markdown; keep diacritics correct.

---

## Contribution Checklist

Before opening a PR or publishing content:

- Structure:
  - File is ≤ 500 lines and placed in the correct folder.
  - File begins with a brief purpose explanation.
  - Names are descriptive; exports are named.
- Code:
  - Functions use `function` keyword; no classes/enums.
  - Errors are thrown for invalid states; no hidden fallbacks.
  - Lint and format pass locally.
- UI/UX:
  - Uses theme tokens and Tailwind utilities consistently.
  - Focus styles and contrast validated; keyboard navigation works.
  - Images have defined dimensions and informative `alt` text.
- Content:
  - Frontmatter complete and correct; slug matches filename.
  - Links to galleries are external and clearly indicated if needed.

---

## Revisit Later (Postponed)

- Typed content modeling (Contentlayer).
- Site search (Pagefind/Algolia).
- Next Metadata API and automated sitemap.
- Analytics (Vercel Analytics/Plausible) and error monitoring (Sentry).
- Git hooks and CI expansion (Husky, lint-staged, GitHub Actions).
