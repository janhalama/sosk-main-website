// Client-side search component for posts. Provides a search icon button that opens
// a search input with dropdown results. Searches through post titles and content.
"use client";

import { Search as SearchIcon, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type SearchablePost = {
  title: string;
  slug: string;
  date: string;
  body: string;
};

type SearchResult = SearchablePost & {
  matchScore: number;
};

/**
 * Normalizes text for search by lowercasing and removing diacritics.
 */
function normalizeForSearch(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Calculates a simple match score based on query terms in title and body.
 */
function calculateMatchScore(post: SearchablePost, query: string): number {
  const normalizedQuery = normalizeForSearch(query);
  const normalizedTitle = normalizeForSearch(post.title);
  const normalizedBody = normalizeForSearch(post.body);

  let score = 0;

  // Title matches are weighted higher
  if (normalizedTitle.includes(normalizedQuery)) {
    score += 10;
    // Exact title match gets bonus
    if (normalizedTitle === normalizedQuery) {
      score += 5;
    }
  }

  // Body matches
  const bodyMatches = normalizedBody.split(normalizedQuery).length - 1;
  score += bodyMatches;

  // Check for individual word matches
  const queryWords = normalizedQuery.split(/\s+/).filter((w) => w.length > 0);
  queryWords.forEach((word) => {
    if (normalizedTitle.includes(word)) {
      score += 3;
    }
    if (normalizedBody.includes(word)) {
      score += 1;
    }
  });

  return score;
}

/**
 * Filters and scores posts based on search query.
 */
function searchPosts(posts: SearchablePost[], query: string): SearchResult[] {
  if (!query.trim()) {
    return [];
  }

  const normalizedQuery = normalizeForSearch(query.trim());
  const queryWords = normalizedQuery.split(/\s+/).filter((w) => w.length > 0);

  const results: SearchResult[] = posts
    .map((post) => ({
      ...post,
      matchScore: calculateMatchScore(post, query),
    }))
    .filter((result) => result.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 10); // Limit to top 10 results

  return results;
}

/**
 * Search component with icon button, input, and results dropdown.
 */
export function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<SearchablePost[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load posts on mount
  useEffect(() => {
    async function loadPosts() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/search/posts");
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error("Failed to load posts for search:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, []);

  // Update search results when query changes
  useEffect(() => {
    if (query.trim() && posts.length > 0) {
      const searchResults = searchPosts(posts, query);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query, posts]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setQuery("");
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        setQuery("");
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen]);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setQuery("");
    }
  }, [isOpen]);

  const handleResultClick = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

  return (
    <div ref={containerRef} className="relative flex items-center">
      {isOpen && (
        <div className="flex items-center gap-2 mr-2">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hledat v příspěvcích..."
            className="w-64 sm:w-80 px-3 py-1.5 text-sm text-white bg-blue-800 rounded border-0 placeholder:text-blue-300"
            style={{ outline: 'none' }}
            onFocus={(e) => e.target.style.outline = 'none'}
            onBlur={(e) => e.target.style.outline = 'none'}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Vymazat"
              className="text-blue-200 hover:text-white"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={handleToggle}
        aria-label="Vyhledat"
        aria-expanded={isOpen}
        className="flex items-center justify-center w-8 h-8 text-white hover:text-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900 rounded"
      >
        <SearchIcon className="w-5 h-5" aria-hidden="true" />
      </button>

      {isOpen && results.length > 0 && (
        <div className="absolute left-0 top-full mt-2 w-64 sm:w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="max-h-96 overflow-y-auto">
            <ul className="divide-y divide-gray-100">
              {results.map((result) => (
                <li key={result.slug}>
                  <Link
                    href={`/akce/${result.slug}`}
                    onClick={handleResultClick}
                    className="block p-3 hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
                  >
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      {result.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(result.date).toLocaleDateString("cs-CZ")}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {isOpen && query.trim() && results.length === 0 && !isLoading && (
        <div className="absolute left-0 top-full mt-2 w-64 sm:w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="p-4 text-sm text-gray-500 text-center">
            Žádné výsledky
          </div>
        </div>
      )}

      {isOpen && isLoading && (
        <div className="absolute left-0 top-full mt-2 w-64 sm:w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="p-4 text-sm text-gray-500 text-center">
            Načítání...
          </div>
        </div>
      )}
    </div>
  );
}

