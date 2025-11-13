// Frontmatter helpers for Markdown files. Wraps gray-matter to consistently parse
// frontmatter attributes and raw Markdown body across content types (pages, posts).
// Keep logic minimal and reusable by higher-level modules like posts.ts and read-page.ts.
import matter from "gray-matter";

export type ParsedMarkdown = {
  attributes: Record<string, unknown>;
  body: string;
};

/**
 * Parses a Markdown string with gray-matter and returns attributes and body.
 * Throws if input is empty or not a string to surface invalid states early.
 */
export function parseMarkdownWithFrontmatter(raw: string): ParsedMarkdown {
  if (typeof raw !== "string" || raw.length === 0) {
    throw new Error("parseMarkdownWithFrontmatter: raw Markdown is empty.");
  }
  const parsed = matter(raw);
  return {
    attributes: (parsed.data || {}) as Record<string, unknown>,
    body: parsed.content ?? "",
  };
}

/**
 * Validates that a value is a non-empty string; returns the string on success.
 */
export function requireString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid frontmatter: "${field}" must be a non-empty string.`);
  }
  return value.trim();
}

/**
 * Validates an ISO-like date string; returns the normalized value on success.
 * Accepts YYYY-MM-DD or full ISO; rejects invalid dates.
 * Also handles Date objects (from gray-matter parsing unquoted dates).
 */
export function requireIsoDateString(value: unknown, field: string): string {
  // Handle Date objects (gray-matter converts unquoted dates to Date objects)
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new Error(`Invalid frontmatter: "${field}" must be a valid ISO date string.`);
    }
    // Convert Date to ISO string (YYYY-MM-DD format)
    return value.toISOString().split('T')[0];
  }
  
  // Handle string values
  const input = requireString(value, field);
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid frontmatter: "${field}" must be a valid ISO date string.`);
  }
  return input;
}


