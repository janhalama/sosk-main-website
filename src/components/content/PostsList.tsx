// Posts list component that renders a list of posts with a "Load Next" button.
// Used by both the home page and the Akce page to display news posts.
"use client";

import { useState } from "react";
import { Calendar, Plus, User, Loader2 } from "lucide-react";
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
 * Renders a list of posts with images, dates, and content, with a "Load Next" button.
 * The button loads and appends the next page's posts to the current list.
 */
export function PostsList({ posts: initialPosts, currentPage: initialPage, totalPages: initialTotalPages, basePath }: PostsListProps) {
  const [allPosts, setAllPosts] = useState<PostWithContent[]>(initialPosts);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = async () => {
    if (isLoading || currentPage >= totalPages) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/posts?page=${currentPage + 1}`);
      if (!response.ok) {
        throw new Error("Failed to load posts");
      }
      const data = await response.json();
      setAllPosts((prev) => [...prev, ...data.posts]);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ul className="space-y-8">
        {allPosts.map((post) => (
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
              {/* HTML is sanitized server-side via rehype-sanitize before rendering */}
              <div 
                className="article-content"
                dangerouslySetInnerHTML={{ __html: post.html }}
              />
            </article>
          </li>
        ))}
      </ul>
      
      {currentPage < totalPages && (
        <nav className="mt-12 flex items-center justify-center" aria-label="Load more">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 rounded-md transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: isLoading ? 'var(--color-brand-400)' : 'var(--color-brand-600)',
              color: '#ffffff',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = 'var(--color-brand-700)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = 'var(--color-brand-600)';
              }
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                <span>Načítání...</span>
              </>
            ) : (
              <>
                <span>Načíst další</span>
                <Plus className="w-5 h-5" aria-hidden="true" />
              </>
            )}
          </button>
        </nav>
      )}
    </>
  );
}

