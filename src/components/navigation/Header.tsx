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
    <header>
      {/* Falcon image section */}
      <div className="falcon-header">
        <div className="mx-auto max-w-screen-lg px-4 sm:px-6 md:px-8 min-h-[300px]"></div>
      </div>
      {/* Menu with dark blue background */}
      <nav 
        aria-label="Hlavní navigace" 
        className="bg-blue-900 text-white border-b border-blue-800"
      >
        <div className="mx-auto max-w-screen-lg px-4 sm:px-6 md:px-8 h-16 flex items-center">
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {NAV_ITEMS.map((item) => (
              <li key={`${item.href}-${item.label}`}>
                <Link
                  href={item.href}
                  className="text-white hover:text-blue-200 focus-visible:font-bold"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}


