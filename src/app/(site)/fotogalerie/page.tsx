// Fotogalerie (Photo gallery list) – lists posts parsed from /content/fotogalerie sorted by date desc.
// Uses lib/content/fotogalerie to read frontmatter and render full article content with images.
// Implements pagination with 5 posts per page.

import type { Metadata } from "next";
import { Calendar, ChevronLeft, ChevronRight, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getAllFotogalerieWithContent } from "../../../lib/content/fotogalerie";

export const metadata: Metadata = {
  title: "Fotogalerie",
};

const POSTS_PER_PAGE = 5;

type PageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

/**
 * Renders the Fotogalerie list using post frontmatter (title, date, slug, image) and full HTML content.
 * Supports pagination with 5 posts per page.
 */
export default async function FotogaleriePage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10));
  
  const allPosts = await getAllFotogalerieWithContent();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const posts = allPosts.slice(startIndex, endIndex);

  return (
    <main className="mx-auto max-w-screen-lg px-4 sm:px-6 md:px-8 py-12">
        <ul className="space-y-8">
        {posts.map((post) => (
          <li key={post.slug}>
            <article className="max-w-3xl mx-auto">
              <div className="text-sm flex flex-wrap items-center gap-3 mb-3" style={{ color: 'var(--color-brand-700)' }}>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" aria-hidden="true" style={{ color: 'var(--color-brand-700)' }} />
                  {new Date(post.date).toLocaleDateString("cs-CZ")}
                </span>
                {post.author ? (
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4" aria-hidden="true" style={{ color: 'var(--color-brand-700)' }} />
                    {post.author}
                  </span>
                ) : null}
              </div>
              <h2 className="text-2xl font-semibold tracking-tight mb-4" style={{ color: '#000000' }}>
                <Link href={`/fotogalerie/${post.slug}`} className="hover:underline" style={{ color: '#000000' }}>
                  {post.title}
                </Link>
              </h2>
              {post.image ? (
                <div className="relative w-full max-w-3xl mx-auto aspect-video mb-4 rounded-md overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 768px"
                    priority={false}
                  />
                </div>
              ) : null}
              <div 
                className="article-content"
                dangerouslySetInnerHTML={{ __html: post.html }}
              />
            </article>
          </li>
        ))}
      </ul>
      
      {totalPages > 1 && (
        <nav className="mt-12 flex items-center justify-center gap-4" aria-label="Pagination">
          {currentPage > 1 ? (
            <Link
              href={currentPage === 2 ? "/fotogalerie" : `/fotogalerie?page=${currentPage - 1}`}
              className="flex items-center gap-1 px-4 py-2 border rounded-md hover:bg-surface transition-colors"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              <span>Předchozí</span>
            </Link>
          ) : (
            <span className="flex items-center gap-1 px-4 py-2 border rounded-md text-muted-foreground opacity-50 cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              <span>Předchozí</span>
            </span>
          )}
          
          <span className="text-sm text-muted-foreground">
            Stránka {currentPage} z {totalPages}
          </span>
          
          {currentPage < totalPages ? (
            <Link
              href={`/fotogalerie?page=${currentPage + 1}`}
              className="flex items-center gap-1 px-4 py-2 border rounded-md hover:bg-surface transition-colors"
            >
              <span>Další</span>
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          ) : (
            <span className="flex items-center gap-1 px-4 py-2 border rounded-md text-muted-foreground opacity-50 cursor-not-allowed">
              <span>Další</span>
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </span>
          )}
        </nav>
      )}
    </main>
  );
}


