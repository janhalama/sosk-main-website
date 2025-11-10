// Fotogalerie page – renders Markdown from /content/pages/fotogalerie.md.
// This file reads Markdown and renders it for the Fotogalerie archive page.

/**
 * Renders the Fotogalerie page from Markdown content.
 */
import { readMarkdownPageBySlug } from "../../../lib/content/read-page";

export default async function FotogaleriePage() {
  const { title, html } = await readMarkdownPageBySlug("fotogalerie");
  return (
    <main className="mx-auto max-w-screen-xl px-4 sm:px-6 md:px-8 py-12">
      <h1 className="text-3xl font-semibold tracking-tight mb-8">{title}</h1>
      <article
        className="space-y-6 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </main>
  );
}


