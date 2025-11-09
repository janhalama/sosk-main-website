// Tailwind v4 configuration mapping semantic tokens to CSS variables.
// This restores ergonomic token classes (e.g., bg-bg, text-foreground, border-border)
// without relying on the deprecated @theme at-rule in CSS.
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx,mdx}", "./public/**/*.html"],
  theme: {
    extend: {
      colors: {
        // Semantic aliases
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        "surface-alt": "var(--color-surface-alt)",
        border: "var(--color-border)",
        muted: "var(--color-muted)",
        foreground: "var(--color-foreground)",
        link: "var(--color-link)",
        "link-hover": "var(--color-link-hover)",
        "link-visited": "var(--color-link-visited)",
        ring: "var(--color-ring)",
        accent: "var(--color-accent)",
        // Scales
        brand: {
          50: "var(--color-brand-50)",
          100: "var(--color-brand-100)",
          200: "var(--color-brand-200)",
          300: "var(--color-brand-300)",
          400: "var(--color-brand-400)",
          500: "var(--color-brand-500)",
          600: "var(--color-brand-600)",
          700: "var(--color-brand-700)",
          800: "var(--color-brand-800)",
          900: "var(--color-brand-900)",
        },
        neutral: {
          50: "var(--color-neutral-50)",
          100: "var(--color-neutral-100)",
          200: "var(--color-neutral-200)",
          300: "var(--color-neutral-300)",
          400: "var(--color-neutral-400)",
          500: "var(--color-neutral-500)",
          600: "var(--color-neutral-600)",
          700: "var(--color-neutral-700)",
          800: "var(--color-neutral-800)",
          900: "var(--color-neutral-900)",
        },
      },
    },
  },
} satisfies Config;


