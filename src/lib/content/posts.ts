// Posts content helpers. Responsible for reading Markdown posts from /content/posts,
// parsing frontmatter, computing/normalizing slugs, sorting by date, and rendering
// Markdown to HTML using the shared pipeline.
//
// Frontmatter model (initial minimal set):
// - title: string (required)
// - date: string (ISO-like, required)
// - image: string (optional path under /public)
// - summary: string (optional)
// - slug: string (optional; derived from filename if absent)
import fs from "node:fs/promises";
import path from "node:path";
import { renderMarkdownToHtml } from "./markdown";
import {
  parseMarkdownWithFrontmatter,
  requireIsoDateString,
  requireString,
} from "./frontmatter";

export type PostMeta = {
  title: string;
  date: string;
  slug: string;
  image?: string;
  summary?: string;
  filePath: string;
};

export type PostDetail = {
  meta: PostMeta;
  html: string;
};

/**
 * Returns absolute path to the posts directory.
 */
function getPostsDirectory(): string {
  return path.join(process.cwd(), "content", "posts");
}

/**
 * Removes leading/trailing slashes and normalizes to simple slug segment.
 */
export function normalizeSlug(slug: string): string {
  const trimmed = slug.trim().replace(/^\/+|\/+$/g, "");
  if (trimmed.length === 0) throw new Error("normalizeSlug: slug is empty after normalization.");
  return trimmed;
}

/**
 * Derives slug from a filename (without extension).
 */
function slugFromFilename(filename: string): string {
  const base = filename.replace(/\.md$/i, "");
  return normalizeSlug(base);
}

/**
 * Reads filenames in /content/posts that end with .md.
 */
async function listPostFilenames(): Promise<string[]> {
  const dir = getPostsDirectory();
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries.filter((e) => e.isFile() && /\.md$/i.test(e.name)).map((e) => e.name);
}

/**
 * Reads and parses a single post file, returning typed metadata.
 * Does not render Markdown to HTML (use getPostBySlug for detail).
 */
async function readPostMetaFromFile(filePath: string): Promise<PostMeta> {
  const raw = await fs.readFile(filePath, "utf8");
  const { attributes } = parseMarkdownWithFrontmatter(raw);

  const title = requireString(attributes.title, "title");
  const date = requireIsoDateString(attributes.date, "date");

  const optionalSlug = typeof attributes.slug === "string" ? attributes.slug : undefined;
  const derivedSlug = optionalSlug && optionalSlug.trim().length > 0
    ? normalizeSlug(optionalSlug)
    : slugFromFilename(path.basename(filePath));

  const image = typeof attributes.image === "string" ? attributes.image : undefined;
  const summary = typeof attributes.summary === "string" ? attributes.summary : undefined;

  return {
    title,
    date,
    slug: derivedSlug,
    image,
    summary,
    filePath,
  };
}

/**
 * Returns all posts' metadata sorted by date descending.
 */
export async function getAllPostsMeta(): Promise<PostMeta[]> {
  const dir = getPostsDirectory();
  const filenames = await listPostFilenames();
  const metas = await Promise.all(
    filenames.map((name) => readPostMetaFromFile(path.join(dir, name))),
  );
  return metas.sort((a, b) => {
    const aTime = new Date(a.date).getTime();
    const bTime = new Date(b.date).getTime();
    return bTime - aTime;
  });
}

/**
 * Reads a post by slug, validates metadata, and renders Markdown body to HTML.
 */
export async function getPostBySlug(slug: string): Promise<PostDetail> {
  const normalized = normalizeSlug(slug);
  const dir = getPostsDirectory();
  const candidatePath = path.join(dir, `${normalized}.md`);

  let raw: string;
  try {
    raw = await fs.readFile(candidatePath, "utf8");
  } catch {
    throw new Error(`getPostBySlug: post not found for slug "${normalized}".`);
  }

  const { attributes, body } = parseMarkdownWithFrontmatter(raw);

  const title = requireString(attributes.title, "title");
  const date = requireIsoDateString(attributes.date, "date");
  const image = typeof attributes.image === "string" ? attributes.image : undefined;
  const summary = typeof attributes.summary === "string" ? attributes.summary : undefined;

  const meta: PostMeta = {
    title,
    date,
    slug: normalized,
    image,
    summary,
    filePath: candidatePath,
  };

  const html = await renderMarkdownToHtml(body.trim());
  return { meta, html };
}


