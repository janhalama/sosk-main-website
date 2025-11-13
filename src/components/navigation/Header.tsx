// Accessible site header with primary navigation for Sokol Skuhrov.
// Provides brand link and top-level section links with responsive hamburger menu on mobile.
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Search } from "./Search";
import "./Header.css";

type NavItem = {
  href: string;
  label: string;
  exact?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Domů", exact: true },
  { href: "/cinnost", label: "Činnost" },
  { href: "/akce", label: "Akce" },
  { href: "/fotogalerie", label: "Fotogalerie" },
  { href: "/sponzori", label: "Sponzoři" },
  { href: "/kontakty", label: "Kontakty" },
];

/**
 * Checks if a pathname matches a nav item href.
 */
function isActivePath(pathname: string, item: NavItem): boolean {
  // "Domů" should be active on root / or /akce (since / redirects to /akce)
  if (item.exact && item.href === "/") {
    return pathname === "/" || pathname === "/akce";
  }
  // "Akce" should be active on /akce and all /akce/* pages
  if (item.href === "/akce") {
    return pathname === "/akce" || pathname.startsWith("/akce/");
  }
  // Other items match exact or sub-paths
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

/** 
 * Header
 * Renders the site header with brand and primary navigation.
 */
export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when pathname changes (navigation occurred)
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isMenuOpen]);

  // Close menu on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <header className="relative block">
      {/* Falcon image section */}
      <div className="falcon-header block">
        <div className="falcon-header-pattern"></div>
        <div className="falcon-header-center"></div>
        <div className="mx-auto max-w-screen-lg px-4 sm:px-6 md:px-8 min-h-[300px] relative z-10 h-full"></div>
      </div>
      {/* Menu with dark blue background */}
      <nav 
        aria-label="Hlavní navigace" 
        className="bg-blue-900 text-white border-b border-blue-800 relative block"
      >
        <div className="mx-auto max-w-screen-lg px-4 sm:px-6 md:px-8 h-[45px] flex items-center justify-between relative">
          <div className="flex items-center gap-4">
            {/* Hamburger button - visible on mobile, hidden on desktop */}
            <button
              type="button"
              onClick={toggleMenu}
              aria-label="Otevřít menu"
              aria-expanded={isMenuOpen}
              className="md:hidden flex items-center justify-center w-8 h-8 text-white hover:text-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900 rounded"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>

            {/* Navigation menu - hidden on mobile when closed, visible on desktop */}
            <div
              ref={menuRef}
              className={`absolute md:static top-[45px] md:top-auto left-0 right-0 md:flex md:items-center w-full md:w-auto bg-blue-900 md:bg-transparent border-t md:border-t-0 border-blue-800 ${
                isMenuOpen ? "block" : "hidden md:flex"
              }`}
            >
              <ul className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-x-4 gap-y-2 py-2 md:py-0">
                {NAV_ITEMS.map((item) => {
                  const isActive = isActivePath(pathname, item);
                  return (
                    <li key={`${item.href}-${item.label}`}>
                      <Link
                        href={item.href}
                        className={`block px-4 py-2 md:px-0 md:py-0 text-white hover:text-blue-200 hover:bg-blue-800 md:hover:bg-transparent focus-visible:font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-inset md:focus-visible:ring-offset-2 md:focus-visible:ring-offset-blue-900 ${
                          isActive ? "font-bold bg-blue-800 md:bg-transparent" : ""
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          {/* Search - always on the right side */}
          <div className="flex items-center">
            <Search />
          </div>
        </div>
      </nav>
    </header>
  );
}


