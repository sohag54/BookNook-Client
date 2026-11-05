"use client";

import { Loader2, BookOpen } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center shadow-sm">
          <BookOpen className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <Loader2 className="absolute -inset-2 w-20 h-20 text-emerald-600/30 dark:text-emerald-400/30 animate-spin" />
      </div>
      <p className="mt-4 text-sm font-medium text-zinc-600 dark:text-zinc-400 animate-pulse">
        Loading BookNook...
      </p>
    </div>
  );
}

