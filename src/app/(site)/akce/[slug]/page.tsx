// Akce detail page placeholder.
// Will render a single post parsed from /content/posts by slug.

type PageParams = {
  params: Promise<{
    slug: string;
  }>;
};

/**
 * Renders a placeholder for an Akce detail by slug.
 */
export default async function AkceDetailPage({ params }: PageParams) {
  const { slug } = await params;
  return (
    <main className="mx-auto max-w-screen-lg px-4 sm:px-6 md:px-8 py-12">
      <h1 className="text-3xl font-semibold tracking-tight mb-4">Akce: {slug}</h1>
      <p className="text-muted-foreground">
        Detail příspěvku bude načten z Markdownu dle slugu.
      </p>
    </main>
  );
}


