// Činnost page – renders Markdown content from /content/pages/cinnost.md.
// This file reads Markdown and renders it as static HTML for the Činnost page.

/**
 * Renders the Činnost static page from Markdown content.
 */
import { readMarkdownPageBySlug } from "../../../lib/content/read-page";

export default async function CinnostPage() {
  const { title, html } = await readMarkdownPageBySlug("cinnost");
  return (
    <main className="mx-auto max-w-screen-lg px-4 sm:px-6 md:px-8 py-12">
      <h1 className="text-3xl font-semibold tracking-tight mb-4">{title}</h1>
      <article
        className="space-y-4 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </main>
  );
}


