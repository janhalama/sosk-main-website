// Home page for Sokol Skuhrov static site.
// Presents a minimal, tokenized shell; real content will be sourced from Markdown and components.
import Link from "next/link";

/**
 * Renders the Home page with a simple welcome and section links.
 */
export default function HomePage() {
  return (
    <main className="mx-auto max-w-screen-lg px-4 sm:px-6 md:px-8 py-12">
      <h1 className="text-3xl font-semibold tracking-tight mb-4">
        T. J. Sokol Skuhrov
      </h1>
      <p className="text-muted-foreground mb-8">
        Oficiální stránky jednoty. Struktura a obsah budou postupně doplněny.
      </p>
      <nav aria-label="Hlavní sekce" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/cinnost" className="underline text-link hover:text-link-hover">
          Činnost
        </Link>
        <Link href="/akce" className="underline text-link hover:text-link-hover">
          Akce (Aktuality)
        </Link>
        <Link href="/fotogalerie" className="underline text-link hover:text-link-hover">
          Fotogalerie
        </Link>
        <Link href="/sponzori" className="underline text-link hover:text-link-hover">
          Sponzoři
        </Link>
        <Link href="/kontakty" className="underline text-link hover:text-link-hover">
          Kontakty
        </Link>
      </nav>
    </main>
  );
}


