// Fotogalerie posts content helpers. Reuses posts logic but reads from /content/fotogalerie.
import fs from "node:fs/promises";
import path from "node:path";
import { renderMarkdownToHtml } from "./markdown";
import {
  parseMarkdownWithFrontmatter,
  requireIsoDateString,
  requireString,
} from "./frontmatter";
import { normalizeSlug, type PostMeta, type PostDetail } from "./posts";

/**
 * Returns absolute path to the fotogalerie directory.
 */
function getFotogalerieDirectory(): string {
  return path.join(process.cwd(), "content", "fotogalerie");
}

/**
 * Derives slug from a filename (without extension).
 */
function slugFromFilename(filename: string): string {
  const base = filename.replace(/\.md$/i, "");
  return normalizeSlug(base);
}

/**
 * Reads filenames in /content/fotogalerie that end with .md.
 */
async function listFotogalerieFilenames(): Promise<string[]> {
  const dir = getFotogalerieDirectory();
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries.filter((e) => e.isFile() && /\.md$/i.test(e.name)).map((e) => e.name);
  } catch (error) {
    // Directory doesn't exist yet, return empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

/**
 * Reads and parses a single fotogalerie post file, returning typed metadata.
 */
async function readFotogalerieMetaFromFile(filePath: string): Promise<PostMeta> {
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
  const author = typeof attributes.author === "string" ? attributes.author : undefined;

  return {
    title,
    date,
    slug: derivedSlug,
    image,
    summary,
    author,
    filePath,
  };
}

/**
 * Returns all fotogalerie posts' metadata sorted by date descending.
 */
export async function getAllFotogalerieMeta(): Promise<PostMeta[]> {
  const dir = getFotogalerieDirectory();
  const filenames = await listFotogalerieFilenames();
  const metas = await Promise.all(
    filenames.map((name) => readFotogalerieMetaFromFile(path.join(dir, name))),
  );
  return metas.sort((a, b) => {
    const aTime = new Date(a.date).getTime();
    const bTime = new Date(b.date).getTime();
    return bTime - aTime;
  });
}

export type FotogalerieWithContent = PostMeta & {
  html: string;
};

/**
 * Returns all fotogalerie posts with full HTML content sorted by date descending.
 */
export async function getAllFotogalerieWithContent(): Promise<FotogalerieWithContent[]> {
  const dir = getFotogalerieDirectory();
  const filenames = await listFotogalerieFilenames();
  const posts = await Promise.all(
    filenames.map(async (name) => {
      const filePath = path.join(dir, name);
      const raw = await fs.readFile(filePath, "utf8");
      const { attributes, body } = parseMarkdownWithFrontmatter(raw);

      const title = requireString(attributes.title, "title");
      const date = requireIsoDateString(attributes.date, "date");

      const optionalSlug = typeof attributes.slug === "string" ? attributes.slug : undefined;
      const derivedSlug = optionalSlug && optionalSlug.trim().length > 0
        ? normalizeSlug(optionalSlug)
        : slugFromFilename(name);

      const image = typeof attributes.image === "string" ? attributes.image : undefined;
      const summary = typeof attributes.summary === "string" ? attributes.summary : undefined;
      const author = typeof attributes.author === "string" ? attributes.author : undefined;

      const meta: PostMeta = {
        title,
        date,
        slug: derivedSlug,
        image,
        summary,
        author,
        filePath,
      };

      const html = await renderMarkdownToHtml(body.trim());

      return { ...meta, html };
    }),
  );

  return posts.sort((a, b) => {
    const aTime = new Date(a.date).getTime();
    const bTime = new Date(b.date).getTime();
    return bTime - aTime;
  });
}

/**
 * Reads a fotogalerie post by slug, validates metadata, and renders Markdown body to HTML.
 */
export async function getFotogalerieBySlug(slug: string): Promise<PostDetail> {
  const normalized = normalizeSlug(slug);
  const dir = getFotogalerieDirectory();
  const candidatePath = path.join(dir, `${normalized}.md`);

  let raw: string;
  try {
    raw = await fs.readFile(candidatePath, "utf8");
  } catch {
    throw new Error(`getFotogalerieBySlug: post not found for slug "${normalized}".`);
  }

  const { attributes, body } = parseMarkdownWithFrontmatter(raw);

  const title = requireString(attributes.title, "title");
  const date = requireIsoDateString(attributes.date, "date");
  const image = typeof attributes.image === "string" ? attributes.image : undefined;
  const summary = typeof attributes.summary === "string" ? attributes.summary : undefined;
  const author = typeof attributes.author === "string" ? attributes.author : undefined;

  const meta: PostMeta = {
    title,
    date,
    slug: normalized,
    image,
    summary,
    author,
    filePath: candidatePath,
  };

  const html = await renderMarkdownToHtml(body.trim());
  return { meta, html };
}

