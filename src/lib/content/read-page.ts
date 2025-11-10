// File helpers to read Markdown static pages from /content/pages and render to HTML.
// Uses gray-matter for frontmatter and a remark/rehype pipeline for robust Markdown (tables, lists, etc.).

import fs from "node:fs/promises";
import path from "node:path";
import { renderMarkdownToHtml } from "./markdown";
import matter from "gray-matter";

type MarkdownPage = {
  title: string;
  html: string;
  data: Record<string, unknown>;
};

/**
 * Reads a Markdown page by slug from /content/pages and returns title and rendered HTML.
 * Frontmatter supports: title (string). Content after frontmatter is rendered as Markdown.
 */
export async function readMarkdownPageBySlug(slug: string): Promise<MarkdownPage> {
  const filePath = path.join(process.cwd(), "content", "pages", `${slug}.md`);
  const raw = await fs.readFile(filePath, "utf8");

  const parsed = matter(raw);
  const frontmatter = (parsed.data || {}) as Record<string, unknown>;
  const title = (frontmatter.title as string) || capitalize(slug);
  const html = await renderMarkdownToHtml(parsed.content.trim());

  return { title, html, data: frontmatter };
}

function capitalize(input: string): string {
  if (!input) return input;
  return input.slice(0, 1).toUpperCase() + input.slice(1);
}


