"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api-client";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Layers,
  ShieldAlert,
  CheckCircle2,
  BookmarkPlus,
  Loader2,
  X,
  BookOpen,
} from "lucide-react";
import { Book, sampleFallbackBooks } from "@/components/NewArrivals";

function BookDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const bookId = params?.id as string;

  const { data: sessionData, isPending: isAuthPending } = useSession();
  const user = sessionData?.user;

  const [book, setBook] = useState<Book | null>(null);
  const [isLoadingBook, setIsLoadingBook] = useState(true);
  const [bookError, setBookError] = useState<string | null>(null);

  // Borrow Modal State
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [returnDate, setReturnDate] = useState("");
  const [minReturnDate, setMinReturnDate] = useState("");
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [borrowError, setBorrowError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // 1. Private Route Protection (Per assignment: redirect non-logged-in users to Login with callbackUrl)
  useEffect(() => {
    if (!isAuthPending && !user) {
      toast.error("Please log in to view book details and borrow books.");
      router.push(`/login?callbackUrl=${encodeURIComponent(`/books/${bookId}`)}`);
    }
  }, [isAuthPending, user, bookId, router]);

  // 2. Fetch Single Book by ID
  const fetchBookDetails = async () => {
    if (!bookId) return;
    try {
      setIsLoadingBook(true);
      setBookError(null);
      const res = await fetch(`${apiUrl}/books/${bookId}`);

      if (!res.ok) {
        const fallback = sampleFallbackBooks.find((b) => b._id === bookId);
        if (fallback) {
          setBook(fallback);
          document.title = `BookNook | ${fallback.title}`;
          return;
        }
        if (res.status === 404) {
          throw new Error("This book could not be found in our catalog.");
        }
        throw new Error(`Failed to load book: ${res.statusText}`);
      }

      const data = await res.json();
      setBook(data);
      if (data?.title) {
        document.title = `BookNook | ${data.title}`;
      }
    } catch (err: any) {
      const fallback = sampleFallbackBooks.find((b) => b._id === bookId);
      if (fallback) {
        setBook(fallback);
        document.title = `BookNook | ${fallback.title}`;
      } else {
        setBookError(err?.message || "Failed to load book information.");
      }
    } finally {
      setIsLoadingBook(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookDetails();
    }
  }, [bookId, user]);

  // Set default return date to 14 days in the future
  useEffect(() => {
    const today = new Date();
    setMinReturnDate(today.toISOString().split("T")[0]);
    const twoWeeksLater = new Date();
    twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
    setReturnDate(twoWeeksLater.toISOString().split("T")[0]);
  }, []);

  // 3. Handle Borrow Submission
  const handleConfirmBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    setBorrowError(null);

    if (!returnDate) {
      const msg = "Please select an expected return date.";
      setBorrowError(msg);
      toast.error(msg);
      return;
    }

    try {
      setIsBorrowing(true);

      const response = await apiFetch<any>("/borrows", {
        method: "POST",
        body: JSON.stringify({
          bookId: book?._id,
          returnDate: returnDate,
          userName: user?.name,
        }),
      });

      if (response.error) {
        setBorrowError(response.error);
        toast.error(response.error);
        setIsBorrowing(false);
        return;
      }

      toast.success(`Successfully borrowed "${book?.title}"! Happy reading.`);
      setIsBorrowModalOpen(false);

      // Refresh book data to reflect the decremented copies
      await fetchBookDetails();
    } catch (err: any) {
      const msg = err?.message || "An error occurred while borrowing this book.";
      setBorrowError(msg);
      toast.error(msg);
    } finally {
      setIsBorrowing(false);
    }
  };

  // If session is checking, show smooth loading spinner
  if (isAuthPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <p className="text-sm font-medium text-zinc-500">Verifying reader access...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, render null while redirecting
  if (!user) {
    return null;
  }

  return (
    <div className="w-full min-h-screen py-10 sm:py-16 bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation Button */}
        <div className="mb-8">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Books</span>
          </Link>
        </div>

        {/* Loading Book State */}
        {isLoadingBook ? (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 sm:p-12 animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="w-full h-96 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
              <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
              <div className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded w-full mt-6" />
              <div className="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-full mt-8" />
            </div>
          </div>
        ) : bookError ? (
          /* Book Error State */
          <div className="text-center py-16 px-4 bg-white dark:bg-zinc-900 rounded-3xl border border-red-200 dark:border-red-900/50 max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 mx-auto flex items-center justify-center mb-4">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Book Not Available
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              {bookError}
            </p>
            <Link
              href="/books"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors"
            >
              <span>Explore Other Books</span>
            </Link>
          </div>
        ) : book ? (
          /* Book Details Card - PDF Requirement */
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0">
            {/* Left: Book Cover Image */}
            <div className="md:col-span-5 relative min-h-[380px] md:min-h-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              <Image
                src={book.image}
                alt={book.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md text-emerald-600 dark:text-emerald-400 border border-zinc-200 dark:border-zinc-700 shadow-md">
                  {book.category}
                </span>
              </div>
            </div>

            {/* Right: Book Details & Borrow Action */}
            <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-between">
              <div>
                {/* Author */}
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>By {book.author}</span>
                </p>

                {/* Title */}
                <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
                  {book.title}
                </h1>

                {/* Metadata Badges */}
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {/* Available Copies Badge */}
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      (book.copies ?? 0) > 0
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                        : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>
                      {(book.copies ?? 0) > 0
                        ? `${book.copies} Copies Available`
                        : "Out of Stock (0 Available)"}
                    </span>
                  </div>

                  {/* Who Added It */}
                  {book.userName && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      <Mail className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Added by {book.userName}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mt-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Description
                  </h3>
                  <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                    {book.description}
                  </p>
                </div>
              </div>

              {/* Borrow Action Area */}
              <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                {(book.copies ?? 0) > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setBorrowError(null);
                      setIsBorrowModalOpen(true);
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-base transition-all shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 cursor-pointer"
                  >
                    <BookmarkPlus className="w-5 h-5" />
                    <span>Borrow This Book</span>
                  </button>
                ) : (
                  /* Disabled button when copies == 0 per Challenge Requirement */
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <button
                      type="button"
                      disabled
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-zinc-300 dark:bg-zinc-800 text-zinc-500 font-bold text-base cursor-not-allowed opacity-70"
                    >
                      <X className="w-5 h-5" />
                      <span>Not Available</span>
                    </button>
                    <span className="text-xs text-red-500 font-medium">
                      All copies are currently borrowed. Please check back later.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Borrow Confirmation Modal (PDF Requirement) */}
      {isBorrowModalOpen && book && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setIsBorrowModalOpen(false)}
              disabled={isBorrowing}
              className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              aria-label="Close borrow modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span>Confirm Borrowing</span>
              </div>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
                {book.title}
              </h2>
              <p className="text-xs text-zinc-500 mt-1">Author: {book.author}</p>
            </div>

            {/* Error in modal */}
            {borrowError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 leading-relaxed">
                {borrowError}
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleConfirmBorrow} className="space-y-4">
              {/* User Name (Read-Only per PDF) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  User Name (Read-only)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={user?.name || "BookNook Reader"}
                    readOnly
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 text-sm cursor-not-allowed select-none"
                  />
                </div>
              </div>

              {/* User Email (Read-Only per PDF) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  User Email (Read-only)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="email"
                    value={user?.email || ""}
                    readOnly
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 text-sm cursor-not-allowed select-none"
                  />
                </div>
              </div>

              {/* Return Date Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                  Expected Return Date *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="date"
                    value={returnDate}
                    min={minReturnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    required
                    disabled={isBorrowing}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">
                  You can return this book anytime before this date.
                </p>
              </div>

              {/* Submit & Cancel Buttons */}
              <div className="mt-6 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBorrowModalOpen(false)}
                  disabled={isBorrowing}
                  className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBorrowing}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-bold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isBorrowing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Borrowing...</span>
                    </>
                  ) : (
                    <span>Confirm Borrow</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      }
    >
      <BookDetailsContent />
    </Suspense>
  );
}

