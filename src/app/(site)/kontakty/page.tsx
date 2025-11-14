// Kontakty page – renders Markdown from /content/pages/kontakty.md.
// All formatting is controlled inside the Markdown (supports raw HTML blocks).

import type { Metadata } from "next";
import { readMarkdownPageBySlug } from "../../../lib/content/read-page";

export const metadata: Metadata = {
  title: "Kontakty",
};

export default async function KontaktyPage() {
  const { title, html } = await readMarkdownPageBySlug("kontakty");

  return (
    <main className="mx-auto max-w-screen-lg px-4 sm:px-6 md:px-8 py-12">
      <h1 className="text-3xl font-semibold tracking-tight mb-4">{title}</h1>
      {/* HTML is sanitized server-side via rehype-sanitize before rendering */}
      <article className="space-y-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}


