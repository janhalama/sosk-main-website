// Akce (News list) page placeholder.
// Later will list posts parsed from /content/posts (sorted by date desc).

/**
 * Renders the Akce list placeholder.
 */
export default function AkceListPage() {
  return (
    <main className="mx-auto max-w-screen-lg px-4 sm:px-6 md:px-8 py-12">
      <h1 className="text-3xl font-semibold tracking-tight mb-4">Akce</h1>
      <p className="text-muted-foreground">
        Seznam aktualit bude generován ze souborů v <code>/content/posts</code>.
      </p>
    </main>
  );
}


