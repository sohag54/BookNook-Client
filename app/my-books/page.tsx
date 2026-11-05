"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api-client";
import toast from "react-hot-toast";
import {
  Library,
  PlusCircle,
  Edit3,
  Trash2,
  AlertTriangle,
  X,
  Loader2,
  RefreshCw,
  BookOpen,
  ArrowRight,
  User,
  Layers,
  FileText,
  Hash,
  Image as ImageIcon,
} from "lucide-react";
import { Book } from "@/components/NewArrivals";

const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"];

export default function MyBooksPage() {
  const router = useRouter();
  const { data: sessionData, isPending } = useSession();
  const user = sessionData?.user;

  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit Modal State
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editCategory, setEditCategory] = useState("Fiction");
  const [editImage, setEditImage] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCopies, setEditCopies] = useState("1");
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Modal State (Custom confirmation modal per PDF)
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Dynamic Page Title
  useEffect(() => {
    document.title = "BookNook | My Books";
  }, []);

  // Private Route Protection
  useEffect(() => {
    if (!isPending && !user) {
      toast.error("Please log in to manage your books.");
      router.push(`/login?callbackUrl=${encodeURIComponent("/my-books")}`);
    }
  }, [isPending, user, router]);

  // Fetch only books added by the logged-in user
  const fetchMyBooks = async () => {
    if (!user?.email) return;
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`${apiUrl}/books?email=${encodeURIComponent(user.email)}`);

      if (!res.ok) {
        throw new Error(`Failed to load books: ${res.statusText}`);
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        setBooks(data);
      } else {
        setBooks([]);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load your books.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchMyBooks();
    }
  }, [user]);

  // Open Edit Modal with pre-filled book data
  const handleOpenEdit = (book: Book) => {
    setEditingBook(book);
    setEditTitle(book.title || "");
    setEditAuthor(book.author || "");
    setEditCategory(book.category || "Fiction");
    setEditImage(book.image || "");
    setEditDescription(book.description || "");
    setEditCopies(book.copies !== undefined ? book.copies.toString() : "1");
  };

  // Submit Book Update (PATCH /books/:id)
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;

    try {
      setIsUpdating(true);

      const response = await apiFetch<any>(`/books/${editingBook._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: editTitle.trim(),
          author: editAuthor.trim(),
          category: editCategory,
          image: editImage.trim(),
          description: editDescription.trim(),
          copies: parseInt(editCopies, 10),
        }),
      });

      if (response.error) {
        toast.error(response.error);
        setIsUpdating(false);
        return;
      }

      toast.success("Book updated successfully!");
      setEditingBook(null);
      await fetchMyBooks();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update book.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Submit Book Delete (DELETE /books/:id)
  const handleConfirmDelete = async () => {
    if (!deletingBook) return;

    try {
      setIsDeleting(true);

      const response = await apiFetch<any>(`/books/${deletingBook._id}`, {
        method: "DELETE",
      });

      if (response.error) {
        toast.error(response.error);
        setIsDeleting(false);
        return;
      }

      toast.success("Book deleted from the library catalog.");
      setDeletingBook(null);
      await fetchMyBooks();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete book.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Session Hydration Loading Spinner
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <p className="text-sm font-medium text-zinc-500">Checking your library account...</p>
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
        {/* Header with "Add Book" CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Library className="w-3.5 h-3.5" />
              <span>Personal Contributor Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
              My Books
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Manage the books you have added to BookNook. Edit details or remove titles from circulation.
            </p>
          </div>

          <Link
            href="/add-book"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm transition-colors shadow-sm cursor-pointer flex-shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Book</span>
          </Link>
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
              onClick={fetchMyBooks}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          </div>
        ) : books.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 px-4 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 mx-auto flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              You haven&apos;t added any books yet
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-md mx-auto">
              Share your favorite books with the BookNook community and track reader engagement here.
            </p>
            <Link
              href="/add-book"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Your First Book</span>
            </Link>
          </div>
        ) : (
          /* Table of My Books (PDF: Show only books logged in user added, in table or cards) */
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/75 dark:bg-zinc-850/50 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                    <th className="py-4 px-6">Book Details</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6 text-center">Available Copies</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                  {books.map((book) => (
                    <tr
                      key={book._id}
                      className="hover:bg-zinc-50/80 dark:hover:bg-zinc-850/40 transition-colors"
                    >
                      {/* Image & Title */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="relative w-14 h-20 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 shadow-sm">
                            <Image
                              src={book.image}
                              alt={book.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="max-w-xs">
                            <Link
                              href={`/books/${book._id}`}
                              className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-emerald-600 dark:hover:text-emerald-400 line-clamp-1 transition-colors"
                            >
                              {book.title}
                            </Link>
                            <p className="text-xs text-zinc-500 mt-0.5">By {book.author}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                          {book.category}
                        </span>
                      </td>

                      {/* Available Copies */}
                      <td className="py-4 px-6 text-center font-semibold text-zinc-700 dark:text-zinc-300">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${
                            (book.copies ?? 0) > 0
                              ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                              : "bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400"
                          }`}
                        >
                          {book.copies ?? 0}
                        </span>
                      </td>

                      {/* Actions: Edit & Delete Buttons (PDF Requirements) */}
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(book)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:border-emerald-500 text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingBook(book)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800/60 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit Book Modal (PDF: Pre-fills with old data, updates on submit) */}
      {editingBook && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setEditingBook(null)}
              disabled={isUpdating}
              className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
              Edit Book Information
            </h2>
            <p className="text-xs text-zinc-500 mb-6">
              Update details for &ldquo;{editingBook.title}&rdquo;
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  disabled={isUpdating}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    required
                    disabled={isUpdating}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Category
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    disabled={isUpdating}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Available Copies
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editCopies}
                    onChange={(e) => setEditCopies(e.target.value)}
                    required
                    disabled={isUpdating}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    required
                    disabled={isUpdating}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  required
                  disabled={isUpdating}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-sm font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm transition-colors cursor-pointer"
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal (PDF: not default browser confirm) */}
      {deletingBook && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Confirm Book Deletion
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
              Are you sure you want to delete &ldquo;
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {deletingBook.title}
              </span>
              &rdquo;? This will permanently remove it from the library catalog.
            </p>

            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingBook(null)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-bold shadow-sm transition-colors cursor-pointer"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>Delete Book</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

