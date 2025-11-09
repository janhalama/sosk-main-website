// Small utility helpers used across UI components.
// Provides a Tailwind-aware class name merger to compose variant classes safely.

import { twMerge } from "tailwind-merge";

/**
 * Merges an arbitrary list of class name fragments into a single string while
 * resolving Tailwind CSS class conflicts in a predictable way.
 */
export function cn(
  ...classNameFragments: Array<string | false | null | undefined>
): string {
  return twMerge(classNameFragments.filter(Boolean).join(" "));
}


