"use client";

import Link from "next/link";
import { BookOpen, Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16 sm:py-24 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-md w-full text-center">
        {/* Decorative Graphic */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="w-24 h-24 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center shadow-inner">
            <BookOpen className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white shadow">
            404
          </span>
        </div>

        {/* Heading & Subtext */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Page Not Found
        </h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Oops! The page or library book you are looking for doesn&rsquo;t exist,
          has been moved, or is currently unavailable.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/books"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-zinc-400/50"
          >
            <Compass className="w-4 h-4" />
            Browse Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}

