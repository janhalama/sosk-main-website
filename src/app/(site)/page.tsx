// Home page for Sokol Skuhrov static site.
// Renders the same content as the Akce page (news list) but at the root path.
import type { Metadata } from "next";
import { getAllPostsWithContent } from "../../lib/content/posts";
import { PostsList } from "../../components/content/PostsList";

export const metadata: Metadata = {
  title: "Domů",
};

const POSTS_PER_PAGE = 5;

type PageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

/**
 * Renders the Home page with the same content as Akce (news list).
 * Supports pagination with 5 posts per page.
 */
export default async function HomePage({ searchParams }: PageProps) {
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
        basePath="/"
      />
    </main>
  );
}


