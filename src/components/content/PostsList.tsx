// Posts list component that renders a paginated list of posts.
// Used by both the home page and the Akce page to display news posts.
import { Calendar, ChevronLeft, ChevronRight, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { PostWithContent } from "../../lib/content/posts";

type PostsListProps = {
  posts: PostWithContent[];
  currentPage: number;
  totalPages: number;
  basePath: string;
};

/**
 * Renders a paginated list of posts with images, dates, and content.
 */
export function PostsList({ posts, currentPage, totalPages, basePath }: PostsListProps) {
  return (
    <>
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
                <Link href={`/akce/${post.slug}`} className="hover:underline" style={{ color: '#000000' }}>
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
              href={currentPage === 2 ? basePath : `${basePath}?page=${currentPage - 1}`}
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
              href={`${basePath}?page=${currentPage + 1}`}
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
    </>
  );
}

