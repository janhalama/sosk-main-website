// API route for post search. Returns searchable post data (title, slug, markdown body)
// for client-side fulltext search. Used by the Search component in the header.
import { getAllPostsMeta } from "../../../../lib/content/posts";
import { parseMarkdownWithFrontmatter } from "../../../../lib/content/frontmatter";
import fs from "node:fs/promises";

export type SearchablePost = {
  title: string;
  slug: string;
  date: string;
  body: string;
};

/**
 * Returns all posts with searchable content (title, slug, date, markdown body).
 */
export async function GET() {
  const postsMeta = await getAllPostsMeta();

  const searchablePosts: SearchablePost[] = await Promise.all(
    postsMeta.map(async (meta) => {
      const raw = await fs.readFile(meta.filePath, "utf8");
      const { body } = parseMarkdownWithFrontmatter(raw);

      return {
        title: meta.title,
        slug: meta.slug,
        date: meta.date,
        body: body.trim(),
      };
    }),
  );

  return Response.json(searchablePosts);
}

