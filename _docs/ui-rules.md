# UI Rules – Sokol Skuhrov Static Site

This document defines the core design principles, layout rules, component patterns, accessibility, and content behaviors for the new static site. It aligns with the current public website design and structure while adding proper responsiveness and maintainability for a Next.js (App Router) + Tailwind + shadcn/ui stack.

Reference sources:

- Project: see `_docs/project-overview.md`, `_docs/user-flow.md`, `_docs/tech-stack.md`
- Current public website (visual baseline and IA): [`https://www.sokolskuhrov.cz/`](https://www.sokolskuhrov.cz/)

---

## Goals and Scope

- Preserve the existing visual identity, structure, and tone of the current site while modernizing for responsiveness and accessibility.
- Keep the UI simple, readable, and editorial/content‑first to reflect posts and photo content.
- Minimize ongoing maintenance and reduce custom one‑off UI flourishes that are hard to replicate in Markdown/CMS.

Non‑goals (initially): site search, heavy animations, complex dynamic effects (glass/neumorphism), dark mode.

---

## Information Architecture

- Primary navigation:
  - Domů, Činnost, Akce (News), Fotogalerie, Sponzoři, Kontakty, Lyžaři (if retained)
- URL structure mirrors current sections; news posts have stable permalinks.
- News list is reverse‑chronological; each item links to a detail page.
- Gallery contains external links (e.g., Rajče) rather than embedded galleries.

---

## Layout and Responsiveness

- Containers:
  - Content pages: centered, `max-w-screen-lg` for prose; `max-w-screen-xl` for media grids.
  - Side gutters: responsive padding (`px-4 sm:px-6 md:px-8`).
- Grid:
  - Single column for prose on mobile; optional two‑column only at `lg+` for specific layouts.
  - Cards and grids (news list, sponsors) use responsive grid columns: `1 → 2@md → 3@lg` when space allows.
- Breakpoints (Tailwind defaults): `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`.
- Line length: aim for 60–75 characters for body copy; avoid edge‑to‑edge text.
- Vertical rhythm: consistent spacing scale (4/8px step); avoid one‑off margins.

---

## Navigation, Header, and Footer

- Header:
  - Left: logo/name; Right: primary nav links.
  - Mobile: collapsed into a simple menu (disclosure/hamburger) with large tap targets.
  - Sticky header allowed; keep height compact; visible focus styles on all links.
- Footer:
  - Simple single‑row footer with organization info and useful links.
  - Match neutral surface; smaller type; clear contrast for links.
- Link behavior:
  - Underlined or clearly styled links; consistent hover/active states; visited state visible for long lists.

---

## Typography

- System font stack initially for performance and familiarity.
- Type scale (approximate; concrete tokens in `theme-rules.md`):
  - H1 (page title), H2 (section), H3 (subsection), body, small/meta.
- Weight:
  - Headings: medium/semibold; body: regular; metadata (date/category): regular/small caps avoided.
- Readability:
  - Relaxed line height for body; higher contrast for headings; avoid justified text.

---

## Color and Surfaces

- Base surfaces: white background, neutral separators (subtle borders).
- Accent: brand primary derived from the current site (red); used for links, key accents, and actions.
- Avoid heavy gradients, overlays, and blur effects.
- All specific tokens (brand, neutrals, states) are defined in `theme-rules.md`.

---

## Imagery

- Use `next/image` with defined aspect ratios to prevent CLS:
  - News list thumbnails: 4:3 or 3:2 crop.
  - News detail hero (optional): 16:9.
  - Sponsor logos: contained within tiles, preserved aspect ratio on neutral surface.
- Provide descriptive `alt` text; avoid text‑in‑images for key information.

---

## Components (shadcn/ui + Tailwind patterns)

- Link: textual, high‑contrast default; underline on hover; visited style enabled.
- Button: primary (brand), secondary (neutral), subtle (ghost); clear disabled state; high‑contrast focus ring.
- Card: light border + `shadow-sm` only; spacious padding; optional media top.
- Badge: for dates/categories; subtle neutral background, readable contrast; pill radii.
- Navbar: responsive list of links; active item emphasis via color and/or underline.
- Footer: low‑contrast neutral background, 1px border top; small type; accessible link colors.
- Input/Select/Textarea: 1px neutral border, focus ring using brand token; large enough touch targets.

---

## Content Patterns

- Home:
  - Short intro, latest news (3–6 items), quick link blocks to key sections.
- News list (Akce):
  - Vertical list or grid of cards; each card shows title, date, optional thumbnail, and excerpt.
  - Pagination or “older posts” link at bottom; no infinite scroll.
- News detail:
  - Title, date, optional hero image, Markdown content; consistent spacing; next/previous links optional.
- Fotogalerie:
  - Grid of items linking to external albums; external link icon optional.
- Sponzoři:
  - Responsive logo grid; uniform tile padding; alt text; optional grouping by tier.
- Kontakty:
  - Organization info, address, contact details; optional map link (external), not embedded.

---

## Accessibility

- Color contrast: WCAG AA minimum (prefer AA+); verify brand color contrast on white.
- Focus visibility: always visible focus rings; do not remove outlines.
- Keyboard:
  - All interactive components operable via keyboard; logical tab order; skip‑to‑content link.
- Semantics:
  - Correct headings hierarchy; `<main>` landmark; `<nav>` with `aria-label`.
- Language:
  - Set `lang="cs"` at the document level; include diacritics correctly in copy.

---

## Performance

- Keep CSS minimal; rely on utilities and tokens; avoid large icon/font packages initially.
- Optimize and constrain image sizes; define explicit width/height/aspect ratios.
- Avoid heavy animations; prefer none or small opacity/transform transitions.

---

## CMS Mapping (Decap)

- Frontmatter fields:
  - `title`, `date`, `image` (optional), `summary` (optional), `slug`.
- Editorial constraints:
  - Limit custom inline HTML; rely on Markdown and predefined short components (e.g., image block, callout if added later).

---

## SEO and Metadata

- Clear `<title>` and description per page/post; Open Graph image on posts if present.
- Proper canonical URLs; structured headings; no duplicate H1s.

---

## What We Deliberately Avoid

- Glassmorphism / heavy blur, Neumorphism, and complex shadows (hard to maintain, poor contrast on content sites).
- Dynamic embeds for galleries; prefer outbound links to keep the site fast and simple.

---

## Validation Checklist (per page)

- Heading hierarchy is correct and scannable.
- Content width and line length are comfortable on all breakpoints.
- Links are distinguishable, with hover/visited states.
- Images have defined dimensions and good alt text.
- Focus styles are visible; keyboard navigation works end‑to‑end.
