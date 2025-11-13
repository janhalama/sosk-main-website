import { getAllPostsWithContent } from "../../../lib/content/posts";

const POSTS_PER_PAGE = 5;

/**
 * API route to fetch posts for a specific page.
 * Query params: ?page=1 (defaults to 1)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  
  const allPosts = await getAllPostsWithContent();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const posts = allPosts.slice(startIndex, endIndex);

  return Response.json({
    posts,
    currentPage: page,
    totalPages,
    hasMore: page < totalPages,
  });
}

