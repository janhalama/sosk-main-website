// Simple site footer with organization information and links.
// Matches neutral surface styling and provides accessible link contrast.
import Link from "next/link";

/** 
 * Footer
 * Renders a minimal footer with organization copy and useful links.
 */
export function Footer() {
  return (
    <footer className="bg-blue-900 border-t border-blue-800">
      <div className="mx-auto max-w-screen-lg px-4 sm:px-6 md:px-8 py-8">
        <div className="flex flex-col gap-3 text-sm text-white">
          <p>
            © {new Date().getFullYear()} T. J. Sokol Skuhrov
          </p>
          <p>
            <span>Kontakt: </span>
            <Link href="/kontakty" className="text-white hover:text-blue-200 underline underline-offset-4">
              Kontakty
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}


