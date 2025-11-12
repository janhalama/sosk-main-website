// Accessible site header with primary navigation for Sokol Skuhrov.
// Provides brand link and top-level section links. Mobile collapsible menu is deferred.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "./Search";
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
 * Checks if a pathname matches a nav item href.
 */
function isActivePath(pathname: string, href: string): boolean {
  if (href === "/akce") {
    return pathname === "/akce" || pathname.startsWith("/akce/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** 
 * Header
 * Renders the site header with brand and primary navigation.
 */
export function Header() {
  const pathname = usePathname();

  return (
    <header>
      {/* Falcon image section */}
      <div className="falcon-header">
        <div className="falcon-header-pattern"></div>
        <div className="falcon-header-center"></div>
        <div className="mx-auto max-w-screen-lg px-4 sm:px-6 md:px-8 min-h-[300px] relative z-10"></div>
      </div>
      {/* Menu with dark blue background */}
      <nav 
        aria-label="Hlavní navigace" 
        className="bg-blue-900 text-white border-b border-blue-800"
      >
        <div className="mx-auto max-w-screen-lg px-4 sm:px-6 md:px-8 h-[45px] flex items-center justify-between">
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {NAV_ITEMS.map((item) => {
              const isActive = isActivePath(pathname, item.href);
              return (
                <li key={`${item.href}-${item.label}`}>
                  <Link
                    href={item.href}
                    className={`text-white hover:text-blue-200 focus-visible:font-bold ${
                      isActive ? "font-bold" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Search />
        </div>
      </nav>
    </header>
  );
}


