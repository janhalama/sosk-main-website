// Fotogalerie detail page – renders a single post parsed from /content/fotogalerie by slug.
// Uses lib/content/fotogalerie to read frontmatter and render HTML.
import type { Metadata } from "next";
import { Calendar, User } from "lucide-react";
import Image from "next/image";
import { getFotogalerieBySlug } from "../../../../lib/content/fotogalerie";

type PageParams = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = await getFotogalerieBySlug(slug);
  return {
    title: meta.title,
  };
}

/**
 * Renders Fotogalerie detail page using post frontmatter and Markdown HTML.
 */
export default async function FotogalerieDetailPage({ params }: PageParams) {
  const { slug } = await params;
  const { meta, html } = await getFotogalerieBySlug(slug);
  return (
    <main className="mx-auto max-w-screen-lg px-4 sm:px-6 md:px-8 py-12">
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
        <div className="relative w-full aspect-video mb-6">
          <Image
            src={meta.image}
            alt={meta.title}
            fill
            className="object-cover rounded-md"
            priority={false}
            sizes="100vw"
          />
        </div>
      ) : null}
      <article className="space-y-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}

