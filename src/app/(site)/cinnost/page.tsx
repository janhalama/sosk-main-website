// Činnost page placeholder.
// Static content will be rendered from Markdown stored under /content/pages.

/**
 * Renders the Činnost static page placeholder.
 */
export default function CinnostPage() {
  return (
    <main className="mx-auto max-w-screen-lg px-4 sm:px-6 md:px-8 py-12">
      <h1 className="text-3xl font-semibold tracking-tight mb-4">Činnost</h1>
      <p className="text-muted-foreground">
        Obsah této stránky bude brzy doplněn z Markdownu.
      </p>
    </main>
  );
}


