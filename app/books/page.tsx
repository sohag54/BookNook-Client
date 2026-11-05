"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Filter,
  ArrowRight,
  BookOpen,
  User,
  Sparkles,
  Loader2,
  RefreshCw,
  Library,
} from "lucide-react";
import { Book } from "@/components/NewArrivals";

const categories = ["All", "Fiction", "Science", "History", "Kids", "Others"];

export default function AllBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Dynamic Page Title
  useEffect(() => {
    document.title = "BookNook | All Books";
  }, []);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`${apiUrl}/books`);

      if (!res.ok) {
        throw new Error(`Failed to fetch books: ${res.statusText}`);
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        setBooks(data);
        setFilteredBooks(data);
      } else {
        setBooks([]);
        setFilteredBooks([]);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to connect to library catalog server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let result = [...books];

    // Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter(
        (b) => b.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by Search query (Title or Author)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.author?.toLowerCase().includes(q)
      );
    }

    setFilteredBooks(result);
  }, [searchQuery, selectedCategory, books]);

  return (
    <div className="w-full min-h-screen py-10 sm:py-16 bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3">
            <Library className="w-3.5 h-3.5" />
            <span>Complete Collection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Explore All Books
          </h1>
          <p className="mt-3 text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            Browse our entire library catalog. Search by title or author, filter by category, and borrow your favorites.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 mb-10 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or author..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-colors"
              />
            </div>

            {/* Total Results Count */}
            <div className="text-sm font-medium text-zinc-500 flex-shrink-0">
              Showing{" "}
              <span className="text-zinc-900 dark:text-zinc-100 font-bold">
                {filteredBooks.length}
              </span>{" "}
              {filteredBooks.length === 1 ? "book" : "books"}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 scrollbar-none">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 mr-2 flex items-center gap-1 flex-shrink-0">
              <Filter className="w-3.5 h-3.5" />
              <span>Category:</span>
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900 animate-pulse flex flex-col"
              >
                <div className="w-full h-64 bg-zinc-200 dark:bg-zinc-800 rounded-xl mb-4" />
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3 mb-2" />
                <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4 mb-3" />
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full mb-auto" />
                <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-full mt-4" />
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="text-center py-16 px-4 bg-white dark:bg-zinc-900 rounded-2xl border border-red-200 dark:border-red-900/50 max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 mx-auto flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Unable to Load Books
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              {error}
            </p>
            <button
              type="button"
              onClick={fetchBooks}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Connection</span>
            </button>
          </div>
        ) : filteredBooks.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 px-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 mx-auto flex items-center justify-center mb-4">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              No Books Found
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              {searchQuery || selectedCategory !== "All"
                ? "Try adjusting your search query or category filter."
                : "No books are currently in the library catalog. Add one to get started!"}
            </p>
            {(searchQuery || selectedCategory !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="mt-5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          /* All Books Grid - 3 cards per row on desktop (PDF requirement) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredBooks.map((book) => (
              <div
                key={book._id}
                className="group flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300"
              >
                {/* Book Cover Image */}
                <div className="relative w-full h-64 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <Image
                    src={book.image}
                    alt={book.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-emerald-600 dark:text-emerald-400 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                      {book.category}
                    </span>
                  </div>
                  {/* Available Copies Badge */}
                  {book.copies !== undefined && (
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm ${
                          book.copies > 0
                            ? "bg-emerald-600/90 text-white"
                            : "bg-red-600/90 text-white"
                        }`}
                      >
                        {book.copies > 0
                          ? `${book.copies} available`
                          : "Not Available"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    <span>{book.author}</span>
                  </p>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {book.title}
                  </h2>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed flex-1">
                    {book.description}
                  </p>

                  {/* View Details Button linking to /books/:id (PDF Requirement) */}
                  <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <Link
                      href={`/books/${book._id}`}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm transition-colors shadow-sm cursor-pointer"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

