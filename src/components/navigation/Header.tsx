// Accessible site header with primary navigation for Sokol Skuhrov.
// Provides brand link and top-level section links. Mobile collapsible menu is deferred.
import Link from "next/link";
import "./Header.css";

type NavItem = {
  href: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/akce", label: "Domů" },
  { href: "/cinnost", label: "Činnost" },
  { href: "/akce", label: "Akce" },
  { href: "/fotogalerie", label: "Fotogalerie" },
  { href: "/sponzori", label: "Sponzoři" },
  { href: "/kontakty", label: "Kontakty" },
];

/** 
 * Header
 * Renders the site header with brand and primary navigation.
 */
export function Header() {
  return (
    <header className="bg-bg border-b border-border">
      <div className="mx-auto max-w-screen-lg px-4 sm:px-6 md:px-8 min-h-[300px] flex flex-col justify-end pb-4">
        <div className="flex items-center justify-between">
        <div className="min-w-0">
          <Link
            href="/"
            className="text-brand-700 hover:text-brand-800 font-semibold text-lg"
            aria-label="Sokol Skuhrov – Domů"
          >
            Sokol Skuhrov
          </Link>
        </div>
        <nav aria-label="Hlavní navigace" className="ml-6">
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {NAV_ITEMS.map((item) => (
              <li key={`${item.href}-${item.label}`}>
                <Link
                  href={item.href}
                  className="text-foreground/80 hover:text-foreground underline-offset-4 hover:underline focus-visible:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        </div>
      </div>
    </header>
  );
}


