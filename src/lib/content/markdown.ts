// Proper Markdown rendering pipeline using unified/remark/rehype with GFM support.
// Supports headings, paragraphs, bold/italic, links, lists, code, and tables via remark-gfm.
// Sanitizes HTML to prevent XSS attacks while allowing safe markdown elements.
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

/**
 * Converts Markdown to HTML using remark + GFM and rehype.
 * Sanitizes HTML to prevent XSS while allowing safe markdown elements.
 */
export async function renderMarkdownToHtml(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(markdown);
  return String(file);
}


