"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api-client";
import toast from "react-hot-toast";
import {
  Bookmark,
  Calendar,
  RotateCcw,
  Loader2,
  BookOpen,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";

interface BorrowRecord {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  userName?: string;
  borrowDate: string;
  returnDate: string;
  createdAt?: string;
}

export default function MyBorrowsPage() {
  const router = useRouter();
  const { data: sessionData, isPending } = useSession();
  const user = sessionData?.user;

  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Return Book Confirmation Modal
  const [returningBorrow, setReturningBorrow] = useState<BorrowRecord | null>(null);
  const [isReturning, setIsReturning] = useState(false);

  // Dynamic Page Title
  useEffect(() => {
    document.title = "BookNook | My Borrows";
  }, []);

  // Private Route Protection
  useEffect(() => {
    if (!isPending && !user) {
      toast.error("Please log in to view your borrowed books.");
      router.push(`/login?callbackUrl=${encodeURIComponent("/my-borrows")}`);
    }
  }, [isPending, user, router]);

  // Fetch logged-in user's borrows (GET /borrows with JWT)
  const fetchBorrows = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiFetch<BorrowRecord[]>("/borrows");

      if (response.error) {
        throw new Error(response.error);
      }

      if (Array.isArray(response.data)) {
        setBorrows(response.data);
      } else {
        setBorrows([]);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load your borrowed books.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBorrows();
    }
  }, [user]);

  // Confirm and Execute Book Return (DELETE /borrows/:id with JWT)
  const handleConfirmReturn = async () => {
    if (!returningBorrow) return;

    try {
      setIsReturning(true);

      const response = await apiFetch<any>(`/borrows/${returningBorrow._id}`, {
        method: "DELETE",
      });

      if (response.error) {
        toast.error(response.error);
        setIsReturning(false);
        return;
      }

      toast.success(`"${returningBorrow.bookTitle}" has been returned. Thank you!`);
      setReturningBorrow(null);
      await fetchBorrows();
    } catch (err: any) {
      toast.error(err?.message || "Failed to return the book.");
    } finally {
      setIsReturning(false);
    }
  };

  // Session Hydration Check
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <p className="text-sm font-medium text-zinc-500">Retrieving your reading history...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="w-full min-h-screen py-10 sm:py-16 bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10 pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Active Reader Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            My Borrowed Books
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Track your current loans and return books when you finish reading to keep them available for others.
          </p>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 px-4 bg-white dark:bg-zinc-900 rounded-2xl border border-red-200 dark:border-red-900/50 max-w-md mx-auto">
            <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              type="button"
              onClick={fetchBorrows}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold cursor-pointer"
            >
              <span>Retry</span>
            </button>
          </div>
        ) : borrows.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 px-4 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 mx-auto flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              No Active Borrows
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-md mx-auto">
              You haven&apos;t borrowed any books from the library yet. Explore our catalog and pick your next read!
            </p>
            <Link
              href="/books"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-colors cursor-pointer"
            >
              <span>Explore All Books</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Table of Borrowed Books (PDF Requirement: Image, Title, Borrow Date, Return Date, Return Book button) */
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/75 dark:bg-zinc-850/50 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                    <th className="py-4 px-6">Book</th>
                    <th className="py-4 px-6">Borrow Date</th>
                    <th className="py-4 px-6">Due Return Date</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                  {borrows.map((borrow) => (
                    <tr
                      key={borrow._id}
                      className="hover:bg-zinc-50/80 dark:hover:bg-zinc-850/40 transition-colors"
                    >
                      {/* Image & Title */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="relative w-14 h-20 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 shadow-sm">
                            <Image
                              src={borrow.bookImage}
                              alt={borrow.bookTitle}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="max-w-xs">
                            <Link
                              href={`/books/${borrow.bookId}`}
                              className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-emerald-600 dark:hover:text-emerald-400 line-clamp-1 transition-colors"
                            >
                              {borrow.bookTitle}
                            </Link>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                              Active Loan
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Borrow Date */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                          <Calendar className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                          <span>{borrow.borrowDate}</span>
                        </div>
                      </td>

                      {/* Return Date */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 font-medium text-emerald-700 dark:text-emerald-400">
                          <Calendar className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>{borrow.returnDate}</span>
                        </div>
                      </td>

                      {/* Return Book Action Button (PDF Requirement) */}
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => setReturningBorrow(borrow)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 text-zinc-700 dark:text-zinc-300 font-semibold text-xs transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Return Book</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Return Confirmation Modal */}
      {returningBorrow && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-4">
              <RotateCcw className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Return Book to Library
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
              Are you sure you want to return &ldquo;
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {returningBorrow.bookTitle}
              </span>
              &rdquo;? This will replenish the library&apos;s available copy count for other readers.
            </p>

            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setReturningBorrow(null)}
                disabled={isReturning}
                className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmReturn}
                disabled={isReturning}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-bold shadow-sm transition-colors cursor-pointer"
              >
                {isReturning ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>Confirm Return</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

