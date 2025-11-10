// Akce (News list) – lists posts parsed from /content/posts sorted by date desc.
// Uses lib/content/posts to read frontmatter and render a simple list.

import Link from "next/link";
import { getAllPostsMeta } from "../../../lib/content/posts";

/**
 * Renders the Akce list using post frontmatter (title, date, slug).
 */
export default async function AkceListPage() {
  const posts = await getAllPostsMeta();
  return (
    <main className="mx-auto max-w-screen-lg px-4 sm:px-6 md:px-8 py-12">
      <h1 className="text-3xl font-semibold tracking-tight mb-4">Akce</h1>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.slug} className="border rounded-md p-4">
            <div className="text-sm text-muted-foreground">
              {new Date(post.date).toLocaleDateString("cs-CZ")}
            </div>
            <h2 className="text-xl font-medium">
              <Link href={`/akce/${post.slug}`} className="underline decoration-transparent hover:decoration-inherit">
                {post.title}
              </Link>
            </h2>
            {post.summary ? <p className="text-muted-foreground mt-1">{post.summary}</p> : null}
          </li>
        ))}
      </ul>
    </main>
  );
}


