// Akce (News list) – lists posts parsed from /content/posts sorted by date desc.
// Uses lib/content/posts to read frontmatter and render full article content with images.
// Implements pagination with 5 posts per page.

import type { Metadata } from "next";
import { getAllPostsWithContent } from "../../../lib/content/posts";
import { PostsList } from "../../../components/content/PostsList";

export const metadata: Metadata = {
  title: "Akce",
};

const POSTS_PER_PAGE = 5;

type PageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

/**
 * Renders the Akce list using post frontmatter (title, date, slug, image) and full HTML content.
 * Supports pagination with 5 posts per page.
 */
export default async function AkceListPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10));
  
  const allPosts = await getAllPostsWithContent();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const posts = allPosts.slice(startIndex, endIndex);

  return (
    <main className="mx-auto max-w-screen-lg px-4 sm:px-6 md:px-8 py-12">
      <PostsList 
        posts={posts} 
        currentPage={currentPage} 
        totalPages={totalPages} 
        basePath="/akce"
      />
    </main>
  );
}


