// Fotogalerie page – lists posts from /content/fotogalerie sorted by date desc.
// Uses lib/content/fotogalerie to read frontmatter and render a simple list.

import Link from "next/link";
import { getAllFotogalerieMeta } from "../../../lib/content/fotogalerie";

/**
 * Renders the Fotogalerie list using post frontmatter (title, date, slug).
 */
export default async function FotogaleriePage() {
  const posts = await getAllFotogalerieMeta();
  return (
    <main className="mx-auto max-w-screen-lg px-4 sm:px-6 md:px-8 py-12">
      <h1 className="text-3xl font-semibold tracking-tight mb-4">Fotogalerie</h1>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.slug} className="border rounded-md p-4">
            <div className="text-sm text-muted-foreground">
              {new Date(post.date).toLocaleDateString("cs-CZ")}
            </div>
            <h2 className="text-xl font-medium">
              <Link href={`/fotogalerie/${post.slug}`} className="underline decoration-transparent hover:decoration-inherit">
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


