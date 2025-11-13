// Akce detail page – renders a single post parsed from /content/posts by slug.
// Uses lib/content/posts to read frontmatter and render HTML.
import type { Metadata } from "next";
import { Calendar, User } from "lucide-react";
import Image from "next/image";
import { getPostBySlug } from "../../../../lib/content/posts";

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = await getPostBySlug(slug);
  return {
    title: meta.title,
  };
}

type PageParams = {
  params: Promise<{
    slug: string;
  }>;
};

/**
 * Renders Akce detail page using post frontmatter and Markdown HTML.
 */
export default async function AkceDetailPage({ params }: PageParams) {
  const { slug } = await params;
  const { meta, html } = await getPostBySlug(slug);
  return (
    <main className="mx-auto max-w-screen-lg px-4 sm:px-6 md:px-8 py-12">
      <article className="max-w-3xl mx-auto">
        <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-3 mb-4">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" aria-hidden="true" />
            {new Date(meta.date).toLocaleDateString("cs-CZ")}
          </span>
          {meta.author ? (
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" aria-hidden="true" />
              {meta.author}
            </span>
          ) : null}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight mb-4">{meta.title}</h1>
        {meta.image ? (
          <div className="relative w-full max-w-3xl mx-auto aspect-video mb-6 rounded-md overflow-hidden">
            <Image
              src={meta.image}
              alt={meta.title}
              fill
              className="object-cover"
              priority={false}
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        ) : null}
        <div className="space-y-4 leading-relaxed article-content" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </main>
  );
}


