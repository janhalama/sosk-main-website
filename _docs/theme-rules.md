# Theme Rules – Sokol Skuhrov Static Site

This document defines the visual theme tokens (colors, typography, spacing, radii, shadows, borders), responsive rules, and core component styles. It is designed to closely match the current public website’s look while improving responsiveness and accessibility. These tokens should be reflected in Tailwind config, CSS variables, and shadcn/ui themes.

Reference sources:

- Project: see `_docs/project-overview.md`, `_docs/user-flow.md`, `_docs/tech-stack.md`
- Current public website (visual baseline): [`https://www.sokolskuhrov.cz/`](https://www.sokolskuhrov.cz/)

---

## Color System

Semantic palette maps to brand and neutral colors. Values below are practical defaults; refine exact brand hex values by sampling the logo/current site if needed. Keep AA contrast on white surfaces.

- Brand (primary accent; derived from current site’s red):
  - `--color-brand-50:  #fff1f1`
  - `--color-brand-100: #ffe0e0`
  - `--color-brand-200: #ffc2c2`
  - `--color-brand-300: #ff9a9a`
  - `--color-brand-400: #f26b6b`
  - `--color-brand-500: #e34141` ← default
  - `--color-brand-600: #c92a2a`
  - `--color-brand-700: #b11f1f`
  - `--color-brand-800: #8f1b1b`
  - `--color-brand-900: #701616`

- Neutral (UI surfaces; Tailwind “zinc/neutral”‑like):
  - `--color-neutral-50:  #fafafa`
  - `--color-neutral-100: #f4f4f5`
  - `--color-neutral-200: #e4e4e7`
  - `--color-neutral-300: #d4d4d8`
  - `--color-neutral-400: #a1a1aa`
  - `--color-neutral-500: #71717a`
  - `--color-neutral-600: #52525b`
  - `--color-neutral-700: #3f3f46`
  - `--color-neutral-800: #27272a`
  - `--color-neutral-900: #18181b`

- States:
  - Success: `--color-success-600: #16a34a` (green-600)
  - Warning: `--color-warning-600: #d97706` (amber-600)
  - Danger: `--color-danger-600:  #b91c1c` (red-700)
  - Info: `--color-info-600:    #2563eb` (blue-600)

- Semantic aliases (use these in components):
  - `--color-bg:            #ffffff`
  - `--color-surface:       var(--color-neutral-50)`
  - `--color-surface-alt:   var(--color-neutral-100)`
  - `--color-border:        var(--color-neutral-200)`
  - `--color-muted:         var(--color-neutral-500)`
  - `--color-foreground:    #111111`
  - `--color-link:          var(--color-brand-700)`
  - `--color-link-hover:    var(--color-brand-800)`
  - `--color-link-visited:  #7a1a1a` (deepened brand for visited state)
  - `--color-ring:          var(--color-brand-600)`
  - `--color-accent:        var(--color-brand-600)`

Notes:

- Keep link colors accessible on white; adjust `link-visited` slightly darker than default link.
- Prefer subtle borders over heavy shadows to create separation on white surfaces.

---

## Typography

- Font family: System stack (e.g., `ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, …`)
- Sizes (rem):
  - `--font-size-xs:   0.75rem` (12px)
  - `--font-size-sm:   0.875rem` (14px)
  - `--font-size-base: 1rem` (16px)
  - `--font-size-lg:   1.125rem` (18px) ← preferred body on wide screens
  - `--font-size-xl:   1.25rem`
  - `--font-size-2xl:  1.5rem`
  - `--font-size-3xl:  1.875rem`
  - `--font-size-4xl:  2.25rem`
- Line heights:
  - `--leading-tight:  1.25`
  - `--leading-normal: 1.5`
  - `--leading-relaxed:1.65`
- Weights:
  - Headings: 600 (semibold) where needed; avoid extremes.
  - Body: 400 (normal).

Usage:

- Page titles: `2xl–3xl` at `md+`, `xl–2xl` on mobile.
- Section headings: `xl–2xl`.
- Body: base–lg with `--leading-relaxed` for prose.

---

## Spacing and Sizing

- Base unit: 4px scale.
- Common increments:
  - `--space-1: 0.25rem`
  - `--space-2: 0.5rem`
  - `--space-3: 0.75rem`
  - `--space-4: 1rem`
  - `--space-6: 1.5rem`
  - `--space-8: 2rem`
  - `--space-10: 2.5rem`
  - `--space-12: 3rem`
  - `--space-16: 4rem`

---

## Radii, Borders, and Shadows

- Radii:
  - `--radius-sm: 0.25rem`
  - `--radius-md: 0.375rem` (default)
  - `--radius-lg: 0.5rem`
  - `--radius-pill: 9999px`
- Borders:
  - Width: 1px default; use `--color-border` for separators/cards/inputs.
- Shadows (keep minimal for performance and clarity):
  - `--shadow-sm: 0 1px 2px rgba(0,0,0,0.06)`
  - `--shadow-md: 0 2px 6px rgba(0,0,0,0.08)` (rarely used)

---

## Breakpoints and Containers

- Breakpoints (Tailwind defaults): `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`.
- Containers:
  - Prose/pages: `max-w-screen-lg` with side padding `px-4 sm:px-6 md:px-8`.
  - Media grids (gallery/sponsors): `max-w-screen-xl`.

---

## Imagery and Aspect Ratios

- News list thumbnails: 4:3 or 3:2, object‑cover, rounded `--radius-md`.
- News detail hero: 16:9, object‑cover; optional per post.
- Sponsor tiles: padded neutral surface, logo centered with `object-contain`.

---

## Motion

- Keep motion minimal; no large parallax or blur transitions.
- Defaults:
  - Duration: `--motion-fast: 150ms`, `--motion-normal: 200ms`.
  - Easing: `--ease-standard: cubic-bezier(0.2, 0, 0, 1)`.
  - Properties: color/opacity/transform only.

---

## Component Styling (Semantic)

- Links:
  - Color: `--color-link`; Hover: `--color-link-hover`; Visited: `--color-link-visited`.
  - Underline on hover (or always for body links); clear focus ring using `--color-ring`.
- Buttons:
  - Primary: brand background `--color-brand-600`, white text; hover `--color-brand-700`; disabled reduced opacity.
  - Secondary: neutral background `--color-neutral-100`, border `--color-border`, text `--color-foreground`.
  - Ghost: transparent background; text uses brand color on hover.
- Cards:
  - Background `--color-bg`, 1px border `--color-border`, `--shadow-sm`, `--radius-lg`.
- Badges (dates/categories):
  - Background `--color-neutral-100`, text `--color-neutral-700`, `--radius-pill`, small padding.
- Inputs/Selects/Textareas:
  - 1px border `--color-border`, background `--color-bg`, focus ring `--color-ring`, `--radius-md`; comfortable height/tap targets.
- Navbar:
  - Transparent/white background with 1px bottom border; active link uses brand color and underline; mobile menu uses same tokens.
- Footer:
  - `--color-surface` background with 1px top border; small type; accessible links.

---

## Accessibility Defaults

- Contrast ratios AA+ preferred; check brand on white and neutral surfaces.
- Focus ring: 2px outline using `--color-ring` with offset; never removed.
- Min touch target: 40px height for interactive elements; sufficient spacing between items.

---

## Light‑Only Theme (Initial)

- Single light scheme; no dark mode for launch.
- If dark mode is requested later, derive dark aliases with the same semantics.

---

## Implementation Notes

- Tailwind:
  - Extend colors using CSS variables above (e.g., `bg-[color:var(--color-surface)]` in utilities or map in `theme.extend.colors`).
  - Use container queries sparingly; rely on standard breakpoints.
- shadcn/ui:
  - Map semantic tokens via CSS variables in the root theme.
  - Keep component variants minimal (primary/secondary/ghost) for maintainability.

---

## Change Control

- All token changes should be small, incremental, and validated against a few representative pages (Home, News list/detail, Gallery, Sponsors, Contact).
- Ensure every change maintains or improves contrast, readability, and responsiveness.
