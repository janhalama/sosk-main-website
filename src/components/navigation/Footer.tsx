// Simple site footer with organization information.

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
        </div>
      </div>
    </footer>
  );
}


